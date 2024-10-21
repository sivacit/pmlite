/*
  Warnings:

  - You are about to drop the column `roleName` on the `collaborator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collaborator" DROP COLUMN "roleName",
ADD COLUMN     "role_name" "Role" NOT NULL DEFAULT 'EDITOR';
