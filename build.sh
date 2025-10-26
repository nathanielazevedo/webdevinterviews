#!/bin/bash

# Exit on any error
set -e

echo "Installing root dependencies..."
npm install

echo "Building shared package..."
cd shared
npm install
npm run build
cd ..

echo "Building backend package..."
cd packages/backend
npm install
npm run build
cd ../..

echo "Build completed successfully!"