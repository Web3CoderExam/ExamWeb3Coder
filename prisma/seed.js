const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.$transaction([
    prisma.sessionSpeaker.deleteMany(),
    prisma.question.deleteMany(),
    prisma.session.deleteMany(),
    prisma.event.deleteMany(),
    prisma.room.deleteMany(),
    prisma.speaker.deleteMany(),
  ]);

  const roomA = await prisma.room.create({ data: { name: "Room A" } });
  const roomB = await prisma.room.create({ data: { name: "Room B" } });
  const roomC = await prisma.room.create({ data: { name: "Room C" } });

  const ben = await prisma.speaker.create({
    data: {
      name: "Ben",
      bio: "Expert en AgriTech et Machine Learning",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      expertise: ["Agriculture", "IA", "Machine Learning"],
    },
  });

  const aina = await prisma.speaker.create({
    data: {
      name: "Aina",
      bio: "Spécialiste en drones et capteurs",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      expertise: ["Drones", "IoT", "Capteurs"],
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "Conférence AgriTech Madagascar",
      description: "Utilisation de l'IA pour l'aide à la décision agricole.",
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-16"),
      location: "Antananarivo",
      category: "Agriculture",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
      sessions: {
        create: [
          {
            title: "Introduction",
            description: "Présentation générale du programme.",
            startTime: new Date("2026-05-15T09:00:00"),
            endTime: new Date("2026-05-15T10:00:00"),
            capacity: 120,
            roomId: roomA.id,
          },
          {
            title: "Drones et Capteurs",
            description: "Utilisation des drones agricoles.",
            startTime: new Date("2026-05-15T11:00:00"),
            endTime: new Date("2026-05-15T12:30:00"),
            capacity: 80,
            roomId: roomB.id,
          },
        ],
      },
    },
    include: {
      sessions: true,
    },
  });

  const session1 = event.sessions[0];
  const session2 = event.sessions[1];

  await prisma.sessionSpeaker.create({
    data: {
      sessionId: session1.id,
      speakerId: ben.id,
    },
  });

  await prisma.sessionSpeaker.create({
    data: {
      sessionId: session2.id,
      speakerId: aina.id,
    },
  });

  await prisma.question.create({
    data: {
      sessionId: session1.id,
      content: "Quels sont les objectifs principaux ?",
      author: "Jean",
      upvotes: 12,
    },
  });

  console.log("✅ Database seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });