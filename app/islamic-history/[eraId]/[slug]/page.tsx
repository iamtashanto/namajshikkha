/* eslint-disable @typescript-eslint/no-explicit-any */
import historyData from "@/data/islamic-history.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen, Star, Users, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ eraId: string; slug: string }> }): Promise<Metadata> {
    const { eraId, slug } = await params;
    const era = historyData.find(e => e.id === eraId);
    const event = era?.events.find((e: any) => e.slug === slug) as any;
    if (!era || !event) return { title: "ইসলামের ইতিহাস — নামাজ শিক্ষা" };
    return {
        title: `${event.title_bn} | ${era.name_bn} — নামাজ শিক্ষা`,
        description: event.description_bn,
    };
}

// Generate all static paths
export function generateStaticParams() {
    const params: { eraId: string; slug: string }[] = [];
    historyData.forEach((era) => {
        era.events.forEach((event) => {
            if ((event as any).slug) {
                params.push({ eraId: era.id, slug: (event as any).slug });
            }
        });
    });
    return params;
}

// Helper to find next/prev events globally
function getAdjacentEvents(eraId: string, slug: string) {
    const allEvents: { era: typeof historyData[0]; event: any; index: number }[] = [];
    historyData.forEach(era => {
        era.events.forEach((event, idx) => {
            allEvents.push({ era, event: event as any, index: idx });
        });
    });

    const currentIdx = allEvents.findIndex(e => e.era.id === eraId && e.event.slug === slug);
    return {
        prev: currentIdx > 0 ? allEvents[currentIdx - 1] : null,
        next: currentIdx < allEvents.length - 1 ? allEvents[currentIdx + 1] : null,
    };
}


const colorMap: Record<string, { bg: string; text: string; badge: string; border: string; accent: string }> = {
    slate: { bg: "bg-slate-50 dark:bg-slate-900/30", text: "text-slate-600 dark:text-slate-400", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700", accent: "from-slate-500 to-slate-700" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", border: "border-amber-200 dark:border-amber-700", accent: "from-amber-500 to-amber-700" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-700", accent: "from-emerald-500 to-emerald-700" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", border: "border-blue-200 dark:border-blue-700", accent: "from-blue-500 to-blue-700" },
    red: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", border: "border-red-200 dark:border-red-700", accent: "from-red-500 to-red-700" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", border: "border-purple-200 dark:border-purple-700", accent: "from-purple-500 to-purple-700" },
    rose: { bg: "bg-rose-50 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", border: "border-rose-200 dark:border-rose-700", accent: "from-rose-500 to-rose-700" },
    orange: { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", border: "border-orange-200 dark:border-orange-700", accent: "from-orange-500 to-orange-700" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300", border: "border-teal-200 dark:border-teal-700", accent: "from-teal-500 to-teal-700" },
    cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/30", text: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", border: "border-cyan-200 dark:border-cyan-700", accent: "from-cyan-500 to-cyan-700" },
};

