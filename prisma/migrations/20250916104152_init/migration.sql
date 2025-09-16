-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'operator', 'customer');

-- CreateEnum
CREATE TYPE "public"."DeviceType" AS ENUM ('valve', 'pump', 'sensor');

-- CreateEnum
CREATE TYPE "public"."ReadingStatus" AS ENUM ('open', 'closed', 'on', 'off');

-- CreateEnum
CREATE TYPE "public"."BillingStatus" AS ENUM ('pending', 'paid', 'overdue');

-- CreateEnum
CREATE TYPE "public"."CommandStatus" AS ENUM ('sent', 'acknowledged', 'failed');

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Device" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."DeviceType" NOT NULL,
    "location" TEXT,
    "ownerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reading" (
    "id" BIGSERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "value" DECIMAL(65,30),
    "unit" TEXT,
    "status" "public"."ReadingStatus",
    "usageLiters" DECIMAL(65,30),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Billing" (
    "id" BIGSERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "usage" DECIMAL(65,30) NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "status" "public"."BillingStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommandHistory" (
    "id" BIGSERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "command" TEXT NOT NULL,
    "params" JSONB NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."CommandStatus" NOT NULL DEFAULT 'sent',

    CONSTRAINT "CommandHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "public"."Profile"("email");

-- CreateIndex
CREATE INDEX "Device_ownerId_idx" ON "public"."Device"("ownerId");

-- CreateIndex
CREATE INDEX "Reading_deviceId_timestamp_idx" ON "public"."Reading"("deviceId", "timestamp");

-- CreateIndex
CREATE INDEX "Billing_customerId_idx" ON "public"."Billing"("customerId");

-- CreateIndex
CREATE INDEX "Billing_deviceId_idx" ON "public"."Billing"("deviceId");

-- CreateIndex
CREATE INDEX "Billing_status_idx" ON "public"."Billing"("status");

-- CreateIndex
CREATE INDEX "CommandHistory_deviceId_timestamp_idx" ON "public"."CommandHistory"("deviceId", "timestamp");

-- CreateIndex
CREATE INDEX "CommandHistory_userId_idx" ON "public"."CommandHistory"("userId");

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reading" ADD CONSTRAINT "Reading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Billing" ADD CONSTRAINT "Billing_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Billing" ADD CONSTRAINT "Billing_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommandHistory" ADD CONSTRAINT "CommandHistory_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommandHistory" ADD CONSTRAINT "CommandHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
