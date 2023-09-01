/*
  Warnings:

  - You are about to drop the `_channelKicked` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_channelKicked" DROP CONSTRAINT "_channelKicked_A_fkey";

-- DropForeignKey
ALTER TABLE "_channelKicked" DROP CONSTRAINT "_channelKicked_B_fkey";

-- DropTable
DROP TABLE "_channelKicked";
