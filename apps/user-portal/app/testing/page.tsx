import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
export default async function Page() {
    const clubs = await prisma.club.findMany();
    return (
        <div>
            <h1>Clubs</h1>
            <ul>
                {clubs.map((club) => (
                    <li key={club.id}>{club.name}</li>
                ))}
            </ul>
        </div>
    )
}