export default async function HistoryDetailPage({ params }: { params: Promise<{ eraId: string; slug: string }> }) {
    const { eraId, slug } = await params;

    const era = historyData.find(e => e.id === eraId);
    if (!era) notFound();

    const event = era.events.find((e: any) => e.slug === slug) as any;
    if (!event) notFound();

    const colors = colorMap[era.color] || colorMap.emerald;
    const { prev, next } = getAdjacentEvents(eraId, slug);

    // Try to load detailed content
    let detailedContent: any = null;
    try {
        detailedContent = (await import(`@/data/history-details/${eraId}/${slug}.json`)).default;
    } catch {
        // No detailed content available
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Back navigation */}
            <Link href="/islamic-history" className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 transition-all hover:border-emerald-200 hover:text-emerald-600 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-muted dark:hover:border-emerald-700 dark:hover:text-emerald-400">
                <ArrowLeft className="h-4 w-4" />
                <span className="bangla-text">ইতিহাসে ফিরে যান</span>
            </Link>

            {/* Era badge */}
            <div className="mb-4 mt-6">
                <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium ${colors.badge} ${colors.border}`}>
                    {era.icon} {era.name_bn} • {era.period}
                </span>
            </div>

            {/* Title */}
            <h1 className="bangla-text mb-2 text-2xl font-bold text-gray-800 dark:text-dark-text sm:text-3xl leading-relaxed">
                {event.title_bn}
            </h1>
            <p className="mb-6 text-sm text-gray-400 dark:text-dark-text-muted">{event.title_en}</p>

            {/* Year badge */}
            <div className="mb-8 flex items-center gap-2">
                <Calendar className={`h-4 w-4 ${colors.text}`} />
                <span className={`text-sm font-bold ${colors.text}`}>{event.year} CE</span>
            </div>

            {/* Summary card */}
            <div className={`mb-8 rounded-2xl border p-5 ${colors.bg} ${colors.border}`}>
                <h2 className="bangla-text mb-3 flex items-center gap-2 text-base font-bold text-gray-700 dark:text-dark-text">
                    <BookOpen className="h-4 w-4" /> সংক্ষিপ্ত বিবরণ
                </h2>
                <p className="bangla-text text-sm leading-8 text-gray-600 dark:text-dark-text-secondary">
                    {event.description_bn}
                </p>
            </div>

            {/* Significance */}
            <div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                <h2 className="bangla-text mb-3 flex items-center gap-2 text-base font-bold text-emerald-700 dark:text-emerald-400">
                    <Star className="h-4 w-4" /> গুরুত্ব ও তাৎপর্য
                </h2>
                <p className="bangla-text text-sm leading-8 text-emerald-600 dark:text-emerald-300">
                    {event.significance_bn}
                </p>
            </div>

            {/* Detailed Content (if available) */}
            {detailedContent && (
                <>
                    {/* Full History */}
                    {detailedContent.full_history_bn && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-card">
                            <h2 className="bangla-text mb-4 flex items-center gap-2 text-base font-bold text-gray-700 dark:text-dark-text">
                                📖 বিস্তারিত ইতিহাস
                            </h2>
                            <div className="bangla-text space-y-4 text-sm leading-8 text-gray-600 dark:text-dark-text-secondary">
                                {detailedContent.full_history_bn.map((para: string, idx: number) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Figures */}
                    {detailedContent.key_figures && detailedContent.key_figures.length > 0 && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-card">
                            <h2 className="bangla-text mb-4 flex items-center gap-2 text-base font-bold text-gray-700 dark:text-dark-text">
                                <Users className="h-4 w-4" /> প্রধান ব্যক্তিবর্গ
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {detailedContent.key_figures.map((figure: any, idx: number) => (
                                    <div key={idx} className={`rounded-xl border p-3 ${colors.bg} ${colors.border}`}>
                                        <p className="bangla-text text-sm font-bold text-gray-700 dark:text-dark-text">{figure.name_bn}</p>
                                        <p className="text-[11px] text-gray-400 dark:text-dark-text-muted">{figure.name_en}</p>
                                        <p className="bangla-text mt-1 text-xs leading-6 text-gray-500 dark:text-dark-text-secondary">{figure.role_bn}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Dates */}
                    {detailedContent.key_dates && detailedContent.key_dates.length > 0 && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 dark:border-dark-border dark:bg-dark-card">
                            <h2 className="bangla-text mb-4 text-base font-bold text-gray-700 dark:text-dark-text">
                                📅 গুরুত্বপূর্ণ তারিখসমূহ
                            </h2>
                            <div className="space-y-2">
                                {detailedContent.key_dates.map((d: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 rounded-lg border border-gray-50 bg-gray-50/50 px-3 py-2 dark:border-dark-border dark:bg-dark-card">
                                        <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${colors.badge}`}>{d.date}</span>
                                        <p className="bangla-text text-xs leading-5 text-gray-600 dark:text-dark-text-secondary">{d.event_bn}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Lessons */}
                    {detailedContent.lessons_bn && detailedContent.lessons_bn.length > 0 && (
                        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-800/40 dark:bg-amber-950/20">
                            <h2 className="bangla-text mb-4 text-base font-bold text-amber-700 dark:text-amber-400">
                                💡 শিক্ষা ও উপদেশ
                            </h2>
                            <ul className="bangla-text space-y-2 text-sm leading-7 text-amber-700 dark:text-amber-300">
                                {detailedContent.lessons_bn.map((lesson: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                        {lesson}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Quran References */}
                    {detailedContent.quran_references && detailedContent.quran_references.length > 0 && (
                        <div className="mb-8 rounded-2xl border border-purple-100 bg-purple-50/50 p-5 dark:border-purple-800/40 dark:bg-purple-950/20">
                            <h2 className="bangla-text mb-4 text-base font-bold text-purple-700 dark:text-purple-400">
                                📜 কুরআনের রেফারেন্স
                            </h2>
                            <div className="space-y-3">
                                {detailedContent.quran_references.map((ref: any, idx: number) => (
                                    <div key={idx}>
                                        <p className="arabic-text text-base text-purple-600 dark:text-purple-400">{ref.arabic}</p>
                                        <p className="bangla-text mt-1 text-xs text-purple-500 dark:text-purple-300">{ref.translation_bn}</p>
                                        <p className="mt-0.5 text-[10px] text-purple-400">— {ref.reference}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Prev/Next Navigation */}
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {prev ? (
                    <Link href={`/islamic-history/${prev.era.id}/${prev.event.slug}`} className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-700">
                        <ArrowLeft className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-emerald-500" />
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400">পূর্ববর্তী</p>
                            <p className="bangla-text truncate text-xs font-medium text-gray-600 dark:text-dark-text-secondary">{prev.event.title_bn}</p>
                        </div>
                    </Link>
                ) : <div />}
                {next ? (
                    <Link href={`/islamic-history/${next.era.id}/${next.event.slug}`} className="group flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white p-4 text-right transition-all hover:border-emerald-200 hover:shadow dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-700">
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-400">পরবর্তী</p>
                            <p className="bangla-text truncate text-xs font-medium text-gray-600 dark:text-dark-text-secondary">{next.event.title_bn}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-emerald-500" />
                    </Link>
                ) : <div />}
            </div>
        </div>
    );
}
