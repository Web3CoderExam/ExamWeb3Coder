const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
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

async function main() {
  await prisma.question.deleteMany();
  await prisma.session.deleteMany();
  await prisma.event.deleteMany();
  await prisma.speaker.deleteMany();

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

            return {
              id: session.id,
              title: session.title,
              description: session.description,
              date: new Date(session.date || event.date),
              time: session.time || session.startTime,
              startTime: session.startTime || session.time,
              endTime: session.endTime,
              duration: session.duration || 1,
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
