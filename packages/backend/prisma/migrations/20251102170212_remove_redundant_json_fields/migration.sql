/*
  Warnings:

  - You are about to drop the column `current_question_id` on the `battles` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `battles` table. All the data in the column will be lost.
  - You are about to drop the column `results` on the `battles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "battles" DROP COLUMN "current_question_id",
DROP COLUMN "participants",
DROP COLUMN "results",
ADD COLUMN     "selected_question_id" INTEGER;

-- CreateTable
CREATE TABLE "location_points" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "country" TEXT,
    "region" TEXT,
    "locality" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_points_latitude_longitude_key" ON "location_points"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "battles" ADD CONSTRAINT "battles_selected_question_id_fkey" FOREIGN KEY ("selected_question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
