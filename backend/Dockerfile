FROM golang:alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /wetbulb .

FROM alpine:3.24
# CA certificates for the HTTPS calls to Open-Meteo.
RUN apk --no-cache add ca-certificates && adduser -D -u 10001 app
COPY --from=builder /wetbulb /usr/local/bin/wetbulb
USER app

ENV PORT=8080
EXPOSE 8080
CMD ["wetbulb"]
