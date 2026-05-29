-- CreateEnum
CREATE TYPE "PoinSource" AS ENUM ('KARBON', 'STREAK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActiveDate" TIMESTAMP(3),
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PoinLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "source" "PoinSource" NOT NULL,
    "note" TEXT,
    "refId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoinLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PoinLog_userId_idx" ON "PoinLog"("userId");

-- AddForeignKey
ALTER TABLE "PoinLog" ADD CONSTRAINT "PoinLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
