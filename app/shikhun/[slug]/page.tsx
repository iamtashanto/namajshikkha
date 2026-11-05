import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { siteConfig } from "@/src/config/site";
import {
  shikhunArticles,
  getShikhunArticleBySlug,
} from "@/src/data/shikhun";
import { getPrayerBySlug, getRulingBySlug } from "@/src/data";
import { Breadcrumbs, Card, Accordion } from "@/src/components/ui";
import { JsonLd } from "@/src/components/seo/JsonLd";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from "@/src/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return shikhunArticles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getShikhunArticleBySlug(slug);

  if (!article) {
    return {
      title: "প্রবন্ধ পাওয়া যায়নি",
    };
  }

  const title = `${article.titleBn} | নামাজ শিক্ষা`.slice(0, 60);
  const description = article.summaryBn.slice(0, 155);

  return {
    title,
    description,
    keywords: [
      article.titleBn,
      article.titleEn,
      "নামাজ শিক্ষা",
      "ইসলামিক প্রবন্ধ",
      "হানাফি ফিকহ",
      article.categoryLabelBn,
    ],
    alternates: {
      canonical: `${siteConfig.url}/shikhun/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/shikhun/${article.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ShikhunArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getShikhunArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: article.titleBn,
    description: article.summaryBn.slice(0, 155),
    url: `/shikhun/${article.slug}`,
    datePublished: article.publishedDate,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "হোম", url: "/" },
    { name: "শিখুন", url: "/shikhun" },
    { name: article.titleBn, url: `/shikhun/${article.slug}` },
  ]);

  const faqSchema = buildFAQSchema(article.faqs);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd schema={[articleSchema, breadcrumbSchema, faqSchema].filter(Boolean)} />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "শিখুন", href: "/shikhun" },
          { label: article.titleBn },
        ]}
      />

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/shikhun"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 dark:text-dark-text-muted dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>সকল প্রবন্ধে ফিরে যান</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-10 text-center sm:text-left space-y-4 border-b border-gray-100 dark:border-dark-border pb-8">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            {article.categoryLabelBn}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-text-muted">
            <Clock className="h-3.5 w-3.5" />
            {article.readTimeMinutes} মিনিট পাঠ
          </span>
          <span className="text-gray-300 dark:text-dark-border">•</span>
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-dark-text-muted">
            <Calendar className="h-3.5 w-3.5" />
            {article.publishedDate}
          </span>
        </div>

        <h1 className="bangla-text text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
          {article.titleBn}
        </h1>

        <p className="bangla-text text-base sm:text-lg text-emerald-800 dark:text-emerald-400/90 leading-relaxed font-medium">
          {article.summaryBn}
        </p>
      </header>

      {/* Article Body Content */}
      <article className="space-y-8">
        {article.contentSections.map((sec, idx) => (
          <section
            key={idx}
            className="rounded-2xl border border-emerald-100/70 dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-7 shadow-xs space-y-4"
          >
            <h2 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                {idx + 1}
              </span>
              <span>{sec.title}</span>
            </h2>

            <div className="space-y-3">
              {sec.paragraphs.map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="bangla-text text-sm sm:text-base leading-relaxed text-gray-700 dark:text-dark-text-secondary"
                >
                  {para}
                </p>
              ))}
            </div>

            {sec.keyPoints && sec.keyPoints.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  গুরুত্বপূর্ণ সারসংক্ষেপ:
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-dark-text-secondary">
                  {sec.keyPoints.map((kp, kpIdx) => (
                    <li key={kpIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="border-b border-emerald-100 dark:border-dark-border pb-3">
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                সাধারণ প্রশ্নোত্তর (FAQ)
              </h2>
            </div>
            <Accordion
              items={article.faqs.map((faq, idx) => ({
                id: `faq-${idx}`,
                title: faq.question,
                content: (
                  <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                    {faq.answer}
                  </p>
                ),
              }))}
            />
          </section>
        )}

        {/* Interlinking: Related Prayers */}
        {article.relatedPrayers && article.relatedPrayers.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-dark-border">
            <h2 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              সম্পর্কিত নামাজসমূহ:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {article.relatedPrayers.map((pSlug) => {
                const prayer = getPrayerBySlug(pSlug);
                if (!prayer) return null;
                return (
                  <Link
                    key={pSlug}
                    href={`/namaj/${pSlug}`}
                    className="p-3.5 rounded-xl border border-emerald-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="bangla-text text-sm font-bold text-gray-800 dark:text-dark-text group-hover:text-emerald-600 transition-colors">
                        {prayer.nameBn}
                      </div>
                      <div className="text-[11px] text-gray-400 dark:text-dark-text-muted">
                        {prayer.nameEn}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Interlinking: Related Masail */}
        {article.relatedMasail && article.relatedMasail.length > 0 && (
          <section className="space-y-4 pt-2">
            <h2 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              সম্পর্কিত জরুরি মাসায়েল:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.relatedMasail.map((mSlug) => {
                const ruling = getRulingBySlug(mSlug);
                if (!ruling) return null;
                return (
                  <Link
                    key={mSlug}
                    href={`/masail/${mSlug}`}
                    className="p-3.5 rounded-xl border border-emerald-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="bangla-text text-sm font-bold text-gray-800 dark:text-dark-text group-hover:text-emerald-600 transition-colors">
                        {ruling.titleBn}
                      </div>
                      <div className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted line-clamp-1">
                        {ruling.summaryBn}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Interlinking: Related Tools */}
        {article.relatedTools && article.relatedTools.length > 0 && (
          <section className="pt-2">
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-dark-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {article.relatedTools.map((tool, tIdx) => (
                <div key={tIdx} className="w-full flex items-center justify-between gap-3">
                  <div>
                    <h3 className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                    <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-secondary">
                      {tool.desc}
                    </p>
                  </div>
                  <Link
                    href={tool.url}
                    className="shrink-0 bangla-text px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    ওপেন করুন
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
