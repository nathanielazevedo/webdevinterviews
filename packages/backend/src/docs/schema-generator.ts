import { BattleService } from '../services/battle.service.js';

/**
 * OpenAPI Schema Types
 */
interface OpenAPIInfo {
  title: string;
  version: string;
  description: string;
  contact: {
    name: string;
    email: string;
  };
}

interface OpenAPIServer {
  url: string;
  description: string;
}

interface OpenAPISchema {
  openapi: string;
  info: OpenAPIInfo;
  servers: OpenAPIServer[];
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    responses: Record<string, any>;
    parameters: Record<string, any>;
  };
}

/**
 * Auto-generates OpenAPI schema by analyzing the codebase
 */
export default class SchemaGenerator {
  private baseSchema: OpenAPISchema;

  constructor() {
    this.baseSchema = {
      openapi: '3.0.0',
      info: {
        title: 'Portfolio Battle API',
        version: '1.0.0',
        description: 'Real-time coding battle WebSocket and REST API',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server'
        }
      ],
      paths: {},
      components: {
        schemas: {},
        responses: {},
        parameters: {}
      }
    };
  }

  /**
   * Generates the complete OpenAPI schema
   */
  async generateSchema(): Promise<OpenAPISchema> {
    // Generate REST API paths
    this.generateRestPaths();
    
    // Generate component schemas (includes parameters)
    this.generateSchemas();
    
    // Generate WebSocket documentation (as custom extension)
    this.generateWebSocketDocs();
    
    // Generate responses
    this.generateResponses();
    
    return this.baseSchema;
  }

  /**
   * Generates REST API endpoint definitions
   */
  private generateRestPaths(): void {
    this.baseSchema.paths = {
      '/': {
        get: {
          summary: 'Health check',
          description: 'Returns server status',
          responses: {
            '200': {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/room/{roomId}/players': {
        get: {
          summary: 'Get players in a room',
          description: 'Returns all players currently in the specified room',
          parameters: [
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'The room identifier'
            }
          ],
          responses: {
            '200': {
              '$ref': '#/components/responses/PlayersResponse'
            }
          }
        }
      },
      '/room/{roomId}/battle': {
        get: {
          summary: 'Get battle status for a room',
          description: 'Returns the current battle information for the specified room',
          parameters: [
            {
              name: 'roomId',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'The room identifier'
            }
          ],
          responses: {
            '200': {
              '$ref': '#/components/responses/BattleStatusResponse'
            }
          }
        }
      },
      '/user/{userId}/battles': {
        get: {
          summary: 'Get user battle history',
          description: 'Returns the battle history for a specific user',
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'The user identifier'
            },
            {
              name: 'limit',
              in: 'query',
              schema: {
                type: 'integer',
                default: 50
              },
              description: 'Maximum number of battles to return'
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
                      battles: {
                        type: 'array',
                        items: {
                          '$ref': '#/components/schemas/Battle'
                        }
                      }
                    }
                  }
                }
              }
            },
            '500': {
              '$ref': '#/components/responses/ErrorResponse'
            }
          }
        }
      },
      '/user/{userId}/stats': {
        get: {
          summary: 'Get user battle statistics',
          description: 'Returns comprehensive battle statistics for a user',
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'The user identifier'
            }
          ],
          responses: {
            '200': {
              '$ref': '#/components/responses/UserStatsResponse'
            },
            '500': {
              '$ref': '#/components/responses/ErrorResponse'
            }
          }
        }
      },
      '/rooms/status': {
        get: {
          summary: 'Get status of multiple rooms',
          description: 'Returns status information for multiple rooms at once',
          parameters: [
            {
              name: 'roomIds',
              in: 'query',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'Comma-separated list of room IDs'
            }
          ],
          responses: {
            '200': {
              description: 'Room statuses',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      rooms: {
                        type: 'object',
                        additionalProperties: {
                          '$ref': '#/components/schemas/RoomStatus'
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              '$ref': '#/components/responses/ErrorResponse'
            }
          }
        }
      }
    };
  }

  /**
   * Generates component schemas
   */
  private generateSchemas(): void {
    this.baseSchema.components.schemas = {
      Battle: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          room_id: { type: 'string' },
          status: { 
            type: 'string', 
            enum: ['waiting', 'active', 'completed'] 
          },
          admin_user_id: { type: 'string' },
          participants: {
            type: 'array',
            items: {
              '$ref': '#/components/schemas/BattleParticipant'
            }
          },
          duration_minutes: { type: 'integer' },
          started_at: { 
            type: 'string', 
            format: 'date-time',
            nullable: true 
          },
          completed_at: { 
            type: 'string', 
            format: 'date-time',
            nullable: true 
          },
          created_at: { type: 'string', format: 'date-time' },
          scheduled_start_time: { 
            type: 'string', 
            format: 'date-time',
            nullable: true 
          },
          auto_end_time: { 
            type: 'string', 
            format: 'date-time',
            nullable: true 
          }
        }
      },
      BattleParticipant: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          joinedAt: { type: 'string', format: 'date-time' },
          testsPassed: { type: 'integer', default: 0 },
          totalTests: { type: 'integer', default: 0 }
        }
      },
      Player: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          testsPassed: { type: 'integer' },
          totalTests: { type: 'integer' },
          joinedAt: { type: 'string', format: 'date-time' },
          isConnected: { type: 'boolean' }
        }
      },
      RoomStatus: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          canJoin: { type: 'boolean' },
          isActive: { type: 'boolean' },
          isWaiting: { type: 'boolean' },
          isCompleted: { type: 'boolean' },
          connectedPlayers: { type: 'integer' },
          participantCount: { type: 'integer' },
          startedAt: { 
            type: 'string', 
            format: 'date-time',
            nullable: true 
          }
        }
      },
      UserStats: {
        type: 'object',
        properties: {
          total_battles: { type: 'integer' },
          wins: { type: 'integer' },
          win_rate: { type: 'number', format: 'float' },
          avg_tests_passed: { type: 'number', format: 'float' },
          total_tests_passed: { type: 'integer' },
          best_placement: { type: 'integer', nullable: true },
          recent_battles: { type: 'integer' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    };
  }

  /**
   * Generates response definitions
   */
  private generateResponses(): void {
    this.baseSchema.components.responses = {
      PlayersResponse: {
        description: 'List of players in the room',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                players: {
                  type: 'array',
                  items: {
                    '$ref': '#/components/schemas/Player'
                  }
                }
              }
            }
          }
        }
      },
      BattleStatusResponse: {
        description: 'Battle status information',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                battle: {
                  '$ref': '#/components/schemas/Battle',
                  nullable: true
                },
                message: { type: 'string' },
                canJoin: { type: 'boolean' },
                status: { type: 'string' }
              }
            }
          }
        }
      },
      UserStatsResponse: {
        description: 'User battle statistics',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                stats: {
                  '$ref': '#/components/schemas/UserStats'
                }
              }
            }
          }
        }
      },
      ErrorResponse: {
        description: 'Error response',
        content: {
          'application/json': {
            schema: {
              '$ref': '#/components/schemas/Error'
            }
          }
        }
      }
    };
  }

  /**
   * Generates WebSocket documentation as custom extension
   */
  private generateWebSocketDocs(): void {
    // Add WebSocket documentation as an extension
    (this.baseSchema as any)['x-websocket'] = {
      url: 'ws://localhost:3001',
      description: 'Real-time battle communication',
      messages: {
        client: {
          join: {
            description: 'Join a battle room',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['join'] },
                roomId: { type: 'string' },
                userId: { type: 'string' }
              }
            }
          },
          'start-battle': {
            description: 'Start a battle (admin only)',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['start-battle'] }
              }
            }
          },
          'test-results': {
            description: 'Submit test results',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['test-results'] },
                passed: { type: 'integer' },
                total: { type: 'integer' }
              }
            }
          }
        },
        server: {
          'battle-status': {
            description: 'Battle status update',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['battle-status'] },
                status: { type: 'string' },
                isAdmin: { type: 'boolean' },
                battleId: { type: 'string' }
              }
            }
          },
          'battle-started': {
            description: 'Battle has started',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['battle-started'] },
                battleId: { type: 'string' },
                startedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          'players-list': {
            description: 'Updated list of players',
            payload: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['players-list'] },
                players: {
                  type: 'array',
                  items: {
                    '$ref': '#/components/schemas/Player'
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}