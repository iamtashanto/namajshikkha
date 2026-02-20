import { Heart, BookOpen, ExternalLink, Mail, Github } from "lucide-react";
import Link from "next/link";
import { InstallButton } from "./InstallButton";

const footerLinks = [
    {
        title: "শিখুন",
        links: [
            { label: "নামাজের নিয়ম", href: "/namaj-rules" },
            { label: "সূরা ও দোয়া", href: "/surah-dua" },
            { label: "কুরআন মাজীদ", href: "/quran" },
            { label: "ইসলামিক ইতিহাস", href: "/islamic-history" },
        ]
    },
    {
        title: "রিসোর্স",
        links: [
            { label: "সহীহ হাদিস", href: "/hadith-faq" },
            { label: "সচরাচর প্রশ্ন", href: "/hadith-faq" },
            { label: "নামাজের সময়", href: "/" },
        ]
    }
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-emerald-100 bg-emerald-950 pt-16 pb-8 text-emerald-100 dark:border-dark-border dark:bg-dark-card">
            {/* Background Decoration */}
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/20">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="bangla-text text-xl font-bold leading-tight text-white dark:text-emerald-400">
                                    নামাজ শিক্ষা
                                </span>
                                <span className="text-[10px] font-medium tracking-wider text-emerald-400 uppercase">
                                    Prayer Learning
                                </span>
                            </div>
                        </Link>
                        <p className="bangla-text mt-6 text-sm leading-relaxed text-emerald-300/80 dark:text-emerald-400/60">
                            সহীহ কুরআন ও হাদিসের আলোকে সঠিকভাবে নামাজ শিখতে ও ইসলামকে জানুন।
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white dark:bg-white/5 dark:text-emerald-500">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white dark:bg-white/5 dark:text-emerald-500">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-2">
                        {footerLinks.map((group) => (
                            <div key={group.title}>
                                <h3 className="bangla-text text-sm font-bold uppercase tracking-widest text-emerald-400">
                                    {group.title}
                                </h3>
                                <ul className="mt-6 space-y-4">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="bangla-text flex items-center gap-1 group text-sm text-emerald-200/60 transition-colors hover:text-gold-400"
                                            >
                                                <span>{link.label}</span>
                                                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Install Section */}
                    <div className="lg:col-span-1">
                        <h3 className="bangla-text text-sm font-bold uppercase tracking-widest text-emerald-400">
                            অ্যাপলিকেশন
                        </h3>
                        <div className="mt-6">
                            <p className="bangla-text text-xs text-emerald-300/60 leading-relaxed mb-4">
                                দ্রুত এক্সেস করতে আমাদের প্রগ্রেসিভ ওয়েব অ্যাপটি আপনার মোবাইলে নামিয়ে নিন।
                            </p>
                            <InstallButton variant="footer" />
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-emerald-900/50 pt-8 dark:border-white/5">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-4">
                            <span className="arabic-text text-xl text-gold-400 opacity-60">
                                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:items-end text-center sm:text-right">
                            <p className="bangla-text text-xs text-emerald-400/80">
                                Developed by <span className="font-semibold text-gold-400">Md Tanvir Ahamed Shanto</span>
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500/60 uppercase tracking-widest leading-none">
                                <Heart className="h-3 w-3 fill-emerald-500/30" />
                                <span>নামাজ শিক্ষা © {new Date().getFullYear()}</span>
                                <span className="mx-2">•</span>
                                <span>All Rights Reserved</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
