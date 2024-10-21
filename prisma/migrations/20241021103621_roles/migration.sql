/*
  Warnings:

  - You are about to drop the column `role_name` on the `collaborator` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EDITOR', 'ADMIN', 'VIEWER');

-- AlterTable
ALTER TABLE "collaborator" DROP COLUMN "role_name",
ADD COLUMN     "roleName" "Role" NOT NULL DEFAULT 'EDITOR';
