/*
  Warnings:

  - You are about to drop the `_channelMuted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_channelMuted" DROP CONSTRAINT "_channelMuted_A_fkey";

-- DropForeignKey
ALTER TABLE "_channelMuted" DROP CONSTRAINT "_channelMuted_B_fkey";

-- DropTable
DROP TABLE "_channelMuted";

-- CreateTable
CREATE TABLE "channelMutedUsers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "channelMutedUsers_pkey" PRIMARY KEY ("userId","channelId")
);

-- AddForeignKey
ALTER TABLE "channelMutedUsers" ADD CONSTRAINT "channelMutedUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channelMutedUsers" ADD CONSTRAINT "channelMutedUsers_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channelInfos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
