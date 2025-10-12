#!/usr/bin/env node

/**
 * Simple API Generator
 * Generates TypeScript types from OpenAPI schema using openapi-typescript
 */

import { execSync } from 'child_process';

const SCHEMA_URL = 'http://localhost:3001/api/schema';
const OUTPUT_PATH = 'shared/src/api/schema.ts';

console.log('🚀 Generating TypeScript types from OpenAPI schema...');
console.log(`📡 Schema URL: ${SCHEMA_URL}`);
console.log(`📁 Output: ${OUTPUT_PATH}`);
console.log('');

try {
  execSync(`npx openapi-typescript ${SCHEMA_URL} -o ${OUTPUT_PATH}`, {
    stdio: 'inherit'
  });
  
  console.log('');
  console.log('✅ API types generated successfully!');
  console.log('');
  console.log('📚 Usage:');
  console.log('  import { apiClient } from "./api/client";');
  console.log('  ');
  console.log('  const { data, error } = await apiClient.GET("/api/endpoint");');
  console.log('');
} catch (error) {
  console.error('❌ Error generating API types:', error.message);
  process.exit(1);
}