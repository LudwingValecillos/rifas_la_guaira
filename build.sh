#!/bin/bash

# Install dependencies
bun install

# Build the project
bun run build

# Ensure the dist directory exists
if [ ! -d "dist" ]; then
    echo "Build failed: dist directory was not created"
    exit 1
fi

echo "Build completed successfully" 