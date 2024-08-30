
import Logger from "./_components/emmm"
import { HydrateClient } from "~/trpc/server";
export default async function Home() {
    
    return (
      <HydrateClient>
        <Logger />
      </HydrateClient>
    );
  }