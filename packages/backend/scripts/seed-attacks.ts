import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const attackTypes = [
  {
    name: 'Code Eraser',
    description: 'Erase all code from every opponent\'s editor. They have to start over!',
    cost: 50,
    duration_ms: null, // Instant effect
    cooldown_ms: 60000, // 1 minute cooldown
    target_type: 'all',
    effect_type: 'erase_code',
    is_active: true,
  },
  {
    name: 'Freeze Ray',
    description: 'Freeze all opponents\' code editors for 30 seconds. They can\'t type anything!',
    cost: 40,
    duration_ms: 30000, // 30 seconds
    cooldown_ms: 90000, // 1.5 minutes
    target_type: 'all',
    effect_type: 'freeze_input',
    is_active: true,
  },
  {
    name: 'Slow Motion',
    description: 'Slow down everyone\'s typing speed by 50% for 45 seconds.',
    cost: 35,
    duration_ms: 45000, // 45 seconds
    cooldown_ms: 120000, // 2 minutes
    target_type: 'all',
    effect_type: 'slow_typing',
    is_active: true,
  },
  {
    name: 'Time Warp',
    description: 'Give yourself an extra 2 minutes on the battle clock.',
    cost: 60,
    duration_ms: 120000, // 2 minutes
    cooldown_ms: null, // No cooldown
    target_type: 'self',
    effect_type: 'extra_time',
    is_active: true,
  },
  {
    name: 'Hint Oracle',
    description: 'Unlock all hints for the current problem for yourself.',
    cost: 25,
    duration_ms: null, // Instant
    cooldown_ms: null,
    target_type: 'self',
    effect_type: 'hints',
    is_active: true,
  },
  {
    name: 'Targeted Strike',
    description: 'Erase the code of a specific opponent. Choose your victim wisely!',
    cost: 45,
    duration_ms: null, // Instant
    cooldown_ms: 120000, // 2 minutes
    target_type: 'individual',
    effect_type: 'erase_code',
    is_active: true,
  },
  {
    name: 'Personal Shield',
    description: 'Protect yourself from all attacks for 1 minute.',
    cost: 55,
    duration_ms: 60000, // 1 minute
    cooldown_ms: 180000, // 3 minutes
    target_type: 'self',
    effect_type: 'shield',
    is_active: true,
  },
  {
    name: 'Confusion Bomb',
    description: 'Randomly shuffle the code lines of all opponents for 20 seconds.',
    cost: 65,
    duration_ms: 20000, // 20 seconds
    cooldown_ms: 150000, // 2.5 minutes
    target_type: 'all',
    effect_type: 'shuffle_code',
    is_active: true,
  },
];

async function seedAttacks() {
  console.log('🚀 Starting attack types seed...');

  try {
    // Clear existing attack types (optional - comment out if you want to keep existing)
    // await prisma.attackType.deleteMany({});
    // console.log('✅ Cleared existing attack types');

    // Create attack types
    for (const attack of attackTypes) {
      const existing = await prisma.attackType.findUnique({
        where: { name: attack.name },
      });

      if (existing) {
        console.log(`⏭️  Skipping "${attack.name}" - already exists`);
        continue;
      }

      await prisma.attackType.create({
        data: attack,
      });
      console.log(`✅ Created attack: ${attack.name} (${attack.cost} coins)`);
    }

    console.log('\n🎉 Attack types seeded successfully!');
    console.log(`📊 Total attack types: ${attackTypes.length}`);
    
    // Display summary
    const all = await prisma.attackType.findMany({
      orderBy: { cost: 'asc' },
    });
    
    console.log('\n📋 Available Attacks:');
    all.forEach(attack => {
      console.log(`   • ${attack.name} - ${attack.cost} coins - ${attack.target_type}`);
    });

  } catch (error) {
    console.error('❌ Error seeding attacks:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAttacks();
