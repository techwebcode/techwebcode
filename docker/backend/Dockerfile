# Build Stage
FROM golang:alpine AS builder

WORKDIR /app

ENV GOTOOLCHAIN=auto

RUN apk add --no-cache git ca-certificates tzdata gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 GOOS=linux \
    go build \
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
