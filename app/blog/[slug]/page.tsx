// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import BlogDetailsClient from "./BlogDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch the blog data for metadata
    const res = await fetch(
      `https://www.herimmigranttales.org/api/blogs/${slug}`,
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

    const blog = await res.json();

    return {
      title: blog.metaTitle || blog.title || "Blog Post | Her Immigrant Tales",
      description:
        blog.metaDescription ||
        blog.summary ||
        "Read inspiring stories from immigrant women",
      keywords: blog.primaryKeyword || blog.category,
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.summary,
        images: [blog.metaImage || blog.thumbnail || "/logo1.svg"],
        type: "article",
        url: `https://www.herimmigranttales.org/blog/${blog.slug}`,
        siteName: "Her Immigrant Tales",
        publishedTime: blog.dateCreated,
        modifiedTime: blog.lastUpdated || blog.dateCreated,
        authors: [blog.author],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.summary,
        images: [blog.metaImage || blog.thumbnail || "/logo1.svg"],
        creator: blog.author,
      },
      alternates: {
        canonical: `https://www.herimmigranttales.org/blog/${blog.slug}`,
      },
    };
  } catch (error) {
    console.error("Error fetching blog metadata:", error);
    return {
      title: "Blog Post | Her Immigrant Tales",
      description:
        "Read inspiring stories from immigrant women around the world.",
      openGraph: {
        title: "Blog Post | Her Immigrant Tales",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog Post | Her Immigrant Tales",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["/logo1.svg"],
      },
    };
  }
}

export default function BlogPage() {
  return <BlogDetailsClient />;
}
