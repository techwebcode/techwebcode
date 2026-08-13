FROM golang:1.25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git ca-certificates

COPY ../go.mod ../go.sum ./ 2>/dev/null || COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
    -tags netgo \
    -ldflags="-s -w" \
    -o server ./cmd/server

FROM alpine:3.22

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]