import { useEffect, useMemo } from 'react'
import { getProjects } from './data/projects'
import {
  about,
  certifications,
  education,
  experience,
  highlights,
  profile,
  skills,
} from './data/site'

const useReveal = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

const withBase = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const formatTitle = (value) =>
  value
    ?.replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())

const getProjectGradient = (title) => {
  const gradients = [
    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  ]
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

const ProjectCard = ({ project }) => {
  const title = formatTitle(project.title ?? project.name ?? 'Project')
  const description = project.summary ?? project.description
  const gradient = useMemo(() => getProjectGradient(title), [title])

  return (
    <article className="project-card" data-reveal>
      <div
        className="project-thumb"
        style={!project.image ? { background: gradient } : {}}
      >
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" />
        ) : (
          <span
            style={{
              color: 'white',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {title?.slice(0, 2)?.toUpperCase()}
          </span>
        )}
      </div>
      <div>
        <h3 className="project-title">{title}</h3>
        <p className="project-desc">
          {description || 'Add a summary in projects.manual.json.'}
        </p>
      </div>
      <div className="tag-row">
        {(project.tags || []).slice(0, 5).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="social-row">
        {project.url && (
          <a className="pill" href={project.url} target="_blank" rel="noreferrer">
            Repo
          </a>
        )}
        {project.homepage && (
          <a className="pill" href={project.homepage} target="_blank" rel="noreferrer">
            Live
          </a>
        )}
      </div>
    </article>
  )
}

function App() {
  const projects = useMemo(() => getProjects(), [])
  const resumeUrl = withBase(profile.resumeUrl)
  const profileImage = withBase('profile.jpg')
  const profileFallback = withBase('profile-placeholder.svg')
  useReveal()

  return (
    <div className="app">
      <header className="hero" id="top">
        <div className="container">
          <nav className="nav">
            <div className="brand">
              MA <span className="dot" />
            </div>
            <div className="nav-links">
              <a href="#projects">Projects</a>
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#education">Education</a>
              <a href="#certifications">Certifications</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>

          <div className="hero-grid" data-reveal>
            <div className="hero-content">
              <p className="eyebrow">Portfolio</p>
              <h1>{profile.name}</h1>
              <p className="lead">{profile.title}</p>
              <p className="lead">{profile.tagline}</p>
              <div className="hero-cta">
                <a className="button primary" href="#projects">
                  View Projects
                </a>
                <a
                  className="button ghost"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
              </div>
              <div className="hero-meta">
                <div className="meta-card">
                  <div className="meta-label">Location</div>
                  <div className="meta-value">{profile.location}</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">Email</div>
                  <div className="meta-value">{profile.email}</div>
                </div>
                {highlights.map((item) => (
                  <div className="meta-card" key={item.label}>
                    <div className="meta-label">{item.label}</div>
                    <div className="meta-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-card">
              <img
                className="profile-image"
                src={profileImage}
                alt="Portrait of Moeez Alam"
                onError={(event) => {
                  event.currentTarget.src = profileFallback
                }}
              />
              <div className="hero-card-body">
                <p>{about.body}</p>
                <div className="social-row">
                  {profile.socials.map((social) => (
                    <a
                      className="pill"
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.label}
                    </a>
                  ))}
                  <a className="pill" href={`mailto:${profile.email}`}>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section" id="projects">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Projects</h2>
                <p className="section-caption">
                  A living catalog of what I have shipped, updated from GitHub
                  with curated highlights.
                </p>
              </div>
              <a className="button ghost" href={profile.socials[0].url}>
                View GitHub
              </a>
            </div>
            <div className="projects-grid">
              {projects.length === 0 ? (
                <p data-reveal>Run the project fetch script to populate this list.</p>
              ) : (
                projects.slice(0, 9).map((project) => (
                  <ProjectCard key={project.name} project={project} />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">About Me</h2>
                <p className="section-caption">{about.body}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Experience</h2>
                <p className="section-caption">
                  Roles that shaped my approach to storytelling and shipping.
                </p>
              </div>
            </div>
            <div className="timeline">
              {experience.map((item) => (
                <div className="timeline-item" key={`${item.role}-${item.company}`} data-reveal>
                  <div className="timeline-role">{item.role}</div>
                  <div className="timeline-meta">
                    {item.company} - {item.period}
                  </div>
                  <p className="project-desc">{item.description}</p>
                  {item.highlights && (
                    <div className="tag-row">
                      {item.highlights.map((highlight) => (
                        <span className="tag" key={highlight}>
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="education">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Education</h2>
                <p className="section-caption">
                  Academic milestones that anchor my learning journey.
                </p>
              </div>
            </div>
            <div className="timeline">
              {education.map((item) => (
                <div className="timeline-item" key={item.program} data-reveal>
                  <div className="timeline-role">{item.program}</div>
                  <div className="timeline-meta">
                    {item.school} - {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="certifications">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Certifications</h2>
                <p className="section-caption">
                  Professional validation of my technical skills.
                </p>
              </div>
            </div>
            <div className="skills-grid">
              {certifications.map((item) => (
                <div className="skills-card" key={item.name} data-reveal>
                  <div className="skills-title">{item.name}</div>
                  <div className="timeline-meta">{item.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Skills</h2>
                <p className="section-caption">
                  The stack and strengths that support my work.
                </p>
              </div>
            </div>
            <div className="skills-grid">
              {skills.map((group) => (
                <div className="skills-card" key={group.group} data-reveal>
                  <div className="skills-title">{group.group}</div>
                  <div className="tag-row">
                    {group.items.map((item) => (
                      <span className="tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container">
            <div className="section-header" data-reveal>
              <div>
                <h2 className="section-title">Contact</h2>
                <p className="section-caption">
                  Want to collaborate or need a builder? Let's talk.
                </p>
              </div>
            </div>
            <div className="contact-card" data-reveal>
              <h3 className="project-title">Start a conversation</h3>
              <p className="project-desc">
                Email me directly or connect on LinkedIn. I reply within 48
                hours.
              </p>
              <div className="hero-cta">
                <a className="button primary" href={`mailto:${profile.email}`}>
                  Email {profile.name}
                </a>
                <a
                  className="button ghost"
                  href={profile.socials[1].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          Built with React + Vite. Updated {new Date().getFullYear()}.
        </div>
      </footer>
    </div>
  )
}

export default App
