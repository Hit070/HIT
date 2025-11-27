// app/stories/[slug]/page.tsx
import { Metadata } from "next";
import StoryDetailsClient from "./StoryDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to fetch story data
async function getStoryData(slug: string) {
  try {
    const res = await fetch(
      `https://herimmigranttales.org/api/stories/${slug}`,
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
    const res = await fetch(`https://herimmigranttales.org/api/stories`, {
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
      title: {
        absolute: "Story",
      },
      description:
        "Read inspiring stories from immigrant women around the world.",
      openGraph: {
        title: "Story",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["https://herimmigranttales.org/logo1.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Story",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["https://herimmigranttales.org/logo1.svg"],
      },
    };
  }

  return {
    title: {
      absolute: story.metaTitle || story.title || "Story",
    },
    description:
      story.metaDescription ||
      story.summary ||
      "Read inspiring stories from immigrant women",
    keywords: story.primaryKeyword || story.title,
    authors: [{ name: story.author, url: "https://herimmigranttales.org" }],
    openGraph: {
      title: story.metaTitle || story.title,
      description: story.metaDescription || story.summary,
      images: [
        {
          url:
            story.metaImage ||
            story.thumbnail ||
            "https://herimmigranttales.org/logo1.svg",
          width: 1200,
          height: 630,
          alt: story.metaTitle || story.title || "Her Immigrant Tales",
        },
      ],
      type: "article",
      url: `https://herimmigranttales.org/stories/${story.slug}`,
      siteName: "Her Immigrant Tales",
      publishedTime: story.dateCreated,
      modifiedTime: story.lastUpdated || story.dateCreated,
      authors: [story.author],
    },
    twitter: {
      card: "summary_large_image",
      title: story.metaTitle || story.title,
      description: story.metaDescription || story.summary,
      images: [
        story.metaImage ||
          story.thumbnail ||
          "https://herimmigranttales.org/logo1.svg",
      ],
      creator: story.author,
    },
    alternates: {
      canonical: `https://herimmigranttales.org/stories/${story.slug}`,
    },
  };
}

// Server Component - crawlers see this
export default async function StoryPage({ params }: Props) {
  const { slug } = await params;

  // Fetch data server-side for SEO
  const story = await getStoryData(slug);
  const otherStories = await getOtherStories(slug);

  if (!story) {
    return <StoryDetailsClient story={null} otherStories={[]} />;
  }

  // Rely on `generateMetadata` for meta tags. Do not emit JSON-LD here.
  return <StoryDetailsClient story={story} otherStories={otherStories} />;
}
