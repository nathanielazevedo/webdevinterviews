import { BattleService } from '../services/battle.service.js';

/**
 * Auto-generates OpenAPI schema by analyzing the codebase
 */
export class SchemaGenerator {
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
  async generateSchema() {
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
  generateRestPaths() {
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
                  schema: { $ref: '#/components/schemas/HealthResponse' }
                }
              }
            }
          },
          tags: ['Health']
        }
      },
      '/room/{roomId}/players': {
        get: {
          summary: 'Get all players in a room',
          description: 'Retrieves all players currently in the specified room',
          parameters: [
            { $ref: '#/components/parameters/RoomId' }
          ],
          responses: {
            '200': {
              description: 'List of players in the room',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PlayersResponse' }
                }
              }
            }
          },
          tags: ['Rooms', 'Players']
        }
      },
      '/user/{userId}/battles': {
        get: {
          summary: 'Get user battle history',
          description: 'Retrieves battle history for a specific user',
          parameters: [
            { $ref: '#/components/parameters/UserId' },
            {
              name: 'limit',
              in: 'query',
              description: 'Maximum number of battles to return',
              required: false,
              schema: {
                type: 'integer',
                default: 50,
                minimum: 1,
                maximum: 100
              }
            }
          ],
          responses: {
            '200': {
              description: 'User battle history',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BattleHistoryResponse' }
                }
              }
            },
            '500': { $ref: '#/components/responses/InternalServerError' }
          },
          tags: ['Users', 'Battles']
        }
      },
      '/user/{userId}/stats': {
        get: {
          summary: 'Get user statistics',
          description: 'Retrieves battle statistics for a specific user',
          parameters: [
            { $ref: '#/components/parameters/UserId' }
          ],
          responses: {
            '200': {
              description: 'User battle statistics',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/UserStatsResponse' }
                }
              }
            },
            '500': { $ref: '#/components/responses/InternalServerError' }
          },
          tags: ['Users', 'Statistics']
        }
      },
      '/room/{roomId}/battle': {
        get: {
          summary: 'Get battle status for room',
          description: 'Retrieves current battle status and information for a specific room',
          parameters: [
            { $ref: '#/components/parameters/RoomId' }
          ],
          responses: {
            '200': {
              description: 'Battle status information',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/BattleStatusResponse' }
                }
              }
            },
            '500': { $ref: '#/components/responses/InternalServerError' }
          },
          tags: ['Rooms', 'Battles']
        }
      },
      '/rooms/status': {
        get: {
          summary: 'Get status of multiple rooms',
          description: 'Retrieves status information for multiple rooms at once',
          parameters: [
            {
              name: 'roomIds',
              in: 'query',
              description: 'Comma-separated list of room IDs',
              required: true,
              schema: {
                type: 'string',
                example: 'battle_1,battle_2,battle_3'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Status information for requested rooms',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MultiRoomStatusResponse' }
                }
              }
            },
            '400': { $ref: '#/components/responses/BadRequest' },
            '500': { $ref: '#/components/responses/InternalServerError' }
          },
          tags: ['Rooms']
        }
      }
    };
  }

  /**
   * Generates component schemas
   */
  generateSchemas() {
    // Generate parameters first
    this.generateParameters();
    this.baseSchema.components.schemas = {
      // Response schemas
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          }
        },
        required: ['status']
      },
      PlayersResponse: {
        type: 'object',
        properties: {
          players: {
            type: 'array',
            items: { $ref: '#/components/schemas/Player' }
          }
        },
        required: ['players']
      },
      BattleHistoryResponse: {
        type: 'object',
        properties: {
          battles: {
            type: 'array',
            items: { $ref: '#/components/schemas/Battle' }
          }
        },
        required: ['battles']
      },
      UserStatsResponse: {
        type: 'object',
        properties: {
          stats: { $ref: '#/components/schemas/UserStats' }
        },
        required: ['stats']
      },
      BattleStatusResponse: {
        type: 'object',
        properties: {
          battle: {
            oneOf: [
              { $ref: '#/components/schemas/BattleInfo' },
              { type: 'null' }
            ]
          },
          message: {
            type: 'string',
            example: 'No battle found for this room'
          },
          canJoin: {
            type: 'boolean'
          },
          status: {
            type: 'string',
            enum: ['no-battle', 'waiting', 'active', 'completed']
          }
        },
        required: ['battle', 'canJoin', 'status']
      },
      MultiRoomStatusResponse: {
        type: 'object',
        additionalProperties: { $ref: '#/components/schemas/RoomStatus' },
        example: {
          'battle_1': {
            status: 'active',
            canJoin: true,
            isActive: true,
            connectedPlayers: 3,
            participantCount: 3
          },
          'battle_2': {
            status: 'no-battle',
            canJoin: true,
            connectedPlayers: 0
          }
        }
      },
      
      // Entity schemas
      Player: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            example: 'c9c22420-5e80-490f-8abf-3396c5949adf'
          },
          testsPassed: {
            type: 'integer',
            minimum: 0,
            example: 3
          },
          totalTests: {
            type: 'integer',
            minimum: 0,
            example: 5
          },
          joinedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-08T23:40:13.838Z'
          },
          isConnected: {
            type: 'boolean',
            example: true
          }
        },
        required: ['userId', 'testsPassed', 'totalTests', 'joinedAt', 'isConnected']
      },
      Battle: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          room_id: {
            type: 'string',
            example: 'battle_1'
          },
          status: {
            type: 'string',
            enum: ['waiting', 'active', 'completed']
          },
          admin_user_id: {
            type: 'string',
            format: 'uuid'
          },
          created_at: {
            type: 'string',
            format: 'date-time'
          },
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
          scheduled_start_time: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'When the battle is scheduled to start automatically'
          },
          duration_minutes: {
            type: 'integer',
            minimum: 1,
            default: 60,
            description: 'Battle duration in minutes'
          },
          auto_end_time: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'Calculated time when battle should automatically end'
          },
          ended_by: {
            type: 'string',
            enum: ['admin', 'timeout', 'manual'],
            nullable: true,
            description: 'How the battle ended'
          },
          participants: {
            type: 'array',
            items: { $ref: '#/components/schemas/BattleParticipant' }
          }
        },
        required: ['id', 'room_id', 'status', 'admin_user_id', 'created_at']
      },
      BattleParticipant: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            format: 'uuid'
          },
          tests_passed: {
            type: 'integer',
            minimum: 0
          },
          total_tests: {
            type: 'integer',
            minimum: 0
          },
          joined_at: {
            type: 'string',
            format: 'date-time'
          },
          final_placement: {
            type: 'integer',
            minimum: 1,
            nullable: true
          }
        },
        required: ['user_id', 'tests_passed', 'total_tests', 'joined_at']
      },
      BattleInfo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          status: {
            type: 'string',
            enum: ['waiting', 'active', 'completed']
          },
          startedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          adminUserId: {
            type: 'string',
            format: 'uuid'
          },
          participantCount: {
            type: 'integer',
            minimum: 0
          },
          connectedPlayers: {
            type: 'integer',
            minimum: 0
          },
          canJoin: {
            type: 'boolean'
          },
          isActive: {
            type: 'boolean'
          },
          isWaiting: {
            type: 'boolean'
          },
          isCompleted: {
            type: 'boolean'
          }
        },
        required: ['id', 'status', 'createdAt', 'adminUserId', 'participantCount', 'connectedPlayers', 'canJoin', 'isActive', 'isWaiting', 'isCompleted']
      },
      RoomStatus: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['no-battle', 'waiting', 'active', 'completed', 'error']
          },
          canJoin: {
            type: 'boolean'
          },
          isActive: {
            type: 'boolean'
          },
          isWaiting: {
            type: 'boolean'
          },
          isCompleted: {
            type: 'boolean'
          },
          connectedPlayers: {
            type: 'integer',
            minimum: 0
          },
          participantCount: {
            type: 'integer',
            minimum: 0
          },
          startedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true
          }
        },
        required: ['status', 'canJoin', 'connectedPlayers']
      },
      UserStats: {
        type: 'object',
        properties: {
          totalBattles: {
            type: 'integer',
            minimum: 0
          },
          battlesWon: {
            type: 'integer',
            minimum: 0
          },
          battlesCompleted: {
            type: 'integer',
            minimum: 0
          },
          averageTestsPassed: {
            type: 'number',
            minimum: 0
          },
          winRate: {
            type: 'number',
            minimum: 0,
            maximum: 1
          }
        },
        required: ['totalBattles', 'battlesWon', 'battlesCompleted', 'averageTestsPassed', 'winRate']
      },
      Question: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          title: {
            type: 'string',
            example: 'Two Sum'
          },
          slug: {
            type: 'string',
            example: 'two-sum'
          },
          difficulty: {
            type: 'string',
            enum: ['Easy', 'Medium', 'Hard'],
            example: 'Easy'
          },
          problem_statement: {
            type: 'string',
            description: 'The full problem description'
          },
          function_signature: {
            type: 'string',
            description: 'The initial function signature for the problem'
          },
          test_cases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                input: { type: 'object' },
                expected: {}
              }
            },
            description: 'Test cases for the problem'
          },
          examples: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                input: { type: 'string' },
                output: { type: 'string' },
                explanation: { type: 'string' }
              }
            },
            nullable: true,
            description: 'Example input/output pairs with explanations'
          },
          constraints: {
            type: 'string',
            nullable: true,
            description: 'Problem constraints'
          },
          hints: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
            description: 'Hints for solving the problem'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
            description: 'Topic tags for the problem'
          },
          leetcode_number: {
            type: 'integer',
            nullable: true,
            example: 1,
            description: 'Original LeetCode problem number'
          },
          created_at: {
            type: 'string',
            format: 'date-time'
          },
          updated_at: {
            type: 'string',
            format: 'date-time'
          }
        },
        required: ['id', 'title', 'slug', 'difficulty', 'problem_statement', 'function_signature', 'test_cases']
      },
      QuestionSummary: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          title: {
            type: 'string',
            example: 'Two Sum'
          },
          difficulty: {
            type: 'string',
            enum: ['Easy', 'Medium', 'Hard'],
            example: 'Easy'
          },
          leetcode_number: {
            type: 'integer',
            nullable: true,
            example: 1
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
            example: ['Array', 'Hash Table']
          }
        },
        required: ['id', 'title', 'difficulty']
      },
      
      // WebSocket Message Schemas
      WebSocketMessage: {
        type: 'object',
        discriminator: {
          propertyName: 'type'
        },
        oneOf: [
          { $ref: '#/components/schemas/JoinRoomMessage' },
          { $ref: '#/components/schemas/StartBattleMessage' },
          { $ref: '#/components/schemas/TestResultsMessage' },
          { $ref: '#/components/schemas/GetPlayersMessage' },
          { $ref: '#/components/schemas/WatchRoomsMessage' },
          { $ref: '#/components/schemas/UnwatchRoomsMessage' },
          { $ref: '#/components/schemas/CompleteBattleMessage' },
          { $ref: '#/components/schemas/CreateBattleMessage' },
          { $ref: '#/components/schemas/UpdateBattleTimingMessage' },
          { $ref: '#/components/schemas/GetBattleInfoMessage' },
          { $ref: '#/components/schemas/GetCurrentQuestionMessage' },
          { $ref: '#/components/schemas/GetQuestionPoolMessage' }
        ]
      },
      JoinRoomMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['join-room']
          },
          roomId: {
            type: 'string',
            example: 'battle_1'
          },
          userId: {
            type: 'string',
            format: 'uuid'
          }
        },
        required: ['type', 'roomId', 'userId']
      },
      StartBattleMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['start-battle']
          }
        },
        required: ['type']
      },
      TestResultsMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['test-results']
          },
          passed: {
            type: 'integer',
            minimum: 0
          },
          total: {
            type: 'integer',
            minimum: 0
          }
        },
        required: ['type', 'passed', 'total']
      },
      GetPlayersMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['get-players']
          }
        },
        required: ['type']
      },
      WatchRoomsMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['watch-rooms']
          },
          roomIds: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['battle_1', 'battle_2']
          }
        },
        required: ['type']
      },
      UnwatchRoomsMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['unwatch-rooms']
          }
        },
        required: ['type']
      },
      CompleteBattleMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['complete-battle']
          },
          completionTime: {
            type: 'integer',
            minimum: 0,
            description: 'Completion time in milliseconds',
            nullable: true
          }
        },
        required: ['type']
      },
      CreateBattleMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['create-battle']
          },
          roomId: {
            type: 'string',
            description: 'Room ID for the battle'
          },
          options: {
            type: 'object',
            properties: {
              scheduled_start_time: {
                type: 'string',
                format: 'date-time',
                description: 'ISO timestamp for scheduled battle start'
              },
              duration_minutes: {
                type: 'integer',
                minimum: 1,
                description: 'Battle duration in minutes'
              }
            }
          }
        },
        required: ['type', 'roomId']
      },
      UpdateBattleTimingMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['update-battle-timing']
          },
          battleId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the battle to update'
          },
          options: {
            type: 'object',
            properties: {
              scheduled_start_time: {
                type: 'string',
                format: 'date-time',
                description: 'New scheduled start time'
              },
              duration_minutes: {
                type: 'integer',
                minimum: 1,
                description: 'New duration in minutes'
              }
            }
          }
        },
        required: ['type', 'battleId', 'options']
      },
      GetBattleInfoMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['get-battle-info']
          },
          battleId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the battle to get info for'
          }
        },
        required: ['type', 'battleId']
      },
      GetCurrentQuestionMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['get-current-question']
          }
        },
        required: ['type']
      },
      GetQuestionPoolMessage: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['get-question-pool']
          }
        },
        required: ['type']
      },
      
      // WebSocket Response Schemas
      WebSocketResponse: {
        type: 'object',
        discriminator: {
          propertyName: 'type'
        },
        oneOf: [
          { $ref: '#/components/schemas/BattleStatusResponse' },
          { $ref: '#/components/schemas/BattleStartedResponse' },
          { $ref: '#/components/schemas/TestResultsUpdateResponse' },
          { $ref: '#/components/schemas/PlayersListResponse' },
          { $ref: '#/components/schemas/RoomStatusesResponse' },
          { $ref: '#/components/schemas/BattleCompletedResponse' },
          { $ref: '#/components/schemas/BattleCreatedResponse' },
          { $ref: '#/components/schemas/BattleTimingUpdatedResponse' },
          { $ref: '#/components/schemas/BattleInfoResponse' },
          { $ref: '#/components/schemas/CurrentQuestionResponse' },
          { $ref: '#/components/schemas/QuestionPoolResponse' },
          { $ref: '#/components/schemas/ErrorResponse' }
        ]
      },
      BattleStatusWsResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-status']
          },
          status: {
            type: 'string',
            enum: ['waiting', 'active', 'completed']
          },
          isAdmin: {
            type: 'boolean'
          },
          battleId: {
            type: 'string',
            format: 'uuid'
          }
        },
        required: ['type', 'status', 'isAdmin', 'battleId']
      },
      BattleStartedResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-started']
          },
          battleId: {
            type: 'string',
            format: 'uuid'
          },
          startedAt: {
            type: 'string',
            format: 'date-time'
          }
        },
        required: ['type', 'battleId', 'startedAt']
      },
      TestResultsUpdateResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['test-results-update']
          },
          userId: {
            type: 'string',
            format: 'uuid'
          },
          passed: {
            type: 'integer',
            minimum: 0
          },
          total: {
            type: 'integer',
            minimum: 0
          }
        },
        required: ['type', 'userId', 'passed', 'total']
      },
      PlayersListResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['players-list']
          },
          players: {
            type: 'array',
            items: { $ref: '#/components/schemas/Player' }
          }
        },
        required: ['type', 'players']
      },
      RoomStatusesResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['room-statuses']
          },
          rooms: {
            type: 'object',
            additionalProperties: { $ref: '#/components/schemas/RoomStatus' }
          }
        },
        required: ['type', 'rooms']
      },
      BattleCompletedResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-completed']
          },
          battleId: {
            type: 'string',
            format: 'uuid'
          },
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  format: 'uuid'
                },
                testsPassed: {
                  type: 'integer',
                  minimum: 0
                },
                totalTests: {
                  type: 'integer',
                  minimum: 0
                },
                completionTime: {
                  type: 'integer',
                  minimum: 0,
                  nullable: true
                },
                placement: {
                  type: 'integer',
                  minimum: 1
                }
              },
              required: ['userId', 'testsPassed', 'totalTests', 'placement']
            }
          }
        },
        required: ['type', 'battleId', 'results']
      },
      BattleCreatedResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-created']
          },
          battle: { $ref: '#/components/schemas/Battle' }
        },
        required: ['type', 'battle']
      },
      BattleTimingUpdatedResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-timing-updated']
          },
          battleId: {
            type: 'string',
            format: 'uuid'
          },
          timing: {
            type: 'object',
            properties: {
              scheduled_start_time: {
                type: 'string',
                format: 'date-time',
                nullable: true
              },
              duration_minutes: {
                type: 'integer',
                nullable: true
              },
              auto_end_time: {
                type: 'string',
                format: 'date-time',
                nullable: true
              }
            }
          }
        },
        required: ['type', 'battleId', 'timing']
      },
      BattleInfoResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['battle-info']
          },
          battle: { $ref: '#/components/schemas/Battle' }
        },
        required: ['type', 'battle']
      },
      CurrentQuestionResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['current-question']
          },
          question: { 
            allOf: [
              { $ref: '#/components/schemas/Question' },
              { nullable: true }
            ]
          }
        },
        required: ['type', 'question']
      },
      QuestionPoolResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['question-pool']
          },
          questions: {
            type: 'array',
            items: { $ref: '#/components/schemas/QuestionSummary' }
          }
        },
        required: ['type', 'questions']
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['error']
          },
          message: {
            type: 'string'
          }
        },
        required: ['type', 'message']
      }
    };
  }

  /**
   * Generates parameter definitions
   */
  generateParameters() {
    this.baseSchema.components.parameters = {
      RoomId: {
        name: 'roomId',
        in: 'path',
        description: 'Unique room identifier',
        required: true,
        schema: {
          type: 'string',
          example: 'battle_1'
        }
      },
      UserId: {
        name: 'userId',
        in: 'path',
        description: 'Unique user identifier',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
          example: 'c9c22420-5e80-490f-8abf-3396c5949adf'
        }
      }
    };
  }

  /**
   * Generates response definitions
   */
  generateResponses() {
    this.baseSchema.components.responses = {
      BadRequest: {
        description: 'Bad request - invalid parameters',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'roomIds query parameter is required'
                }
              },
              required: ['error']
            }
          }
        }
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Failed to fetch data'
                }
              },
              required: ['error']
            }
          }
        }
      }
    };
  }

  /**
   * Generates WebSocket documentation as OpenAPI extension
   */
  generateWebSocketDocs() {
    this.baseSchema['x-websocket'] = {
      url: 'ws://localhost:3001',
      description: 'Real-time WebSocket connection for battle communication',
      messageTypes: {
        incoming: [
          {
            name: 'join-room',
            description: 'Join a battle room',
            schema: { $ref: '#/components/schemas/JoinRoomMessage' }
          },
          {
            name: 'start-battle',
            description: 'Start a battle (admin only)',
            schema: { $ref: '#/components/schemas/StartBattleMessage' }
          },
          {
            name: 'test-results',
            description: 'Submit test results during active battle',
            schema: { $ref: '#/components/schemas/TestResultsMessage' }
          },
          {
            name: 'get-players',
            description: 'Request current player list',
            schema: { $ref: '#/components/schemas/GetPlayersMessage' }
          },
          {
            name: 'watch-rooms',
            description: 'Start monitoring room statuses',
            schema: { $ref: '#/components/schemas/WatchRoomsMessage' }
          },
          {
            name: 'unwatch-rooms',
            description: 'Stop monitoring room statuses',
            schema: { $ref: '#/components/schemas/UnwatchRoomsMessage' }
          },
          {
            name: 'complete-battle',
            description: 'Complete a battle (admin only)',
            schema: { $ref: '#/components/schemas/CompleteBattleMessage' }
          }
        ],
        outgoing: [
          {
            name: 'battle-status',
            description: 'Battle status information sent on room join',
            schema: { $ref: '#/components/schemas/BattleStatusWsResponse' }
          },
          {
            name: 'battle-started',
            description: 'Broadcast when battle starts',
            schema: { $ref: '#/components/schemas/BattleStartedResponse' }
          },
          {
            name: 'test-results-update',
            description: 'Broadcast when player submits test results',
            schema: { $ref: '#/components/schemas/TestResultsUpdateResponse' }
          },
          {
            name: 'players-list',
            description: 'Current players in room',
            schema: { $ref: '#/components/schemas/PlayersListResponse' }
          },
          {
            name: 'room-statuses',
            description: 'Status updates for watched rooms',
            schema: { $ref: '#/components/schemas/RoomStatusesResponse' }
          },
          {
            name: 'battle-completed',
            description: 'Broadcast when battle completes with final results',
            schema: { $ref: '#/components/schemas/BattleCompletedResponse' }
          },
          {
            name: 'error',
            description: 'Error message',
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        ]
      }
    };
  }
}

export default SchemaGenerator;