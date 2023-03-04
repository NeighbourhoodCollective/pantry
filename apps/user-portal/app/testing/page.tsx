//import { keystoneContext } from "@opensaas-clubhouse/backend";

export default async function Page() {
    //const clubs = await keystoneContext.prisma.club.findMany();
    return (
        <div>
            <h1>Clubs</h1>
            <ul>
                {/* {clubs.map((club) => (
                    <li key={club.id}>{club.name}</li>
                ))} */}
            </ul>
        </div>
    )
}