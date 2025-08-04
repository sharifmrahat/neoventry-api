-- AlterTable
ALTER TABLE "TimelineLog" ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "TimelineLog" ADD CONSTRAINT "TimelineLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
