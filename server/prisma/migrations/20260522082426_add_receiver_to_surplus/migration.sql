-- AlterTable
ALTER TABLE "SurplusPost" ADD COLUMN     "receiverId" TEXT;

-- AddForeignKey
ALTER TABLE "SurplusPost" ADD CONSTRAINT "SurplusPost_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
