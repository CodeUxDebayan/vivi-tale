'use server';

import db from '../lib/db';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
  const stmt = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC');
  return stmt.all();
}

export async function getProjectBySlug(slug) {
  const stmt = db.prepare('SELECT * FROM projects WHERE slug = ?');
  return stmt.get(slug);
}

export async function getArtists() {
  const stmt = db.prepare('SELECT * FROM artists ORDER BY name ASC');
  return stmt.all();
}

export async function getArtistBySlug(slug) {
  const stmt = db.prepare('SELECT * FROM artists WHERE slug = ?');
  return stmt.get(slug);
}

export async function getProjectsByArtist(artistSlug) {
  const stmt = db.prepare('SELECT * FROM projects WHERE artistSlug = ?');
  return stmt.all();
}

function slugify(text) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

export async function addProject(formData) {
  const title = formData.get('title');
  const slug = formData.get('slug') || slugify(title);
  const artist = formData.get('artist');
  const artistSlug = formData.get('artistSlug') || slugify(artist);

  const stmt = db.prepare(`
    INSERT INTO projects (title, slug, category, imageUrl, videoUrl, description, artist, artistSlug)
    VALUES (@title, @slug, @category, @imageUrl, @videoUrl, @description, @artist, @artistSlug)
  `);
  
  stmt.run({
    title,
    slug,
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    videoUrl: formData.get('videoUrl') || null,
    description: formData.get('description') || null,
    artist,
    artistSlug,
  });
  
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function addArtist(formData) {
  const name = formData.get('name');
  const slug = formData.get('slug') || slugify(name);
  
  const stmt = db.prepare(`
    INSERT INTO artists (name, slug, slogan, bio)
    VALUES (@name, @slug, @slogan, @bio)
  `);
  
  stmt.run({
    name,
    slug,
    slogan: formData.get('slogan') || null,
    bio: formData.get('bio') || null,
  });
  
  revalidatePath('/admin');
  revalidatePath('/artists');
}

export async function updateProject(id, formData) {
  const title = formData.get('title');
  const slug = formData.get('slug') || slugify(title);
  const artist = formData.get('artist');
  const artistSlug = formData.get('artistSlug') || slugify(artist);

  const stmt = db.prepare(`
    UPDATE projects 
    SET title = @title, slug = @slug, category = @category, imageUrl = @imageUrl, 
        videoUrl = @videoUrl, description = @description, artist = @artist, artistSlug = @artistSlug
    WHERE id = @id
  `);
  
  stmt.run({
    id,
    title,
    slug,
    category: formData.get('category'),
    imageUrl: formData.get('imageUrl'),
    videoUrl: formData.get('videoUrl') || null,
    description: formData.get('description') || null,
    artist,
    artistSlug,
  });
  
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteProject(id) {
  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.run(id);
  
  revalidatePath('/admin');
  revalidatePath('/');
}
