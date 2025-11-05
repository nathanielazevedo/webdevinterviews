/**
 * Attack system types for battle power-ups
 */

export interface AttackType {
  id: number;
  name: string;
  description: string;
  cost: number;
  duration_ms: number | null;
  cooldown_ms: number | null;
  target_type: 'all' | 'individual' | 'self';
  effect_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWallet {
  id: number;
  user_id: string;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface UserAttack {
  id: number;
  user_id: string;
  attack_type_id: number;
  quantity: number;
  purchased_at: string;
  attackType: AttackType;
}

export interface AttackUsage {
  id: number;
  user_id: string;
  battle_id: string;
  attack_type_id: number;
  target_user_id: string | null;
  used_at: string;
  effect_ends_at: string | null;
}

export interface BattleAttackLog {
  id: number;
  battle_id: string;
  attacker_id: string;
  attack_type_id: number;
  target_user_id: string | null;
  effect_data: Record<string, unknown> | null;
  created_at: string;
  expires_at: string | null;
  attackType: AttackType;
}

// Request types
export interface PurchaseAttackRequest {
  attackTypeId: number;
}

export interface UseAttackRequest {
  battleId: string;
  attackTypeId: number;
  targetUserId?: string;
}

// Response types
export interface PurchaseAttackResponse {
  wallet: UserWallet;
  attack: UserAttack;
}

export interface UseAttackResponse {
  usage: AttackUsage;
  log: BattleAttackLog;
}
