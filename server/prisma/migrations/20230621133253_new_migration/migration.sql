/*
  Warnings:

  - You are about to drop the column `nickName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_nickName_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nickName",
ADD COLUMN     "hashedRt" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
