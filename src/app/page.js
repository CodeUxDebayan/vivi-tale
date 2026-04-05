import { getProjects, getArtists } from "./actions";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, artists] = await Promise.all([getProjects(), getArtists()]);
  return <ClientPage projects={projects} artists={artists} />;
}
