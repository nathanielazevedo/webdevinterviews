-- CreateTable
CREATE TABLE "user_wallets" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attack_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "duration_ms" INTEGER,
    "cooldown_ms" INTEGER,
    "target_type" TEXT NOT NULL,
    "effect_type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "attack_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_attacks" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "attack_type_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "purchased_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_attacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attack_usage" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "battle_id" UUID NOT NULL,
    "attack_type_id" INTEGER NOT NULL,
    "target_user_id" UUID,
    "used_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effect_ends_at" TIMESTAMP(3),

    CONSTRAINT "attack_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_attack_logs" (
    "id" SERIAL NOT NULL,
    "battle_id" UUID NOT NULL,
    "attacker_id" UUID NOT NULL,
    "attack_type_id" INTEGER NOT NULL,
    "target_user_id" UUID,
    "effect_data" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "battle_attack_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_user_id_key" ON "user_wallets"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "attack_types_name_key" ON "attack_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_attacks_user_id_attack_type_id_key" ON "user_attacks"("user_id", "attack_type_id");

-- AddForeignKey
ALTER TABLE "user_attacks" ADD CONSTRAINT "user_attacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_wallets"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attacks" ADD CONSTRAINT "user_attacks_attack_type_id_fkey" FOREIGN KEY ("attack_type_id") REFERENCES "attack_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attack_usage" ADD CONSTRAINT "attack_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_wallets"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attack_usage" ADD CONSTRAINT "attack_usage_attack_type_id_fkey" FOREIGN KEY ("attack_type_id") REFERENCES "attack_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_attack_logs" ADD CONSTRAINT "battle_attack_logs_attack_type_id_fkey" FOREIGN KEY ("attack_type_id") REFERENCES "attack_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
