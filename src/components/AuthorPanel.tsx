import { Github } from 'lucide-react';
import { author } from '../data/author';

export function AuthorPanel() {
  return (
    <section className="panel author-panel" aria-labelledby="author-name">
      <img className="avatar" src={author.avatarUrl} alt="" />
      <div>
        <h1 id="author-name">{author.name}</h1>
        <a className="handle" href={author.url} target="_blank" rel="noopener noreferrer">
          <Github size={16} aria-hidden="true" />
          {author.handle}
        </a>
      </div>
      <p className="role">{author.role}</p>
      <p className="bio">{author.bio}</p>
      {author.metrics.length > 0 ? (
        <dl className="metrics">
          {author.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
