import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "data.json");

const emptyStore = {
  projects: [],
  artists: [],
};

async function ensureStore() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify(emptyStore, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataPath, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      artists: Array.isArray(parsed.artists) ? parsed.artists : [],
    };
  } catch {
    return { ...emptyStore };
  }
}

async function writeStore(store) {
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
}

function getNextId(items) {
  return (
    items.reduce((maxId, item) => {
      const id = Number(item.id) || 0;
      return Math.max(maxId, id);
    }, 0) + 1
  );
}

export async function getProjects() {
  const store = await readStore();
  return [...store.projects].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export async function getProjectBySlug(slug) {
  const store = await readStore();
  return store.projects.find((project) => project.slug === slug) || null;
}

export async function getArtists() {
  const store = await readStore();
  return [...store.artists].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || "")),
  );
}

export async function getArtistBySlug(slug) {
  const store = await readStore();
  return store.artists.find((artist) => artist.slug === slug) || null;
}

export async function getProjectsByArtist(artistSlug) {
  const store = await readStore();
  return store.projects.filter((project) => project.artistSlug === artistSlug);
}

export async function addProject(input) {
  const store = await readStore();

  if (store.projects.some((project) => project.slug === input.slug)) {
    throw new Error(`Project slug already exists: ${input.slug}`);
  }

  const project = {
    id: getNextId(store.projects),
    title: input.title,
    slug: input.slug,
    category: input.category,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl ?? null,
    description: input.description ?? null,
    artist: input.artist,
    artistSlug: input.artistSlug,
    createdAt: new Date().toISOString(),
  };

  store.projects.push(project);
  await writeStore(store);

  return project;
}

export async function addArtist(input) {
  const store = await readStore();

  if (store.artists.some((artist) => artist.slug === input.slug)) {
    throw new Error(`Artist slug already exists: ${input.slug}`);
  }

  if (store.artists.some((artist) => artist.name === input.name)) {
    throw new Error(`Artist name already exists: ${input.name}`);
  }

  const artist = {
    id: getNextId(store.artists),
    name: input.name,
    slug: input.slug,
    slogan: input.slogan ?? null,
    bio: input.bio ?? null,
    createdAt: new Date().toISOString(),
  };

  store.artists.push(artist);
  await writeStore(store);

  return artist;
}

export async function deleteArtist(id) {
  const store = await readStore();
  const numericId = Number(id);
  const initialLength = store.artists.length;
  store.artists = store.artists.filter(
    (artist) => Number(artist.id) !== numericId,
  );
  if (store.artists.length === initialLength) return false;
  await writeStore(store);
  return true;
}

export async function updateArtist(id, input) {
  const store = await readStore();
  const numericId = Number(id);
  const idx = store.artists.findIndex((a) => Number(a.id) === numericId);
  if (idx === -1) throw new Error(`Artist not found: ${id}`);

  const existing = store.artists[idx];
  store.artists[idx] = {
    ...existing,
    name: input.name,
    slug: input.slug,
    slogan: input.slogan ?? existing.slogan,
    bio: input.bio ?? existing.bio,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  await writeStore(store);
  return store.artists[idx];
}

export async function updateProject(id, input) {
  const store = await readStore();
  const numericId = Number(id);

  const projectIndex = store.projects.findIndex(
    (project) => Number(project.id) === numericId,
  );
  if (projectIndex === -1) {
    throw new Error(`Project not found: ${id}`);
  }

  const slugTaken = store.projects.some(
    (project) =>
      project.slug === input.slug && Number(project.id) !== numericId,
  );
  if (slugTaken) {
    throw new Error(`Project slug already exists: ${input.slug}`);
  }

  const existing = store.projects[projectIndex];
  store.projects[projectIndex] = {
    ...existing,
    title: input.title,
    slug: input.slug,
    category: input.category,
    imageUrl: input.imageUrl,
    videoUrl: input.videoUrl ?? null,
    description: input.description ?? null,
    artist: input.artist,
    artistSlug: input.artistSlug,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  await writeStore(store);
  return store.projects[projectIndex];
}

export async function deleteProject(id) {
  const store = await readStore();
  const numericId = Number(id);

  const initialLength = store.projects.length;
  store.projects = store.projects.filter(
    (project) => Number(project.id) !== numericId,
  );

  if (store.projects.length === initialLength) {
    return false;
  }

  await writeStore(store);
  return true;
}
