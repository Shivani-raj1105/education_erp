/*
  Warnings:

  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faculty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faculty_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "faculty_roles" DROP CONSTRAINT "faculty_roles_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "faculty_roles" DROP CONSTRAINT "faculty_roles_roleId_fkey";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "faculty";

-- DropTable
DROP TABLE "faculty_roles";

-- DropTable
DROP TABLE "roles";

-- DropEnum
DROP TYPE "FacultyStatus";

-- CreateTable
CREATE TABLE "faculty_list" (
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "designation" TEXT NOT NULL,
    "specialization" TEXT,
    "qualification" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "photo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "coordinatorRoles" TEXT,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_list_pkey" PRIMARY KEY ("employeeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "faculty_list_email_key" ON "faculty_list"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_list_username_key" ON "faculty_list"("username");
