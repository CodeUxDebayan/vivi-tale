import { getProjects } from './actions';
import ClientPage from './ClientPage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();
  return <ClientPage projects={projects} />;
}
