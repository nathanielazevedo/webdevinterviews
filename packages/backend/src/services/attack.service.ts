import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AttackService {
  /**
   * Get all active attacks available for purchase
   */
  static async getAvailableAttacks() {
    return await prisma.attackType.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        cost: 'asc',
      },
    });
  }

  /**
   * Get a specific attack by ID
   */
  static async getAttackById(attackId: number) {
    return await prisma.attackType.findUnique({
      where: {
        id: attackId,
      },
    });
  }

  /**
   * Get user's wallet (coins balance)
   */
  static async getUserWallet(userId: string) {
    let wallet = await prisma.userWallet.findUnique({
      where: {
        user_id: userId,
      },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.userWallet.create({
        data: {
          user_id: userId,
          coins: 100, // Starting balance
        },
      });
    }

    return wallet;
  }

  /**
   * Get user's purchased attacks (inventory)
   */
  static async getUserAttacks(userId: string) {
    return await prisma.userAttack.findMany({
      where: {
        user_id: userId,
      },
      include: {
        attackType: true,
      },
      orderBy: {
        purchased_at: 'desc',
      },
    });
  }

  /**
   * Purchase an attack
   */
  static async purchaseAttack(userId: string, attackTypeId: number) {
    // Get attack type
    const attackType = await prisma.attackType.findUnique({
      where: {
        id: attackTypeId,
      },
    });

    if (!attackType) {
      throw new Error('Attack type not found');
    }

    if (!attackType.is_active) {
      throw new Error('This attack is no longer available');
    }

    // Get user wallet
    const wallet = await this.getUserWallet(userId);

    // Check if user has enough coins
    if (wallet.coins < attackType.cost) {
      throw new Error('Insufficient coins');
    }

    // Use a transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // Deduct coins
      const updatedWallet = await tx.userWallet.update({
        where: {
          user_id: userId,
        },
        data: {
          coins: {
            decrement: attackType.cost,
          },
        },
      });

      // Check if user already owns this attack
      const existingAttack = await tx.userAttack.findUnique({
        where: {
          user_id_attack_type_id: {
            user_id: userId,
            attack_type_id: attackTypeId,
          },
        },
      });

      let userAttack;
      if (existingAttack) {
        // Increment quantity
        userAttack = await tx.userAttack.update({
          where: {
            id: existingAttack.id,
          },
          data: {
            quantity: {
              increment: 1,
            },
          },
          include: {
            attackType: true,
          },
        });
      } else {
        // Create new attack entry
        userAttack = await tx.userAttack.create({
          data: {
            user_id: userId,
            attack_type_id: attackTypeId,
            quantity: 1,
          },
          include: {
            attackType: true,
          },
        });
      }

      return {
        wallet: updatedWallet,
        attack: userAttack,
      };
    });
  }

  /**
   * Use an attack in a battle
   */
  static async useAttack(
    userId: string,
    battleId: string,
    attackTypeId: number,
    targetUserId?: string
  ) {
    // Check if user owns this attack
    const userAttack = await prisma.userAttack.findUnique({
      where: {
        user_id_attack_type_id: {
          user_id: userId,
          attack_type_id: attackTypeId,
        },
      },
      include: {
        attackType: true,
      },
    });

    if (!userAttack || userAttack.quantity <= 0) {
      throw new Error('You do not own this attack');
    }

    const attackType = userAttack.attackType;

    // Calculate effect end time if attack has duration
    const effectEndsAt = attackType.duration_ms
      ? new Date(Date.now() + attackType.duration_ms)
      : null;

    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // Decrement attack quantity
      await tx.userAttack.update({
        where: {
          id: userAttack.id,
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });

      // Record attack usage
      const attackUsage = await tx.attackUsage.create({
        data: {
          user_id: userId,
          battle_id: battleId,
          attack_type_id: attackTypeId,
          target_user_id: targetUserId,
          effect_ends_at: effectEndsAt,
        },
      });

      // Log the attack event
      const attackLog = await tx.battleAttackLog.create({
        data: {
          battle_id: battleId,
          attacker_id: userId,
          attack_type_id: attackTypeId,
          target_user_id: targetUserId,
          expires_at: effectEndsAt,
        },
        include: {
          attackType: true,
        },
      });

      return {
        usage: attackUsage,
        log: attackLog,
      };
    });
  }

  /**
   * Get active effects in a battle
   */
  static async getActiveBattleEffects(battleId: string) {
    const now = new Date();

    return await prisma.battleAttackLog.findMany({
      where: {
        battle_id: battleId,
        OR: [
          { expires_at: null }, // Instant effects
          { expires_at: { gte: now } }, // Not yet expired
        ],
      },
      include: {
        attackType: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}

export default AttackService;
