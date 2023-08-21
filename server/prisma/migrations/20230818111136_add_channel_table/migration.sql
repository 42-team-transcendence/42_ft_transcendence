-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- CreateTable
CREATE TABLE "channelInfos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatId" INTEGER NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT NOT NULL DEFAULT '',
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "channelInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_channelAdministrator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channelKicked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channelBanned" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_channelMuted" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "channelInfos_chatId_key" ON "channelInfos"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "_channelAdministrator_AB_unique" ON "_channelAdministrator"("A", "B");

-- CreateIndex
CREATE INDEX "_channelAdministrator_B_index" ON "_channelAdministrator"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelKicked_AB_unique" ON "_channelKicked"("A", "B");

-- CreateIndex
CREATE INDEX "_channelKicked_B_index" ON "_channelKicked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelBanned_AB_unique" ON "_channelBanned"("A", "B");

-- CreateIndex
CREATE INDEX "_channelBanned_B_index" ON "_channelBanned"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_channelMuted_AB_unique" ON "_channelMuted"("A", "B");

-- CreateIndex
CREATE INDEX "_channelMuted_B_index" ON "_channelMuted"("B");

-- AddForeignKey
ALTER TABLE "channelInfos" ADD CONSTRAINT "channelInfos_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channelInfos" ADD CONSTRAINT "channelInfos_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelAdministrator" ADD CONSTRAINT "_channelAdministrator_A_fkey" FOREIGN KEY ("A") REFERENCES "channelInfos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelAdministrator" ADD CONSTRAINT "_channelAdministrator_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelKicked" ADD CONSTRAINT "_channelKicked_A_fkey" FOREIGN KEY ("A") REFERENCES "channelInfos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelKicked" ADD CONSTRAINT "_channelKicked_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelBanned" ADD CONSTRAINT "_channelBanned_A_fkey" FOREIGN KEY ("A") REFERENCES "channelInfos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelBanned" ADD CONSTRAINT "_channelBanned_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelMuted" ADD CONSTRAINT "_channelMuted_A_fkey" FOREIGN KEY ("A") REFERENCES "channelInfos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelMuted" ADD CONSTRAINT "_channelMuted_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
