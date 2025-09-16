import { PrismaClient, Role, DeviceType, BillingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

/** ---- Config ---- */
const PASSWORD = "Passw0rd!";
const CUSTOMERS_COUNT = 6;                  // how many customer accounts
const MIN_DEVICES_PER_CUSTOMER = 1;
const MAX_DEVICES_PER_CUSTOMER = 3;
const MONTHS_BACK = 3;                      // last 3 full months
const RANDOM_SEED = 424242;                 // keep output stable across runs
faker.seed(RANDOM_SEED);

/** Utility: month start/end in UTC for the last N full months */
function lastFullMonths(n: number): { start: Date; end: Date; label: string }[] {
  const now = new Date();                   // e.g., 2025-09-16
  const months: { start: Date; end: Date; label: string }[] = [];
  // Start from previous month (full) and go back n-1
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  for (let i = 1; i <= n; i++) {
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth() - (i - 1);
    const start = new Date(Date.UTC(y, m, 1));
    const end = new Date(Date.UTC(y, m + 1, 0)); // last day of that month
    const label = start.toISOString().slice(0, 7);
    months.push({ start, end, label });
  }
  return months.reverse(); // oldest -> newest
}

async function upsertAdmin() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  return prisma.profile.upsert({
    where: { email: "admin@scada.local" },
    update: { passwordHash: hash, role: Role.admin, fullName: "Admin User" },
    create: {
      email: "admin@scada.local",
      fullName: "Admin User",
      role: Role.admin,
      passwordHash: hash,
    },
  });
}

function randomCompanyDomain() {
  const brands = ["acme-h2o", "bluevalve", "flowgrid", "aquanode", "hydrolink", "clearwell", "watervista", "nileworks"];
  return `${faker.helpers.arrayElement(brands)}.${faker.helpers.arrayElement(["io","co","net","tech"])}`;
}

async function upsertCustomers(count: number) {
  const customers = [];
  const hash = await bcrypt.hash(PASSWORD, 10);

  for (let i = 0; i < count; i++) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const fullName = `${first} ${last}`;
    const domain = randomCompanyDomain();
    const local = `${first}.${last}`.toLowerCase().replace(/[^a-z]/g, "");
    const email = `${local}@${domain}`;

    const customer = await prisma.profile.upsert({
      where: { email },
      update: { fullName, role: Role.customer, passwordHash: hash },
      create: { email, fullName, role: Role.customer, passwordHash: hash },
    });
    customers.push(customer);
  }
  return customers;
}

function randomDeviceName(type: DeviceType) {
  const codes = faker.string.alphanumeric({ length: 2 }).toUpperCase();
  const num = faker.number.int({ min: 1, max: 99 });
  if (type === DeviceType.pump)   return `Pump ${codes}${num}`;
  if (type === DeviceType.valve)  return `Valve ${codes}${num}`;
  return `Flow Sensor ${codes}${num}`;
}

function randomLocation() {
  const site = faker.company.name();
  const area = faker.helpers.arrayElement(["Plant A", "Plant B", "Main Line", "Chiller Room", "Intake", "Return"]);
  return `${site} – ${area}`;
}

async function ensureDevice(ownerId: number, type: DeviceType) {
  // Generate a deterministic device name per owner/type to minimize duplicates on re-seed
  const name = randomDeviceName(type);
  const location = randomLocation();

  const existing = await prisma.device.findFirst({ where: { ownerId, name } });
  if (existing) return existing;

  return prisma.device.create({ data: { ownerId, name, type, location } });
}

function usageAndRateByType(t: DeviceType) {
  if (t === DeviceType.pump)   return { usage: faker.number.float({ min: 180, max: 260, multipleOf: 0.1 }), rate: faker.number.float({ min: 0.14, max: 0.18, multipleOf: 0.01 }) };
  if (t === DeviceType.valve)  return { usage: faker.number.float({ min: 60,  max: 95,  multipleOf: 0.1 }), rate: faker.number.float({ min: 0.08, max: 0.12, multipleOf: 0.01 }) };
  return { usage: faker.number.float({ min: 110, max: 140, multipleOf: 0.1 }), rate: faker.number.float({ min: 0.11, max: 0.13, multipleOf: 0.01 }) };
}

function statusForMonthIndex(idx: number, total: number): BillingStatus {
  // Oldest -> 'paid', middle -> 'pending', newest -> mostly 'pending', sometimes 'overdue'
  if (idx === 0) return BillingStatus.paid;
  if (idx === total - 1) return faker.number.int({ min: 1, max: 5 }) === 1 ? BillingStatus.overdue : BillingStatus.pending;
  return BillingStatus.pending;
}

async function ensureBill(customerId: number, deviceId: number, periodStart: Date, periodEnd: Date, deviceType: DeviceType, status: BillingStatus) {
  const found = await prisma.billing.findFirst({
    where: { customerId, deviceId, periodStart, periodEnd },
  });
  if (found) return found;

  const { usage, rate } = usageAndRateByType(deviceType);
  const total = Number((usage * rate).toFixed(2));

  return prisma.billing.create({
    data: {
      customerId,
      deviceId,
      periodStart,
      periodEnd,
      usage,
      rate,
      total,
      status,
    },
  });
}

async function seed() {
  console.log("Seeding admin…");
  await upsertAdmin();

  console.log(`Seeding ${CUSTOMERS_COUNT} customers…`);
  const customers = await upsertCustomers(CUSTOMERS_COUNT);

  console.log("Creating devices & billing…");
  const months = lastFullMonths(MONTHS_BACK); // e.g., Jun–Aug (if running in Sep)

  for (const cust of customers) {
    const deviceCount = faker.number.int({ min: MIN_DEVICES_PER_CUSTOMER, max: MAX_DEVICES_PER_CUSTOMER });
    const deviceTypesPool: DeviceType[] = [DeviceType.pump, DeviceType.valve, DeviceType.sensor];

    const devices = [];
    for (let i = 0; i < deviceCount; i++) {
      const type = faker.helpers.arrayElement(deviceTypesPool);
      const device = await ensureDevice(cust.id, type);
      devices.push(device);
    }

    for (const [idx, m] of months.entries()) {
      for (const d of devices) {
        const status = statusForMonthIndex(idx, months.length);
        await ensureBill(cust.id, d.id, m.start, m.end, d.type, status);
      }
    }
  }

  console.log("✅ Seed complete.");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
