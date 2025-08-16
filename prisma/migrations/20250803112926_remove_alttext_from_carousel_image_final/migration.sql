/*
  Warnings:

  - You are about to drop the column `secondaryImageUrl` on the `ContentPost` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `ContentPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContentPost" DROP COLUMN "secondaryImageUrl",
DROP COLUMN "shortDescription",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "date" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "CarouselImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarouselImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarouselImage_order_key" ON "CarouselImage"("order");
