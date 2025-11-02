# WebDev Interviews Backend

Real-time coding battle WebSocket and REST API server. 

## Structure

```
src/
├── index.js              # Main server entry point
├── config/
│   └── database.js       # Supabase database configuration
├── services/
│   ├── battle.service.js # Battle management logic
│   └── questions.service.js # LeetCode questions management
├── utils/
│   └── logger.js        # Shared logging utility
└── docs/
    └── schema-generator.js # OpenAPI schema generation

scripts/
└── generate-schema.js   # CLI tool for generating API docs

migrations/
├── migrate.config.js    # Database migration configuration
└── [migration-files]   # Database schema evolution

generated/              # Auto-generated files (gitignored)
├── api-schema.json    # OpenAPI schema
└── types.ts          # TypeScript API types
```

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start with hot reload
- `npm run schema:generate` - Generate OpenAPI schema
- `npm run types:generate` - Generate TypeScript types
- `npm run migrate:up` - Run database migrations

## API Documentation

- REST API docs: `http://localhost:3001/api/docs`
- WebSocket docs: `http://localhost:3001/api/ws-docs`
- OpenAPI schema: `http://localhost:3001/api/schema`