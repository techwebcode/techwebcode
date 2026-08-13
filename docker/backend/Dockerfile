# Build Stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
    -tags netgo \
    -ldflags="-s -w" \
    -o /app/server ./backend/cmd/server

# Final Production Runtime Stage
FROM alpine:3.22

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /app/server .
COPY --from=builder /app/backend/seeders ./seeders

EXPOSE 8080

CMD ["./server"]
