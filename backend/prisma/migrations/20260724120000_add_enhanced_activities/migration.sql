-- CreateTable: industry_projects
CREATE TABLE "industry_projects" (
    "id"             TEXT NOT NULL,
    "projectName"    TEXT NOT NULL,
    "status"         TEXT NOT NULL DEFAULT 'ONGOING',
    "departmentCode" TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "industry_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable: industry_project_students
CREATE TABLE "industry_project_students" (
    "id"          TEXT NOT NULL,
    "projectId"   TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "usn"         TEXT NOT NULL,
    "semester"    INTEGER NOT NULL,
    "section"     TEXT NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "industry_project_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable: hackathons
CREATE TABLE "hackathons" (
    "id"             TEXT NOT NULL,
    "studentName"    TEXT NOT NULL,
    "usn"            TEXT NOT NULL,
    "semester"       INTEGER NOT NULL,
    "section"        TEXT NOT NULL,
    "hackathonName"  TEXT NOT NULL,
    "position"       TEXT NOT NULL,
    "year"           INTEGER NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id")
);

-- CreateTable: other_curricular_activities
CREATE TABLE "other_curricular_activities" (
    "id"               TEXT NOT NULL,
    "studentName"      TEXT NOT NULL,
    "usn"              TEXT NOT NULL,
    "semester"         INTEGER NOT NULL,
    "section"          TEXT NOT NULL,
    "eventName"        TEXT NOT NULL,
    "organizingCollege" TEXT NOT NULL,
    "achievement"      TEXT,
    "year"             INTEGER NOT NULL,
    "departmentCode"   TEXT NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "other_curricular_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: industry_project_students → industry_projects (cascade delete)
ALTER TABLE "industry_project_students"
    ADD CONSTRAINT "industry_project_students_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "industry_projects"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: department scoping
CREATE INDEX "industry_projects_departmentCode_idx"           ON "industry_projects"("departmentCode");
CREATE INDEX "industry_project_students_projectId_idx"        ON "industry_project_students"("projectId");
CREATE INDEX "hackathons_departmentCode_idx"                  ON "hackathons"("departmentCode");
CREATE INDEX "other_curricular_activities_departmentCode_idx" ON "other_curricular_activities"("departmentCode");
