-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetExpires" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "verificationToken" TEXT;
