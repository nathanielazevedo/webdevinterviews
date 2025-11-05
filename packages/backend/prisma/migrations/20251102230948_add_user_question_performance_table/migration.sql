-- CreateTable
CREATE TABLE "user_question_performance" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" INTEGER NOT NULL,
    "fastest_completion_ms" INTEGER,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "successful_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_attempted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_question_performance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_question_performance_user_id_question_id_key" ON "user_question_performance"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "user_question_performance" ADD CONSTRAINT "user_question_performance_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
