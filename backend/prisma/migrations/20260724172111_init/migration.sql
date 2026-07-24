-- DropIndex
DROP INDEX "cultural_activities_departmentCode_idx";

-- DropIndex
DROP INDEX "hackathons_departmentCode_idx";

-- DropIndex
DROP INDEX "industry_project_students_projectId_idx";

-- DropIndex
DROP INDEX "industry_projects_departmentCode_idx";

-- DropIndex
DROP INDEX "other_curricular_activities_departmentCode_idx";

-- DropIndex
DROP INDEX "sports_activities_departmentCode_idx";

-- DropIndex
DROP INDEX "technical_events_departmentCode_idx";

-- AlterTable
ALTER TABLE "technical_events" ALTER COLUMN "eventType" DROP DEFAULT;
