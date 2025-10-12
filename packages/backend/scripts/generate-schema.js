#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import SchemaGenerator from '../src/docs/schema-generator.js';

/**
 * Utility script to generate and export OpenAPI schema
 * Usage: node generate-schema.js [output-file]
 */
async function generateSchemaFile() {
  try {
    const generator = new SchemaGenerator();
    const schema = await generator.generateSchema();
    
    // Default output file
    let outputFile = process.argv[2] || 'generated/api-schema.json';
    
    // Ensure .json extension
    if (!outputFile.endsWith('.json')) {
      outputFile += '.json';
    }
    
    // Write schema to file
    const outputPath = path.resolve(outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));
    
    console.log(`✅ OpenAPI schema generated successfully!`);
    console.log(`📄 Schema saved to: ${outputPath}`);
    console.log(`📊 Schema contains:`);
    console.log(`   - ${Object.keys(schema.paths).length} REST endpoints`);
    console.log(`   - ${Object.keys(schema.components.schemas).length} type definitions`);
    console.log(`   - ${schema['x-websocket'].messageTypes.incoming.length} WebSocket incoming message types`);
    console.log(`   - ${schema['x-websocket'].messageTypes.outgoing.length} WebSocket outgoing message types`);
    
    console.log(`\n🚀 You can now:`);
    console.log(`   - View API docs at: http://localhost:3001/api/docs`);
    console.log(`   - Get schema JSON at: http://localhost:3001/api/schema`);
    console.log(`   - Use ${outputFile} for frontend type generation`);
    
    // Generate TypeScript types hint
    console.log(`\n💡 For TypeScript types, you can use:`);
    console.log(`   - openapi-typescript: npx openapi-typescript ${outputFile} -o types.ts`);
    console.log(`   - @apidevtools/swagger-parser for validation`);
    console.log(`   - @openapitools/openapi-generator-cli for client generation`);
    
  } catch (error) {
    console.error('❌ Error generating schema:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateSchemaFile();