-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "jobUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "salaryRange" TEXT,
ADD COLUMN     "seniority" TEXT,
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "education" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "skills" JSONB,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "cvText" DROP NOT NULL;
