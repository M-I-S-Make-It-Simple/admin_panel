-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photoUrl" TEXT,
    "fullname" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "short_bio" TEXT NOT NULL,
    "community" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subject_name" TEXT NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    CONSTRAINT "Subject_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class_name" TEXT NOT NULL,
    "class_teacher" INTEGER NOT NULL,
    CONSTRAINT "Class_class_teacher_fkey" FOREIGN KEY ("class_teacher") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassSubj" (
    "classId" INTEGER NOT NULL,
    "subjId" INTEGER NOT NULL,

    PRIMARY KEY ("classId", "subjId"),
    CONSTRAINT "ClassSubj_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassSubj_subjId_fkey" FOREIGN KEY ("subjId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubjStaff" (
    "subject_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,

    PRIMARY KEY ("subject_id", "staff_id"),
    CONSTRAINT "SubjStaff_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubjStaff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
