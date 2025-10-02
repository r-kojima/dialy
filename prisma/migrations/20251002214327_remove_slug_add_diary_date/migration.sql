-- AlterTable: Add diaryDate column with createdAt as default for existing rows
ALTER TABLE "Post" ADD COLUMN "diaryDate" DATE;

-- Populate diaryDate with createdAt for existing rows
UPDATE "Post" SET "diaryDate" = "createdAt"::date;

-- Make diaryDate required
ALTER TABLE "Post" ALTER COLUMN "diaryDate" SET NOT NULL;

-- Create unique constraint on diaryDate
CREATE UNIQUE INDEX "Post_diaryDate_key" ON "Post"("diaryDate");

-- Drop slug column
ALTER TABLE "Post" DROP COLUMN "slug";
