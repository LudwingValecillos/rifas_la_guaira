#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
bun install

# Build the project
echo "Building the project..."
bun run build

# Verify the dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory was not created"
    exit 1
fi

echo "Build completed successfully" 