# Battle Attacks System API

## Overview
The attack system allows users to purchase and use special power-ups during battles using coins.

## Database Schema

### Tables Created:
- **user_wallets** - Tracks user coin balances
- **attack_types** - Catalog of available attacks
- **user_attacks** - User's purchased attack inventory
- **attack_usage** - Records of attacks used in battles
- **battle_attack_logs** - Event logs for battle attacks

## API Endpoints

### 1. Get Available Attacks (Shop)
```
GET /api/attacks
```
Returns all active attacks available for purchase.

**Response:**
```json
{
  "success": true,
  "data": {
    "attacks": [
      {
        "id": 1,
        "name": "Code Eraser",
        "description": "Erase all code from every opponent's editor",
        "cost": 50,
        "duration_ms": null,
        "cooldown_ms": 60000,
        "target_type": "all",
        "effect_type": "erase_code",
        "is_active": true
      }
    ]
  }
}
```

### 2. Get Specific Attack
```
GET /api/attacks/:id
```

### 3. Get User Wallet
```
GET /api/attacks/user/wallet
```
**Requires:** Authentication
**Returns:** User's coin balance

```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": 1,
      "user_id": "uuid",
      "coins": 100,
      "created_at": "2025-11-04T..."
    }
  }
}
```

### 4. Get User Inventory
```
GET /api/attacks/user/inventory
```
**Requires:** Authentication
**Returns:** User's purchased attacks with quantities

```json
{
  "success": true,
  "data": {
    "attacks": [
      {
        "id": 1,
        "user_id": "uuid",
        "attack_type_id": 1,
        "quantity": 3,
        "purchased_at": "2025-11-04T...",
        "attackType": {
          "id": 1,
          "name": "Code Eraser",
          "cost": 50,
          ...
        }
      }
    ]
  }
}
```

### 5. Purchase Attack
```
POST /api/attacks/purchase
Content-Type: application/json
```
**Requires:** Authentication

**Body:**
```json
{
  "attackTypeId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "coins": 50
    },
    "attack": {
      "id": 1,
      "quantity": 1,
      "attackType": { ... }
    }
  }
}
```

**Errors:**
- `400` - Insufficient coins
- `404` - Attack type not found
- `401` - Not authenticated

### 6. Use Attack in Battle
```
POST /api/attacks/use
Content-Type: application/json
```
**Requires:** Authentication

**Body:**
```json
{
  "battleId": "battle-uuid",
  "attackTypeId": 1,
  "targetUserId": "target-uuid" // Optional, only for 'individual' target type
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usage": {
      "id": 1,
      "user_id": "uuid",
      "battle_id": "battle-uuid",
      "attack_type_id": 1,
      "used_at": "2025-11-04T...",
      "effect_ends_at": "2025-11-04T..." // or null for instant
    },
    "log": {
      "id": 1,
      "battle_id": "battle-uuid",
      "attacker_id": "uuid",
      "attack_type_id": 1,
      "target_user_id": "target-uuid",
      "expires_at": "2025-11-04T...",
      "attackType": { ... }
    }
  }
}
```

### 7. Get Active Battle Effects
```
GET /api/attacks/battle/:battleId/effects
```
Returns all active attack effects in a specific battle.

```json
{
  "success": true,
  "data": {
    "effects": [
      {
        "id": 1,
        "battle_id": "battle-uuid",
        "attacker_id": "uuid",
        "attack_type_id": 1,
        "target_user_id": null,
        "created_at": "2025-11-04T...",
        "expires_at": "2025-11-04T...",
        "attackType": {
          "name": "Freeze Ray",
          "effect_type": "freeze_input",
          ...
        }
      }
    ]
  }
}
```

## Attack Types

### Available Attacks:

1. **Hint Oracle** - 25 coins (self)
   - Unlock all hints for the current problem

2. **Slow Motion** - 35 coins (all)
   - Slow down typing speed by 50% for 45 seconds

3. **Freeze Ray** - 40 coins (all)
   - Freeze all code editors for 30 seconds

4. **Targeted Strike** - 45 coins (individual)
   - Erase specific opponent's code

5. **Code Eraser** - 50 coins (all)
   - Erase all opponents' code

6. **Personal Shield** - 55 coins (self)
   - Protect from attacks for 1 minute

7. **Time Warp** - 60 coins (self)
   - Extra 2 minutes on battle clock

8. **Confusion Bomb** - 65 coins (all)
   - Shuffle opponents' code lines for 20 seconds

### Target Types:
- **all** - Affects all other players
- **individual** - Affects one specific player
- **self** - Only affects the user

### Effect Types:
- `erase_code` - Clears code editor
- `freeze_input` - Prevents typing
- `slow_typing` - Reduces typing speed
- `extra_time` - Adds time to clock
- `hints` - Reveals hints
- `shield` - Protects from attacks
- `shuffle_code` - Randomizes code lines

## Integration Notes

### For Frontend:
1. Display shop with available attacks
2. Show user's coin balance
3. Show user's inventory with quantities
4. During battle, allow using attacks
5. Display active effects to players
6. Handle WebSocket events for real-time attack notifications

### WebSocket Integration (TODO):
- Broadcast attack usage to all battle participants
- Real-time coin updates
- Effect expiration notifications

### Coin Earning (TODO):
- Award coins for completing practice questions
- Award coins for battle participation/wins
- Daily login bonuses
- Achievement rewards
