/*
  Warnings:

  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `order_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placed` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent_category_id" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "order_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
DROP COLUMN "total",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cancelled" TIMESTAMP(3),
ADD COLUMN     "completed" TIMESTAMP(3),
ADD COLUMN     "delivered" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "payment_method" TEXT NOT NULL DEFAULT 'cash',
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "placed" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
