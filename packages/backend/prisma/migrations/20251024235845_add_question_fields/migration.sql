-- AlterTable
ALTER TABLE "battle_question_pools" ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "battles" ADD COLUMN     "current_question_id" INTEGER;
