-- CreateTable
CREATE TABLE "battles" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "admin_user_id" UUID,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "scheduled_start_time" TIMESTAMPTZ(6),
    "duration_minutes" INTEGER,
    "auto_end_time" TIMESTAMPTZ(6),
    "participants" JSONB DEFAULT '[]',
    "results" JSONB DEFAULT '[]',
    "ended_by" TEXT,

    CONSTRAINT "battles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_participations" (
    "id" UUID NOT NULL,
    "battle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tests_passed" INTEGER NOT NULL DEFAULT 0,
    "total_tests" INTEGER NOT NULL DEFAULT 0,
    "completion_time" INTEGER,
    "placement" INTEGER,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_connected" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "battle_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "problem_statement" TEXT NOT NULL,
    "function_signature" TEXT,
    "test_cases" JSONB NOT NULL DEFAULT '[]',
    "examples" JSONB,
    "constraints" TEXT,
    "hints" JSONB,
    "tags" JSONB,
    "leetcode_number" INTEGER,
    "starter_code" TEXT,
    "solution" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_question_pools" (
    "id" SERIAL NOT NULL,
    "battle_id" UUID NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "battle_question_pools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "battle_participations_battle_id_user_id_key" ON "battle_participations"("battle_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "questions_leetcode_number_key" ON "questions"("leetcode_number");

-- CreateIndex
CREATE UNIQUE INDEX "battle_question_pools_battle_id_question_id_key" ON "battle_question_pools"("battle_id", "question_id");

-- AddForeignKey
ALTER TABLE "battle_participations" ADD CONSTRAINT "battle_participations_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_question_pools" ADD CONSTRAINT "battle_question_pools_battle_id_fkey" FOREIGN KEY ("battle_id") REFERENCES "battles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle_question_pools" ADD CONSTRAINT "battle_question_pools_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
