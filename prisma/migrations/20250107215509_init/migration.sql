-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minesweeperScores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uid" UUID NOT NULL,
    "time" INTEGER NOT NULL,
    "numMines" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "win" BOOLEAN NOT NULL,
    "numCleared" INTEGER NOT NULL,
    "numRows" INTEGER NOT NULL,
    "numCols" INTEGER NOT NULL,
    "difficulty" VARCHAR NOT NULL,

    CONSTRAINT "minesweeperScores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snakeScores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uid" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "numRows" INTEGER NOT NULL,
    "numCols" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snakeScores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendRequests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "senderId" UUID NOT NULL,
    "receiverId" UUID NOT NULL,

    CONSTRAINT "friendRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friends" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "uid" UUID NOT NULL,
    "friendId" UUID NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "minesweeperScores" ADD CONSTRAINT "minesweeperScores_users_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "snakeScores" ADD CONSTRAINT "snakeScores_users_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_users_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendRequests" ADD CONSTRAINT "friendRequests_users_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_users_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_users_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
