import { siteConfig } from "@/src/config/site";
import { PrayerType } from "@/src/types/content";

/**
 * Builds schema.org Organization and WebSite graph with SearchAction
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
          width: 512,
          height: 512,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        inLanguage: "bn",
      },
    ],
  };
}

/**
 * Builds schema.org HowTo schema for prayer step-by-step guides
 */
export function buildPrayerHowToSchema(prayer: PrayerType) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${prayer.nameBn} নামাজের সম্পূর্ণ নিয়ম ও পদ্ধতি`,
    description:
      prayer.fazilat?.textBn ||
      `${prayer.nameBn} নামাজের সঠিক নিয়ম, নিয়ত, রাকাত ও আমল।`,
    inLanguage: "bn",
    totalTime: "PT15M",
    step: prayer.steps.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `${step.rakatLabel}: ${step.titleBn}`,
      text: `${step.descriptionBn}${
        step.recitationCustom
          ? ` (পাঠ: ${step.recitationCustom.uccharonBn} - ${step.recitationCustom.meaningBn})`
          : ""
      }`,
      url: `${siteConfig.url}/namaj/${prayer.slug}#step-${step.stepNumber}`,
    })),
  };
}

/**
 * Builds schema.org FAQPage schema
 */
export function buildFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Builds schema.org BreadcrumbList schema
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Builds schema.org Article schema for history and learning articles
 */
export function buildArticleSchema(params: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    inLanguage: "bn",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url.startsWith("http")
        ? params.url
        : `${siteConfig.url}${params.url}`,
    },
    image: params.imageUrl
      ? params.imageUrl.startsWith("http")
        ? params.imageUrl
        : `${siteConfig.url}${params.imageUrl}`
      : `${siteConfig.url}/og-image.png`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: params.datePublished || "2024-01-01",
    dateModified: params.dateModified || new Date().toISOString().split("T")[0],
  };
}
