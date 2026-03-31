const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

const projects = [
  {
    title: 'Luminous Glow',
    slug: 'luminous-glow',
    category: 'Animation',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
    videoUrl: 'https://cdn.pixabay.com/vimeo/312061327/abstract-21151.mp4?width=1280&hash=8b51d5c7f8a7e4b2d5a8e4b2d5a8e4b2d5a8e4b2',
    description: 'A luminous journey through abstract particles.',
    artist: 'Noisegraph',
    artistSlug: 'noisegraph'
  },
  {
    title: 'Cybernetic Dreams',
    slug: 'cybernetic-dreams',
    category: 'CGI',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    videoUrl: 'https://cdn.pixabay.com/vimeo/312061327/abstract-21151.mp4?width=1280&hash=8b51d5c7f8a7e4b2d5a8e4b2d5a8e4b2d5a8e4b2',
    description: 'Future aesthetics in motion.',
    artist: 'Ben Fearnley',
    artistSlug: 'ben-fearnley'
  },
  {
    title: 'Fluid Structures',
    slug: 'fluid-structures',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1614850523060-8da1d56ae167',
    videoUrl: 'https://cdn.pixabay.com/vimeo/312061327/abstract-21151.mp4?width=1280&hash=8b51d5c7f8a7e4b2d5a8e4b2d5a8e4b2d5a8e4b2',
    description: 'Dynamic liquid simulations.',
    artist: 'Arcade Studio',
    artistSlug: 'arcade-studio'
  }
];

const artists = [
  { name: 'Noisegraph', slug: 'noisegraph', slogan: 'Motion Masters', bio: 'Expert in particle simulations.' },
  { name: 'Ben Fearnley', slug: 'ben-fearnley', slogan: 'CGI Specialist', bio: 'Pushing the boundaries of realistic CGI.' },
  { name: 'Arcade Studio', slug: 'arcade-studio', slogan: 'Design Thinkers', bio: 'Merging art and technology.' }
];

const insertProject = db.prepare(`
  INSERT OR IGNORE INTO projects (title, slug, category, imageUrl, videoUrl, description, artist, artistSlug)
  VALUES (@title, @slug, @category, @imageUrl, @videoUrl, @description, @artist, @artistSlug)
`);

const insertArtist = db.prepare(`
  INSERT OR IGNORE INTO artists (name, slug, slogan, bio)
  VALUES (@name, @slug, @slogan, @bio)
`);

projects.forEach(p => insertProject.run(p));
artists.forEach(a => insertArtist.run(a));

console.log('Database seeded successfully.');
db.close();
