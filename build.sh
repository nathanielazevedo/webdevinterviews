#!/bin/bash

# Exit on any error
set -e

echo "Installing root dependencies..."
npm install

echo "Installing shared package dependencies..."
cd shared
npm install
cd ..

echo "Building backend package..."
cd packages/backend
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npm run build

cd ../..

echo "Build completed successfully!"