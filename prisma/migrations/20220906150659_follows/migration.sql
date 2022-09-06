-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "_FollowRelaction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FollowRelaction_AB_unique" ON "_FollowRelaction"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowRelaction_B_index" ON "_FollowRelaction"("B");

-- AddForeignKey
ALTER TABLE "_FollowRelaction" ADD CONSTRAINT "_FollowRelaction_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowRelaction" ADD CONSTRAINT "_FollowRelaction_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
