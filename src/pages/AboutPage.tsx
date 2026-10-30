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
    <div className="content-frame about-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">ENCRYPTED // USER PROFILE</p>
          <h2>ABOUT</h2>
        </div>
        <span className="online-pill">ONLINE</span>
      </div>

      <section className="brand-panel">
        <h1>{author.name}</h1>
        <p className="role">{author.role}</p>
        <p>
          Full-stack engineer and infrastructure tinkerer navigating the datastreams of distributed systems.
          {author.bio.replace(/["']/g, '')}
        </p>
      </section>

      <section className="about-section">
        <p className="eyebrow">TECH STACK // SKILLS</p>
        <div className="brand-grid">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <p className="eyebrow">CONTACT // CHANNELS</p>
        <div className="side-nav about-contact">
          {contacts.map(({ label, icon: Icon, href, handle }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="handle">
              <Icon size={17} aria-hidden="true" />
              {handle}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
