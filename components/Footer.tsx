import { Heart, ExternalLink, Mail, Github, Twitter, Facebook, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { InstallButton } from "./InstallButton";
import { siteConfig } from "@/src/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social icon map
  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    github: Github,
    mail: Mail,
    twitter: Twitter,
    facebook: Facebook,
    linkedin: Linkedin,
    youtube: Youtube,
  };

  return (
    <footer className="relative overflow-hidden border-t border-emerald-100 bg-emerald-950 pt-16 pb-20 text-emerald-100 md:pb-8 dark:border-dark-border dark:bg-dark-card">
      {/* Background Decoration */}
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-700/50 bg-emerald-950">
                <Image
                  src="/logo.png"
                  alt="নামাজ শিক্ষা লোগো"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="bangla-text text-xl font-bold leading-tight text-white dark:text-emerald-400">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-medium tracking-wider text-emerald-400 uppercase">
                  {siteConfig.shortName}
                </span>
              </div>
            </Link>
            <p className="bangla-text mt-5 text-sm leading-relaxed text-emerald-300/80 dark:text-emerald-400/60">
              {siteConfig.description}
            </p>

            {/* Social Links — Only show platforms with non-empty URLs */}
            <div className="mt-6 flex items-center gap-3">
              {Object.entries(siteConfig.socials)
                .filter(([, url]) => Boolean(url && url.trim().length > 0))
                .map(([platform, url]) => {
                  const Icon = socialIcons[platform] || ExternalLink;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target={url.startsWith("mailto:") ? "_self" : "_blank"}
                      rel={url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      aria-label={platform}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/60 text-emerald-300 transition-colors hover:bg-emerald-800 hover:text-white dark:bg-white/5 dark:text-emerald-400 dark:hover:bg-emerald-800/40"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Quick Links Groups from siteConfig */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {siteConfig.navigation.footer.map((group) => (
              <div key={group.title}>
                <h3 className="bangla-text text-sm font-bold uppercase tracking-widest text-emerald-400">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="bangla-text flex items-center gap-1 group text-sm text-emerald-200/70 transition-colors hover:text-gold-300 dark:text-dark-text-secondary dark:hover:text-emerald-400"
                      >
                        <span>{link.label}</span>
                        {link.isExternal && (
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* PWA Application Section */}
          <div className="lg:col-span-1">
            <h3 className="bangla-text text-sm font-bold uppercase tracking-widest text-emerald-400">
              অ্যাপলিকেশন (PWA)
            </h3>
            <div className="mt-5">
              <p className="bangla-text text-xs text-emerald-300/70 leading-relaxed mb-4 dark:text-dark-text-secondary">
                কোনো ইনস্টল ঝামেলা ছাড়াই যেকোনো মোবাইল ও কম্পিউটারে অফলাইনে এক্সেস করতে অ্যাপটি যুক্ত করুন।
              </p>
              <InstallButton variant="footer" />
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-14 border-t border-emerald-900/60 pt-8 dark:border-white/5">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="arabic-text text-xl text-gold-400/80">
                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 sm:items-end text-center sm:text-right">
              <p className="bangla-text text-xs text-emerald-400/90 dark:text-dark-text-secondary">
                Developed by{" "}
                <a
                  href={siteConfig.developer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gold-400 hover:underline"
                >
                  {siteConfig.developer.name}
                </a>
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500/70 uppercase tracking-widest leading-none dark:text-dark-text-muted">
                <Heart className="h-3 w-3 fill-emerald-500/30 text-emerald-500" />
                <span>{siteConfig.name} © {currentYear}</span>
                <span className="mx-1.5">•</span>
                <span>All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
