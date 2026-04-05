"use server";

import * as db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.getProjects();
}

export async function getProjectBySlug(slug) {
  return db.getProjectBySlug(slug);
}

export async function getArtists() {
  return db.getArtists();
}

export async function getArtistBySlug(slug) {
  return db.getArtistBySlug(slug);
}

export async function getProjectsByArtist(artistSlug) {
  return db.getProjectsByArtist(artistSlug);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function addProject(formData) {
  const title = formData.get("title");
  const slug = formData.get("slug") || slugify(title);
  const artist = formData.get("artist");
  const artistSlug = formData.get("artistSlug") || slugify(artist);

  await db.addProject({
    title,
    slug,
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    videoUrl: formData.get("videoUrl") || null,
    description: formData.get("description") || null,
    artist,
    artistSlug,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addArtist(formData) {
  const name = formData.get("name");
  const slug = formData.get("slug") || slugify(name);

  await db.addArtist({
    name,
    slug,
    slogan: formData.get("slogan") || null,
    bio: formData.get("bio") || null,
  });

  revalidatePath("/admin");
  revalidatePath("/artists");
}

export async function deleteArtist(id) {
  await db.deleteArtist(id);

  revalidatePath("/admin");
  revalidatePath("/artists");
}

export async function updateProject(id, formData) {
  const title = formData.get("title");
  const slug = formData.get("slug") || slugify(title);
  const artist = formData.get("artist");
  const artistSlug = formData.get("artistSlug") || slugify(artist);

  await db.updateProject(id, {
    id,
    title,
    slug,
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    videoUrl: formData.get("videoUrl") || null,
    description: formData.get("description") || null,
    artist,
    artistSlug,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProject(id) {
  await db.deleteProject(id);

  revalidatePath("/admin");
  revalidatePath("/");
}
