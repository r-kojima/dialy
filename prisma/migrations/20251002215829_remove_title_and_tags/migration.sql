-- Drop the many-to-many relation table
DROP TABLE "_PostToTag";

-- Drop the Tag table
DROP TABLE "Tag";

-- Drop title column from Post
ALTER TABLE "Post" DROP COLUMN "title";
