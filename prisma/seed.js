const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { createHash } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

function readDatabaseUrlFrom(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return undefined;

  const match = readFileSync(filePath, "utf8").match(/^DATABASE_URL=(.+)$/m);
  return match?.[1]?.trim();
}

const connectionString =
  process.env.DATABASE_URL ||
  readDatabaseUrlFrom(".env.local") ||
  readDatabaseUrlFrom(".env");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const data = JSON.parse(
  readFileSync(resolve(process.cwd(), "src/data/mockData.json"), "utf8")
);

function computeEndTime(startTime, duration) {
  if (!startTime || duration == null) return null;

  const [hours, minutes] = startTime.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + Math.round(duration * 60));

  return date.toTimeString().slice(0, 5);
}

async function main() {
  await prisma.question.deleteMany();
  await prisma.session.deleteMany();
  await prisma.event.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = process.env.SEED_ADMIN_PASSWORD || "Password123";
  const hashedPassword = createHash("sha256").update(defaultPassword).digest("hex");

  await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL || "admin@example.com",
      password: hashedPassword,
      name: "Admin EventSync",
      role: "organizer",
    },
  });

  for (const speaker of data.speakers) {
    await prisma.speaker.create({
      data: {
        id: speaker.id,
        name: speaker.name,
        role: speaker.role || speaker.bio || "Intervenant",
        bio: speaker.bio,
        avatar: speaker.avatar || speaker.image,
        image: speaker.image,
        expertise: speaker.expertise || [],
        links: speaker.links || {},
      },
    });
  }

  for (const event of data.events) {
    await prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        startDate: new Date(event.startDate || event.date),
        endDate: new Date(event.endDate || event.startDate || event.date),
        location: event.location,
        category: event.category,
        image: event.image,
        sessions: {
          create: (event.sessions || []).map((session) => {
            const speakerIds = session.speakerIds || [session.speakerId].filter(Boolean);

            const startTime = session.startTime || session.time;
            const duration = session.duration || 1;
            const endTime = session.endTime || computeEndTime(startTime, duration);

            return {
              id: session.id,
              title: session.title,
              description: session.description,
              date: new Date(session.date || event.date),
              time: session.time || session.startTime,
              startTime,
              endTime,
              duration,
              roomId: session.roomId,
              room: session.room || "Room A",
              capacity: session.capacity,
              speakers: {
                connect: speakerIds.map((id) => ({ id })),
              },
              questions: {
                create: (session.questions || []).map((question) => ({
                  id: question.id,
                  content: question.content,
                  author: question.author,
                  upvotes: question.upvotes || 0,
                  createdAt: new Date(question.createdAt),
                })),
              },
            };
          }),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
