/*
  Warnings:

  - Added the required column `participantsCount` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "participantsCount" INTEGER NOT NULL;
