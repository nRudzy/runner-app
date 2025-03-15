FROM node:20-slim

# Environment variables definition
ENV EXPO_VERSION=52.0.37
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# System dependencies installation
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    sudo \
    openssh-client \
    openssl \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Global dependencies installation (as root)
RUN npm install -g expo-cli @expo/cli eas-cli

# Creating a non-root user
RUN useradd -m -s /bin/bash developer && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/developer && \
    mkdir -p /app && \
    chown -R developer:developer /app

# Working directory configuration
WORKDIR /app

# Switch to the developer user for subsequent operations
USER developer

# Exposing required ports
# 8081: Metro bundler
# 19000: Expo Go app
# 19001: Expo manifest
# 19002: Expo Developer Tools
EXPOSE 8081 19000 19001 19002

# Default command
CMD ["npm", "start"] 