package controller

import (
	"fmt"
	"net/http"
	"net/smtp"

	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/techwebcode/techwebcode/backend/config"
	"github.com/techwebcode/techwebcode/backend/database"
	"github.com/techwebcode/techwebcode/backend/models"
	"gorm.io/gorm"
)

type ContactController struct {
	db *gorm.DB
}

func NewContactController(db *gorm.DB) *ContactController {
	return &ContactController{db: db}
}

func (c *ContactController) getDB() *gorm.DB {
	if c != nil && c.db != nil {
		return c.db
	}
	return database.DB
}

type ContactSubmissionRequest struct {
	Name          string `json:"name" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	Reason        string `json:"reason" binding:"required"`
	RelatedToolID *uint  `json:"related_tool_id"`
	Subject       string `json:"subject" binding:"required"`
	Message       string `json:"message" binding:"required"`
	WebsiteURLHp  string `json:"website_url_hp"` // Honeypot field
}

// SubmitContactMessage handles visitor contact form submissions
func (c *ContactController) SubmitContactMessage(ctx *gin.Context) {
	db := c.getDB()
	if db == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Database connection is not initialized",
		})
		return
	}

	var req ContactSubmissionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid form fields. Please check your inputs.",
			"error":   err.Error(),
		})
		return
	}

	// 1. Length & Format Validations
	if len(strings.TrimSpace(req.Name)) < 2 || len(req.Name) > 150 {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Name must be between 2 and 150 characters."})
		return
	}
	if len(strings.TrimSpace(req.Subject)) < 3 || len(req.Subject) > 255 {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Subject must be between 3 and 255 characters."})
		return
	}
	if len(strings.TrimSpace(req.Message)) < 10 || len(req.Message) > 5000 {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Message must be between 10 and 5000 characters."})
		return
	}

	// 2. Honeypot Anti-Spam Check
	status := "new"
	if strings.TrimSpace(req.WebsiteURLHp) != "" {
		status = "spam"
	}

	// 3. Rate-Limiting Check (Max 5 submissions per IP in last hour)
	clientIP := ctx.ClientIP()
	var count int64
	oneHourAgo := time.Now().Add(-1 * time.Hour)
	db.Model(&models.ContactMessage{}).
		Where("ip_address = ? AND created_at > ?", clientIP, oneHourAgo).
		Count(&count)

	if count >= 5 {
		ctx.JSON(http.StatusTooManyRequests, gin.H{
			"success": false,
			"message": "Too many contact submissions from your IP address. Please try again in an hour.",
		})
		return
	}

	// 4. Save to Database
	contactMsg := models.ContactMessage{
		Name:          strings.TrimSpace(req.Name),
		Email:         strings.TrimSpace(req.Email),
		Reason:        strings.TrimSpace(req.Reason),
		RelatedToolID: req.RelatedToolID,
		Subject:       strings.TrimSpace(req.Subject),
		Message:       strings.TrimSpace(req.Message),
		Status:        status,
		IPAddress:     clientIP,
	}

	if err := db.Create(&contactMsg).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to save message to database. Please try again later.",
		})
		return
	}

	// 5. Send Async Email Notification to support@techwebcode.in
	if status != "spam" {
		go sendEmailNotification(contactMsg)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Thank you for reaching out! Your message has been submitted successfully.",
		"data": gin.H{
			"id": contactMsg.ID,
		},
	})
}

// GetContactMessages fetches all messages for Admin Dashboard
func (c *ContactController) GetContactMessages(ctx *gin.Context) {
	db := c.getDB()
	if db == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not initialized"})
		return
	}

	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	statusFilter := ctx.Query("status")
	search := ctx.Query("search")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit
	query := db.Model(&models.ContactMessage{}).Preload("RelatedTool")

	if statusFilter != "" && statusFilter != "all" {
		query = query.Where("status = ?", statusFilter)
	}

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?", searchTerm, searchTerm, searchTerm, searchTerm)
	}

	var total int64
	query.Count(&total)

	var messages []models.ContactMessage
	if err := query.Order("created_at DESC").Offset(offset).Limit(limit).Find(&messages).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch contact messages"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    messages,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": total,
		},
	})
}

// GetContactMessageByID fetches a single message by ID
func (c *ContactController) GetContactMessageByID(ctx *gin.Context) {
	db := c.getDB()
	if db == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not initialized"})
		return
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid message ID"})
		return
	}

	var msg models.ContactMessage
	if err := db.Preload("RelatedTool").First(&msg, id).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Contact message not found"})
		return
	}

	// Auto-mark as read if new
	if msg.Status == "new" {
		db.Model(&msg).Update("status", "read")
		msg.Status = "read"
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "data": msg})
}

// UpdateContactMessageStatus updates the status of a message
func (c *ContactController) UpdateContactMessageStatus(ctx *gin.Context) {
	db := c.getDB()
	if db == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not initialized"})
		return
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid message ID"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Status field is required"})
		return
	}

	validStatuses := map[string]bool{"new": true, "read": true, "replied": true, "resolved": true, "spam": true}
	if !validStatuses[req.Status] {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid status value"})
		return
	}

	if err := db.Model(&models.ContactMessage{}).Where("id = ?", id).Update("status", req.Status).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update message status"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "message": "Message status updated successfully"})
}

// DeleteContactMessage deletes a message record
func (c *ContactController) DeleteContactMessage(ctx *gin.Context) {
	db := c.getDB()
	if db == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not initialized"})
		return
	}

	idParam := ctx.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid message ID"})
		return
	}

	if err := db.Delete(&models.ContactMessage{}, id).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete message"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": true, "message": "Message deleted successfully"})
}

func sendEmailNotification(msg models.ContactMessage) {
	smtpHost := config.Get("SMTP_HOST")
	smtpPort := config.Get("SMTP_PORT")
	smtpUser := config.Get("SMTP_USER")
	smtpPass := config.Get("SMTP_PASS")
	supportEmail := config.Get("SUPPORT_EMAIL")

	if supportEmail == "" {
		supportEmail = "support@techwebcode.in"
	}

	if smtpHost == "" || smtpUser == "" {
		// Log if SMTP not configured in development
		fmt.Printf("[Contact Email Log] New contact message #%d from %s (%s): %s\n", msg.ID, msg.Name, msg.Email, msg.Subject)
		return
	}

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	to := []string{supportEmail}

	subjectHeader := fmt.Sprintf("Subject: [TechWebCode Support] %s - %s\r\n", msg.Reason, msg.Subject)
	replyToHeader := fmt.Sprintf("Reply-To: %s <%s>\r\n", msg.Name, msg.Email)
	fromHeader := fmt.Sprintf("From: TechWebCode Contact Form <%s>\r\n", smtpUser)
	mimeHeader := "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n"

	body := fmt.Sprintf(
		"New Support Message Received on TechWebCode:\n\n"+
			"Name: %s\n"+
			"Email: %s\n"+
			"Reason: %s\n"+
			"Subject: %s\n"+
			"IP Address: %s\n\n"+
			"Message:\n%s\n",
		msg.Name, msg.Email, msg.Reason, msg.Subject, msg.IPAddress, msg.Message,
	)

	messageStr := fromHeader + replyToHeader + subjectHeader + mimeHeader + body

	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)
	if smtpPort == "" {
		addr = fmt.Sprintf("%s:587", smtpHost)
	}

	if err := smtp.SendMail(addr, auth, smtpUser, to, []byte(messageStr)); err != nil {
		fmt.Printf("[Email Error] Failed to send notification email for message #%d: %v\n", msg.ID, err)
	}
}
