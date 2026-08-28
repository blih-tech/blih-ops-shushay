-- AlterTable
ALTER TABLE "company_profiles" ADD COLUMN     "logoPublicId" TEXT;

-- AlterTable
ALTER TABLE "lesson_documents" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "videoPublicId" TEXT;

-- AlterTable
ALTER TABLE "talent_profiles" ADD COLUMN     "cvPublicId" TEXT,
ADD COLUMN     "photoPublicId" TEXT;
