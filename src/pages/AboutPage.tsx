import { Github, Send, Mail } from 'lucide-react';
import { author } from '../data/author';

const skills = ['Linux', 'Docker', 'K8s', 'Python', 'Go', 'TypeScript', 'AI', 'Cloud'];

const contacts = [
  { label: 'GitHub', icon: Github, href: author.url, handle: author.handle },
  { label: 'Telegram', icon: Send, href: 'https://t.me/stanleychan87', handle: '@stanleychan87' },
  { label: 'Email', icon: Mail, href: 'mailto:johnsmith874436@gmail.com', handle: 'johnsmith874436@gmail.com' },
];

export function AboutPage() {
  return (
    <div className="content-frame" style={{ animation: 'premium-fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
      <div className="section-header">
        <div>
          <p className="eyebrow">ENCRYPTED // USER PROFILE</p>
          <h2>ABOUT</h2>
        </div>
        <span className="online-pill">ONLINE</span>
      </div>

      <section className="brand-panel" style={{ marginTop: '18px' }}>
        <h1>{author.name}</h1>
        <p className="role" style={{ marginTop: '6px', marginBottom: '10px', fontSize: '0.82rem' }}>
          {author.role}
        </p>
        <p>
          Full-stack engineer and infrastructure tinkerer navigating the datastreams of distributed systems.
          {author.bio.replace(/["']/g, '')}
        </p>
      </section>

      <section style={{ marginTop: '22px' }}>
        <p className="eyebrow" style={{ marginBottom: '12px' }}>TECH STACK // SKILLS</p>
        <div className="brand-grid">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '22px' }}>
        <p className="eyebrow" style={{ marginBottom: '12px' }}>CONTACT // CHANNELS</p>
        <div className="side-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {contacts.map(({ label, icon: Icon, href, handle }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="handle" style={{ fontSize: '0.85rem' }}>
              <Icon size={17} aria-hidden="true" />
              {handle}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
