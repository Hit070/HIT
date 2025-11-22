// app/story/[slug]/page.tsx
import { Metadata } from "next";
import StoryDetailsClient from "./StoryDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch the story data for metadata
    const res = await fetch(
      `https://www.herimmigranttales.org/api/stories/${slug}`,
      {
        cache: "no-store",
      }
    );

    // if (!res.ok) {
    //   return {
    //     title: "Blog Post | Her Immigrant Tales",
    //     description:
    //       "Read inspiring stories from immigrant women around the world - stories of strength, resilience, and hope.",
    //     openGraph: {
    //       title: "Blog Post | Her Immigrant Tales",
    //       description:
    //         "Read inspiring stories from immigrant women around the world.",
    //       images: ["/logo1.svg"],
    //       type: "article",
    //     },
    //     twitter: {
    //       card: "summary_large_image",
    //       title: "Blog Post | Her Immigrant Tales",
    //       description:
    //         "Read inspiring stories from immigrant women around the world.",
    //       images: ["/logo1.svg"],
    //     },
    //   };
    // }

    const story = await res.json();

    return {
      title: story.metaTitle || story.title || "Story | Her Immigrant Tales",
      description:
        story.metaDescription ||
        story.summary ||
        "Read inspiring stories from immigrant women",
      keywords: story.primaryKeyword || story.category,
      authors: [{ name: story.author }],
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
        canonical: `https://www.herimmigranttales.org/story/${story.slug}`,
      },
    };
  } catch (error) {
    console.error("Error fetching story metadata:", error);
    return {
      title: "Story Post | Her Immigrant Tales",
      description:
        "Read inspiring stories from immigrant women around the world.",
      openGraph: {
        title: "Story Post | Her Immigrant Tales",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Story Post | Her Immigrant Tales",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
      },
    };
  }
}

export default function StoryPage() {
  return <StoryDetailsClient />;
}
