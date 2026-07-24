-- CreateTable: technical_events
CREATE TABLE "technical_events" (
    "id"             TEXT NOT NULL,
    "studentName"    TEXT NOT NULL,
    "usn"            TEXT NOT NULL,
    "department"     TEXT NOT NULL,
    "section"        TEXT NOT NULL,
    "semester"       INTEGER NOT NULL,
    "projectName"    TEXT NOT NULL,
    "projectDomain"  TEXT NOT NULL,
    "academicYear"   TEXT NOT NULL,
    "facultyMentor"  TEXT,
    "projectStatus"  TEXT NOT NULL DEFAULT 'ONGOING',
    "departmentCode" TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technical_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable: sports_activities
CREATE TABLE "sports_activities" (
    "id"               TEXT NOT NULL,
    "studentName"      TEXT NOT NULL,
    "usn"              TEXT NOT NULL,
    "department"       TEXT NOT NULL,
    "section"          TEXT NOT NULL,
    "semester"         INTEGER NOT NULL,
    "sportName"        TEXT NOT NULL,
    "competitionLevel" TEXT NOT NULL,
    "positionMedal"    TEXT,
    "academicYear"     TEXT NOT NULL,
    "departmentCode"   TEXT NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable: cultural_activities
CREATE TABLE "cultural_activities" (
    "id"                   TEXT NOT NULL,
    "studentName"          TEXT NOT NULL,
    "usn"                  TEXT NOT NULL,
    "department"           TEXT NOT NULL,
    "section"              TEXT NOT NULL,
    "semester"             INTEGER NOT NULL,
    "culturalActivityName" TEXT NOT NULL,
    "eventName"            TEXT NOT NULL,
    "positionPrize"        TEXT,
    "academicYear"         TEXT NOT NULL,
    "departmentCode"       TEXT NOT NULL,
    "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultural_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: department scoping indexes for fast filtered queries
CREATE INDEX "technical_events_departmentCode_idx"  ON "technical_events"("departmentCode");
CREATE INDEX "sports_activities_departmentCode_idx" ON "sports_activities"("departmentCode");
CREATE INDEX "cultural_activities_departmentCode_idx" ON "cultural_activities"("departmentCode");
