import {Ome} from "../_components/hey";

import { HydrateClient } from "~/trpc/server";
export default async function Home() {


    return (
      <HydrateClient>
        <Ome />
      </HydrateClient>
    );
  }