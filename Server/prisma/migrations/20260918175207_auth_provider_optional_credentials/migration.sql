/*
  Warnings:

  - You are about to alter the column `fullName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `userName` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "expiresAt" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "userName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "mobileNo" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);
