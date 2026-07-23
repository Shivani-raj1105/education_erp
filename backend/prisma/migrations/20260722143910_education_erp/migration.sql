/*
  Warnings:

  - The primary key for the `faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `faculty` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "faculty_roles" DROP CONSTRAINT "faculty_roles_facultyId_fkey";

-- DropIndex
DROP INDEX "faculty_employeeId_key";

-- AlterTable
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "faculty_pkey" PRIMARY KEY ("employeeId");

-- AddForeignKey
ALTER TABLE "faculty_roles" ADD CONSTRAINT "faculty_roles_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "faculty"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;
