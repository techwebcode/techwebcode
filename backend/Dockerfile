
FROM golang:1.26 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    libwebp-dev \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 \
    go build \
    -tags netgo \
    -ldflags="-s -w" \
    -o server ./cmd/server

FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tzdata \
    libwebp7 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
