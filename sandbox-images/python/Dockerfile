FROM python:3.11-alpine

# Create non-root sandbox user
RUN addgroup -g 1000 sandbox && \
    adduser -u 1000 -G sandbox -D -s /bin/sh sandbox

# Set workspace directory
WORKDIR /workspace
RUN chown -R sandbox:sandbox /workspace

USER sandbox
