'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface SidebarSocialLink {
  label: string;
  href: string;
  iconPath: string;
}

interface SidebarLatestPost {
  slug: string;
  date: string;
  title: string;
  readingTimeMinutes: number;
  primaryTag: string;
}

interface SidebarSection {
  slug: string;
  label: string;
  postCount: number;
  children: Array<{
    slug: string;
    label: string;
    postCount: number;
  }>;
}

interface SidebarStats {
  totalPosts: string;
  totalSections: string;
  totalTopics: string;
  totalReadingMinutes: number;
}

interface CyberSidebarClientProps {
  latestPosts: SidebarLatestPost[];
  sections: SidebarSection[];
  socialLinks: SidebarSocialLink[];
  stats: SidebarStats;
}

function CollapsiblePanel({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-panel edge-frame overflow-hidden lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <div className="data-label text-[10px] text-slate-400">{title}</div>
          <div className="data-label mt-1 text-[10px] text-yellow-100">{meta}</div>
        </div>
        <span className={`text-lg text-slate-400 transition-transform ${open ? 'rotate-45 text-yellow-100' : ''}`}>+</span>
      </button>

      {open && <div className="border-t border-white/8 px-5 py-4">{children}</div>}
    </div>
  );
}

export default function CyberSidebarClient({
  latestPosts,
  sections,
  socialLinks,
  stats,
}: CyberSidebarClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || '';
  const activeSubsection = searchParams.get('sub') || '';
  const onAboutPage = pathname === '/about';

  return (
    <aside className="w-full flex-shrink-0 space-y-5 lg:w-[21rem]">
      <div className="glass-panel edge-frame panel-sheen relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.08]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,10,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(98,243,255,0.08),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-cyan-300/55" />

        <div className="relative space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/12 bg-white/[0.05] shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
              <Image
                src="/kali-logo.png"
                alt="Stanley Chan avatar"
                width={72}
                height={72}
                className="object-contain p-2.5"
              />
            </div>

            <div className="min-w-0 space-y-3">
              <div>
                <p className="data-label text-[10px] text-yellow-100">operator id</p>
                <h2 className="mt-2 glitch-text font-display text-2xl font-semibold tracking-[0.05em] text-white">Stanley Chan</h2>
                <p className="mt-1 text-sm text-slate-400">@stanleychan87 // field operator</p>
              </div>

              <div className="flex flex-wrap gap-2 data-label text-[10px]">
                <span className="rounded-full border border-yellow-300/20 bg-yellow-300/[0.08] px-2.5 py-1 text-yellow-100">Linux</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-200">Python</span>
                <span className="rounded-full border border-cyan-300/18 bg-cyan-300/[0.05] px-2.5 py-1 text-cyan-100">Networking</span>
              </div>
            </div>
          </div>

          <p className="max-w-sm text-sm leading-7 text-slate-300">
            Tracking practical systems work across Linux hosts, proxy relays, and scraper stacks.
            Designed for fast scanning and long-form debugging alike.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/35 p-3">
              <div className="font-display text-2xl font-semibold text-white">{stats.totalPosts}</div>
              <div className="mt-1 data-label text-[10px] text-slate-400">posts</div>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/35 p-3">
              <div className="font-display text-2xl font-semibold text-white">{stats.totalSections}</div>
              <div className="mt-1 data-label text-[10px] text-slate-400">routes</div>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/35 p-3">
              <div className="font-display text-2xl font-semibold text-white">{stats.totalTopics}</div>
              <div className="mt-1 data-label text-[10px] text-slate-400">channels</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/8 pt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-yellow-300/35 hover:bg-white/[0.06] hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={link.iconPath} />
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel edge-frame relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(142,230,223,0.06),transparent_48%,rgba(209,180,111,0.05))]" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="data-label text-[10px] text-slate-400">quick jump</div>
            <div className="data-label text-[10px] text-yellow-100">Active</div>
          </div>

          <div className="grid gap-3">
            <Link
              href="/"
              className={`group rounded-[1.2rem] border p-4 transition-all ${
                !activeSection && !onAboutPage
                  ? 'border-yellow-300/30 bg-yellow-300/[0.08]'
                  : 'border-white/10 bg-white/[0.035] hover:border-yellow-300/35 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="data-label text-[10px] text-slate-400">stream</div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">Open full archive</div>
                </div>
                <span className="text-sm text-yellow-100 transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>

            <Link
              href="/about"
              className={`group rounded-[1.2rem] border p-4 transition-all ${
                onAboutPage
                  ? 'border-cyan-300/28 bg-cyan-300/[0.08]'
                  : 'border-white/10 bg-white/[0.035] hover:border-cyan-300/30 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="data-label text-[10px] text-slate-400">dossier</div>
                  <div className="mt-2 font-display text-xl font-semibold text-white">Read operator log</div>
                </div>
                <span className="text-sm text-cyan-100 transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          </div>

          <div className="rounded-[1.2rem] border border-white/8 bg-slate-950/30 p-4">
            <div className="flex items-center justify-between data-label text-[10px] text-slate-400">
              <span>channel load</span>
              <span className="text-yellow-100">{stats.totalReadingMinutes}+ min</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Dense notes mixed with longer walkthroughs. More relay terminal than glossy publication.
            </p>
          </div>
        </div>
      </div>

      <CollapsiblePanel title="Site Map" meta="Structured browse">
        <SidebarMap sections={sections} activeSection={activeSection} activeSubsection={activeSubsection} />
      </CollapsiblePanel>

      <div className="hidden lg:block">
        <div className="glass-panel edge-frame relative space-y-4 p-5">
          <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-white/20" />
          <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/20" />

          <div className="flex items-center justify-between">
            <div className="data-label text-[10px] text-slate-400">Site map</div>
            <div className="data-label text-[10px] text-yellow-100">Structured browse</div>
          </div>

          <SidebarMap sections={sections} activeSection={activeSection} activeSubsection={activeSubsection} />
        </div>
      </div>

      <CollapsiblePanel title="Latest posts" meta="Fresh entries">
        <LatestPosts posts={latestPosts} />
      </CollapsiblePanel>

      <div className="hidden lg:block">
        <div className="glass-panel edge-frame relative overflow-hidden p-5">
          <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-yellow-300/30" />
          <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-yellow-300/30" />

          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="data-label text-[10px] text-slate-400">recent traffic</div>
              <div className="data-label text-[10px] text-cyan-100">Fresh entries</div>
            </div>

            <LatestPosts posts={latestPosts} />

            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-yellow-300 via-amber-300 to-cyan-300" />
              <div
                className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]"
                style={{ backgroundSize: '200% 100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel edge-frame relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-cyan-300/50" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="data-label text-[10px] text-slate-400">system status</div>
            <div className="data-label text-[10px] text-yellow-100">Healthy</div>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center justify-between border-b border-white/8 pb-2">
              <span className="data-label text-slate-400">firewall</span>
              <span className="data-label text-yellow-100">active</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-2">
              <span className="data-label text-slate-400">trace_route</span>
              <span className="data-label text-cyan-100">masked</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/8 pb-2">
              <span className="data-label text-slate-400">data_fragments</span>
              <span className="data-label text-white">{stats.totalPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="data-label text-slate-400">index_nodes</span>
              <span className="data-label text-yellow-100">{stats.totalTopics}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarMap({
  sections,
  activeSection,
  activeSubsection,
}: {
  sections: SidebarSection[];
  activeSection: string;
  activeSubsection: string;
}) {
  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isActiveSection = activeSection === section.slug;

        return (
          <div
            key={section.slug}
            className={`rounded-[1.2rem] border p-4 transition-colors ${
              isActiveSection
                ? 'border-yellow-300/30 bg-yellow-300/[0.06]'
                : 'border-white/8 bg-white/[0.025]'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <Link
                href={`/?section=${section.slug}`}
                className={`font-display text-lg font-semibold transition-colors ${
                  isActiveSection ? 'text-yellow-100' : 'text-white hover:text-yellow-100'
                }`}
              >
                {section.label}
              </Link>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 data-label text-[10px] text-slate-300">
                {section.postCount} posts
              </span>
            </div>

            <div className="grid gap-2">
              {section.children.map((child) => {
                const isActiveSubsection = isActiveSection && activeSubsection === child.slug;

                return (
                  <Link
                    key={child.slug}
                    href={`/?section=${section.slug}&sub=${child.slug}`}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-[13px] transition-colors ${
                      isActiveSubsection
                        ? 'border-yellow-300/35 bg-yellow-300/[0.08] text-white'
                        : 'border-white/8 bg-slate-950/20 text-slate-300 hover:border-yellow-300/25 hover:text-white'
                    }`}
                  >
                    <span>{child.label}</span>
                    <span
                      className={`data-label text-[10px] ${
                        isActiveSubsection ? 'text-yellow-100' : 'text-slate-500'
                      }`}
                    >
                      {child.postCount}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LatestPosts({ posts }: { posts: SidebarLatestPost[] }) {
  return (
    <div className="space-y-3">
      {posts.map((post, index) => (
        <Link
          key={post.slug}
          href={`/posts/${post.slug}`}
          className="group block rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-4 transition-all hover:border-yellow-300/30 hover:bg-white/[0.05]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="data-label text-[10px] text-slate-500">
                {String(index + 1).padStart(2, '0')} / {post.date}
              </div>
              <div className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-tight text-white transition-colors group-hover:text-yellow-100">
                {post.title}
              </div>
            </div>
            <span className="shrink-0 text-sm text-slate-500 transition-colors group-hover:text-yellow-100">↗</span>
          </div>

          <div className="mt-3 flex items-center gap-2 data-label text-[10px] text-slate-400">
            <span>{post.readingTimeMinutes} min read</span>
            {post.primaryTag && (
              <>
                <span>/</span>
                <span className="text-slate-300">#{post.primaryTag}</span>
              </>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
