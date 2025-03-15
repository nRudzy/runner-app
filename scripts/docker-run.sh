#!/bin/bash

# Check if scripts directory exists, create it if not
mkdir -p scripts

# Help function
print_help() {
    echo "Usage: ./scripts/docker-run.sh [COMMAND]"
    echo ""
    echo "Available commands:"
    echo "  setup      - Build Docker image and install dependencies"
    echo "  start      - Start React Native application in Docker"
    echo "  android    - Launch application on Android emulator/device"
    echo "  ios        - Launch application on iOS simulator/device"
    echo "  shell      - Open a shell in the container"
    echo "  logs       - Display container logs"
    echo "  stop       - Stop containers"
    echo "  help       - Display this help message"
    echo ""
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "Docker is not installed. Please install it before continuing."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "Docker Compose is not installed. Please install it before continuing."
        exit 1
    fi
}

# Check if Docker is installed
check_docker

# Command processing
case "$1" in
    setup)
        echo "Setting up Docker environment..."
        docker-compose build
        docker-compose run --rm expo npm install
        echo "Setup complete!"
        ;;
    start)
        echo "Starting React Native application in Docker..."
        docker-compose up
        ;;
    android)
        echo "Launching application on Android..."
        docker-compose exec expo npm run android
        ;;
    ios)
        echo "Launching application on iOS..."
        docker-compose exec expo npm run ios
        ;;
    shell)
        echo "Opening a shell in the container..."
        docker-compose exec expo /bin/bash
        ;;
    logs)
        echo "Displaying logs..."
        docker-compose logs -f
        ;;
    stop)
        echo "Stopping containers..."
        docker-compose down
        ;;
    help|*)
        print_help
        ;;
esac

exit 0 