-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "player_1_id" INTEGER NOT NULL,
    "player_2_id" INTEGER NOT NULL,
    "player_1_score" INTEGER NOT NULL DEFAULT 0,
    "player_2_score" INTEGER NOT NULL DEFAULT 0,
    "winnerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_1_id_fkey" FOREIGN KEY ("player_1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_2_id_fkey" FOREIGN KEY ("player_2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
