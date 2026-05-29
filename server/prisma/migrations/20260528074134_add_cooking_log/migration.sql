-- CreateTable
CREATE TABLE "CookingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resepNama" TEXT NOT NULL,
    "resepId" TEXT,
    "bahanUsed" JSONB NOT NULL,
    "totalKarbon" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookingLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CookingLog_userId_idx" ON "CookingLog"("userId");

-- AddForeignKey
ALTER TABLE "CookingLog" ADD CONSTRAINT "CookingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
