import { Router, Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { logger } from '../utils/logger.js';

const log = logger;

export function createApiRoutes() {
  const router = Router();

  // Simple OpenAPI schema for current battle endpoints
  router.get('/schema', (req: Request, res: Response) => {
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Portfolio Battle API',
        version: '1.0.0',
        description: 'Real-time coding battle WebSocket and REST API'
      },
      servers: [{ url: 'http://localhost:3001' }],
      paths: {
        '/': {
          get: {
            summary: 'Health check',
            responses: {
              '200': {
                description: 'Server status',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/battle/current': {
          get: {
            summary: 'Get current battle',
            responses: {
              '200': {
                description: 'Current battle info',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        battle: { 
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            status: { type: 'string', enum: ['waiting', 'active', 'completed'] },
                            started_at: { type: 'string', format: 'date-time', nullable: true },
                            duration_minutes: { type: 'integer' }
                          }
                        },
                        questions: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              title: { type: 'string' },
                              description: { type: 'string' },
                              difficulty: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/battle/players': {
          get: {
            summary: 'Get battle players',
            responses: {
              '200': {
                description: 'List of players',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        players: { 
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              userId: { type: 'string' },
                              testsPassed: { type: 'integer' },
                              totalTests: { type: 'integer' },
                              joinedAt: { type: 'string', format: 'date-time' },
                              isConnected: { type: 'boolean' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/battle/status': {
          get: {
            summary: 'Get battle status',
            responses: {
              '200': {
                description: 'Battle status',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        battle: { 
                          type: 'object',
                          nullable: true,
                          properties: {
                            id: { type: 'string' },
                            status: { type: 'string' }
                          }
                        },
                        canJoin: { type: 'boolean' },
                        message: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/user/{userId}/battles': {
          get: {
            summary: 'Get user battle history',
            parameters: [
              {
                name: 'userId',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              },
              {
                name: 'limit',
                in: 'query',
                schema: { type: 'integer', default: 50 }
              }
            ],
            responses: {
              '200': {
                description: 'User battle history',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        battles: { type: 'array' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/user/{userId}/stats': {
          get: {
            summary: 'Get user stats',
            parameters: [
              {
                name: 'userId',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              '200': {
                description: 'User statistics',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        stats: {
                          type: 'object',
                          properties: {
                            total_battles: { type: 'integer' },
                            wins: { type: 'integer' },
                            win_rate: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'x-websocket': {
        url: 'ws://localhost:3001',
        description: 'Real-time battle communication (no rooms - single battle instance)',
        messageTypes: {
          incoming: [
            {
              name: 'join',
              description: 'Join the current battle',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['join'] },
                  userId: { type: 'string' }
                }
              }
            },
            {
              name: 'start-battle',
              description: 'Start battle (admin only)',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['start-battle'] }
                }
              }
            },
            {
              name: 'test-results',
              description: 'Submit test results',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['test-results'] },
                  passed: { type: 'integer' },
                  total: { type: 'integer' }
                }
              }
            }
          ],
          outgoing: [
            {
              name: 'battle-status',
              description: 'Battle status update',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['battle-status'] },
                  status: { type: 'string' },
                  isAdmin: { type: 'boolean' },
                  battleId: { type: 'string' }
                }
              }
            },
            {
              name: 'battle-started',
              description: 'Battle started notification',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['battle-started'] },
                  battleId: { type: 'string' },
                  startedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            {
              name: 'players-list',
              description: 'Updated player list',
              schema: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['players-list'] },
                  players: { type: 'array' }
                }
              }
            }
          ]
        }
      }
    };
    
    log.info('Serving updated OpenAPI schema for simplified battle API');
    res.json(schema);
  });

  // Swagger UI documentation endpoint  
  router.use('/docs', swaggerUi.serve);
  router.get('/docs', (req: Request, res: Response) => {
    // Get the schema from our simplified schema endpoint
    const schema = {
      openapi: '3.0.0',
      info: {
        title: 'Portfolio Battle API',
        version: '1.0.0',
        description: 'Real-time coding battle WebSocket and REST API'
      },
      servers: [{ url: 'http://localhost:3001' }],
      paths: {
        '/': {
          get: {
            summary: 'Health check',
            responses: {
              '200': {
                description: 'Server status',
                content: {
                  'application/json': {
                    schema: { type: 'object', properties: { status: { type: 'string' } } }
                  }
                }
              }
            }
          }
        },
        '/battle/current': {
          get: {
            summary: 'Get current battle',
            responses: {
              '200': {
                description: 'Current battle info',
                content: { 'application/json': { schema: { type: 'object' } } }
              }
            }
          }
        },
        '/battle/players': {
          get: {
            summary: 'Get battle players',
            responses: {
              '200': {
                description: 'List of players',
                content: { 'application/json': { schema: { type: 'object' } } }
              }
            }
          }
        },
        '/battle/status': {
          get: {
            summary: 'Get battle status',
            responses: {
              '200': {
                description: 'Battle status',
                content: { 'application/json': { schema: { type: 'object' } } }
              }
            }
          }
        }
      }
    };
    
    const swaggerUiHtml = swaggerUi.generateHTML(schema, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Portfolio Battle API Documentation'
    });
    res.send(swaggerUiHtml);
  });

  // WebSocket documentation endpoint
  router.get('/ws-docs', (req: Request, res: Response) => {
    log.info('WebSocket documentation requested');
    res.sendFile(path.join(process.cwd(), 'websocket-docs.html'));
  });

  return router;
}