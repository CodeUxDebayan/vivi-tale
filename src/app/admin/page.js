import { getProjects, getArtists, addProject, deleteProject, addArtist } from '../actions';
import styles from './admin.module.css';
import Link from 'next/link';

export default async function AdminPage() {
  const [projects, artists] = await Promise.all([getProjects(), getArtists()]);

  return (
    <div className={styles.container} style={{maxWidth: '1600px'}}>
      <header className={styles.header}>
        <h1>TALES BY VIVI CMS</h1>
        <Link href="/">Return to Site</Link>
      </header>

      <div className={styles.grid} style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
        {/* Project Form */}
        <div className={styles.formPanel}>
          <h2>Add New Project</h2>
          <form action={addProject}>
            <div className={styles.inputGroup}>
              <label>Title</label>
              <input type="text" name="title" required className={styles.input} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Slug (Optional - auto-generated)</label>
              <input type="text" name="slug" className={styles.input} placeholder="my-awesome-project" />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Category</label>
              <input type="text" name="category" required placeholder="e.g. Set Design" className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label>Artist Name</label>
              <input type="text" name="artist" required placeholder="e.g. Noisegraph" className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label>Artist Slug (Optional)</label>
              <input type="text" name="artistSlug" placeholder="noisegraph" className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label>Image URL</label>
              <input type="url" name="imageUrl" required placeholder="https://..." className={styles.input} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Video URL (Optional - Pexels/Pixabay link)</label>
              <input type="url" name="videoUrl" placeholder="https://..." className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label>Description (Optional)</label>
              <textarea name="description" className={styles.textarea}></textarea>
            </div>

            <button type="submit" className={styles.button}>Add Project</button>
          </form>
        </div>

        {/* Artist Form */}
        <div className={styles.formPanel}>
          <h2>Add New Artist</h2>
          <form action={addArtist}>
            <div className={styles.inputGroup}>
              <label>Artist Name</label>
              <input type="text" name="name" required className={styles.input} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Artist Slogan</label>
              <input type="text" name="slogan" placeholder="Simply Better Than Reality" className={styles.input} />
            </div>

            <div className={styles.inputGroup}>
              <label>Biography</label>
              <textarea name="bio" className={styles.textarea} placeholder="Madrid-Based CGI Studio..."></textarea>
            </div>

            <button type="submit" className={styles.button}>Add Artist</button>
          </form>
          
          <div style={{marginTop: '2rem'}}>
            <h3>Artists List ({artists.length})</h3>
            <div style={{maxHeight: '300px', overflowY: 'auto', marginTop: '1rem'}}>
              {artists.map(a => (
                <div key={a.id} style={{padding: '0.5rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between'}}>
                  <span>{a.name}</span>
                  <span style={{color: '#555'}}>{a.slug}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className={styles.listPanel}>
          <h2>Current Projects ({projects.length})</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {projects.map(project => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectInfo}>
                  <h3 style={{fontSize: '1rem'}}>{project.title}</h3>
                  <p>{project.category} | {project.artist}</p>
                  {project.videoUrl && <span style={{fontSize: '0.7rem', color: '#0f0'}}>● Video Included</span>}
                </div>
                <form action={async () => {
                  'use server';
                  await deleteProject(project.id);
                }}>
                  <button type="submit" className={styles.deleteButton}>Delete</button>
                </form>
              </div>
            ))}
          </div>
          {projects.length === 0 && <p style={{color: '#888'}}>No projects have been added yet.</p>}
        </div>
      </div>
    </div>
  );
}
