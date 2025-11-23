// app/story/[slug]/page.tsx
import { Metadata } from "next";
import StoryDetailsClient from "./StoryDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to fetch story data
async function getStoryData(slug: string) {
  try {
    const res = await fetch(
      `https://www.herimmigranttales.org/api/stories/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching story:", error);
    return null;
  }
}

// Helper to fetch other stories
async function getOtherStories(currentSlug: string) {
  try {
    const res = await fetch(`https://www.herimmigranttales.org/api/stories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const stories = await res.json();
    return stories
      .filter((b: any) => b.slug !== currentSlug && b.status === "published")
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching other stories:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryData(slug);

  if (!story) {
    return {
      title: "Story",
      description:
        "Read inspiring stories from immigrant women around the world.",
      openGraph: {
        title: "Story",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Story",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
      },
    };
  }

  return {
    title: story.metaTitle || story.title || "Story",
    description:
      story.metaDescription ||
      story.summary ||
      "Read inspiring stories from immigrant women",
    keywords: story.primaryKeyword || story.title,
    authors: [{ name: story.author, url: "https://www.herimmigranttales.org" }],
    openGraph: {
      title: story.metaTitle || story.title,
      description: story.metaDescription || story.summary,
      images: [story.metaImage || story.thumbnail || "/logo1.svg"],
      type: "article",
      url: `https://www.herimmigranttales.org/stories/${story.slug}`,
      siteName: "Her Immigrant Tales",
      publishedTime: story.dateCreated,
      modifiedTime: story.lastUpdated || story.dateCreated,
      authors: [story.author],
    },
    twitter: {
      card: "summary_large_image",
      title: story.metaTitle || story.title,
      description: story.metaDescription || story.summary,
      images: [story.metaImage || story.thumbnail || "/logo1.svg"],
      creator: story.author,
    },
    alternates: {
      canonical: `https://www.herimmigranttales.org/stories/${story.slug}`,
    },
  };
}

// Generate JSON-LD structured data
function generateStructuredData(story: any) {
  const storyPostingSchema = {
    "@context": "https://schema.org",
    "@type": "Story",
    headline: story.metaTitle || story.title,
    description: story.metaDescription || story.summary,
    image: story.metaImage || story.thumbnail,
    author: {
      "@type": "Person",
      name: story.author,
      url: "https://www.herimmigranttales.org",
    },
    publisher: {
      "@type": "Organization",
      name: "Her Immigrant Tales",
      logo: {
        "@type": "ImageObject",
        url: "https://www.herimmigranttales.org/logo1.svg",
      },
    },
    datePublished: story.dateCreated,
    dateModified: story.lastUpdated || story.dateCreated,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.herimmigranttales.org/stories/${story.slug}`,
    },
    keywords: story.primaryKeyword || story.title,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.herimmigranttales.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Stories",
        item: "https://www.herimmigranttales.org/stories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: story.title,
        item: `https://www.herimmigranttales.org/stories/${story.slug}`,
      },
    ],
  };

  // If there are FAQs, add FAQ schema
  if (story.faq && story.faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: story.faq.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };

    return [storyPostingSchema, breadcrumbSchema, faqSchema];
  }

  return [storyPostingSchema, breadcrumbSchema];
}

// Server Component - crawlers see this
export default async function StoryPage({ params }: Props) {
  const { slug } = await params;

  // Fetch data server-side for SEO
  const story = await getStoryData(slug);
  const otherStories = await getOtherStories(slug);

  // Generate structured data if story exists
  const structuredData = story ? generateStructuredData(story) : null;
  return (
    <>
      {/* JSON-LD Structured Data - bots see this */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {/* Pass server data to client component */}
      <StoryDetailsClient story={story} otherStories={otherStories} />
    </>
  );
}
