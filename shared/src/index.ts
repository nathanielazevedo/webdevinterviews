/**
 * API Module - Auto-generated type-safe API client
 * 
 * To regenerate types: npm run generate-api
 */

import type { components } from "./api/schema";

export * from "./api/client";
export * from "./api/websocket";

// Re-export types for convenience
export type { paths, components } from "./api/schema";

// Re-export specific response types from components
export type BattleStatusResponse = components["schemas"]["BattleStatusResponse"];
export type PlayersResponse = components["schemas"]["PlayersResponse"];
export type UserStatsResponse = components["schemas"]["UserStatsResponse"];