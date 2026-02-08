-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "consultationFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dob" TIMESTAMP(3);
