# Dockerization of the Runner Application

This document explains how to use the Docker environment to develop the Runner application without having to install Node.js, Expo, or other dependencies locally.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (with Docker Compose)
- A mobile device with [Expo Go](https://expo.dev/client) installed to test the application on a physical device

## Docker Files Structure

- `Dockerfile`: Configuration of the React Native development environment
- `docker-compose.yml`: Docker services configuration to facilitate development
- `scripts/docker-run.sh`: Helper script for common commands (for Linux/macOS)
- `scripts/docker-run.bat`: Helper script for common commands (for Windows)

## Quick Start

### On Windows

You can use the provided batch script:

1. Set up the environment:
   ```
   scripts\docker-run.bat setup
   ```

2. Start the application:
   ```
   scripts\docker-run.bat start
   ```

3. Scan the QR code with the Expo Go app on your mobile device or launch the application on an emulator

Alternatively, you can directly use Docker Compose commands:

1. Build the Docker image and install dependencies:
   ```
   docker-compose build
   docker-compose run --rm expo npm install
   ```

2. Start the application:
   ```
   docker-compose up
   ```

### On Linux/macOS

You can use the provided shell script:

1. Make the script executable:
   ```
   chmod +x scripts/docker-run.sh
   ```

2. Set up the environment:
   ```
   ./scripts/docker-run.sh setup
   ```

3. Start the application:
   ```
   ./scripts/docker-run.sh start
   ```

## Useful Commands

### Using Helper Scripts

#### Windows
```
scripts\docker-run.bat setup   # Set up the environment
scripts\docker-run.bat start   # Start the application
scripts\docker-run.bat logs    # Display logs
scripts\docker-run.bat shell   # Open a shell in the container
scripts\docker-run.bat stop    # Stop containers
scripts\docker-run.bat android # Launch on Android
scripts\docker-run.bat ios     # Launch on iOS
```

#### Linux/macOS
```
./scripts/docker-run.sh setup   # Set up the environment
./scripts/docker-run.sh start   # Start the application
./scripts/docker-run.sh logs    # Display logs
./scripts/docker-run.sh shell   # Open a shell in the container
./scripts/docker-run.sh stop    # Stop containers
./scripts/docker-run.sh android # Launch on Android
./scripts/docker-run.sh ios     # Launch on iOS
```

### Using Docker Compose Directly

#### Start the application
```
docker-compose up
```

#### Display logs
```
docker-compose logs -f
```

#### Open a shell in the container
```
docker-compose exec expo /bin/bash
```

#### Stop containers
```
docker-compose down
```

#### Run a specific Expo command
```
docker-compose exec expo expo [command]
```
For example:
```
docker-compose exec expo expo doctor
```

#### Launch on Android (requires an emulator or connected device)
```
docker-compose exec expo npm run android
```

#### Launch on iOS (macOS only, requires a simulator)
```
docker-compose exec expo npm run ios
```

## Development with Docker

When working with this Docker environment:

1. All your project files are synchronized with the container thanks to the volume configured in `docker-compose.yml`
2. Code changes are automatically detected and the application reloads
3. The `node_modules` volume is managed by Docker, which avoids compatibility issues with your operating system

## Development Tips

- If you need to install new dependencies, use:
  ```
  docker-compose exec expo npm install [package-name]
  ```
- To access your application from a physical device, make sure your device is on the same Wi-Fi network as your computer
- On Windows, you may need to configure the firewall to allow incoming connections on ports 19000-19002

## Troubleshooting

### Connection Issues with Expo Go

If your device cannot connect to the application, try manually specifying your computer's IP address:

```
docker-compose down
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.x docker-compose up
```
(Replace 192.168.1.x with your computer's IP address)

On Windows, you can set a temporary environment variable:
```
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.x
docker-compose up
```

### Expo Won't Start

Check that the required ports are available and not used by other applications:
- 8081 (Metro bundler)
- 19000 (Expo Go app)
- 19001 (Expo manifest)
- 19002 (Expo Developer Tools)

### Permission Issues

If you encounter permission issues on Linux, try running Docker with your current user:

```
docker-compose run --rm --user $(id -u):$(id -g) expo npm install
``` 