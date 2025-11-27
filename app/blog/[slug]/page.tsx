// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import BlogDetailsClient from "./BlogDetailsClient";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to fetch blog data
async function getBlogData(slug: string) {
  try {
    const res = await fetch(`https://herimmigranttales.org/api/blogs/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Helper to fetch other blogs
async function getOtherBlogs(currentSlug: string) {
  try {
    const res = await fetch(`https://herimmigranttales.org/api/blogs`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const blogs = await res.json();
    return blogs
      .filter((b: any) => b.slug !== currentSlug && b.status === "published")
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching other blogs:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: {
        absolute: "Blog Post",
      },
      description:
        "Read inspiring stories from immigrant women around the world.",
      openGraph: {
        title: "Blog Post",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["https://herimmigranttales.org/logo1.svg"],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog Post",
        description:
          "Read inspiring stories from immigrant women around the world.",
        images: ["https://herimmigranttales.org/logo1.svg"],
      },
    };
  }

  return {
    title: {
      absolute: blog.metaTitle || blog.title || "Blog Post",
    },
    description:
      blog.metaDescription ||
      blog.summary ||
      "Read inspiring stories from immigrant women",
    keywords: blog.primaryKeyword || blog.category,
    authors: [{ name: blog.author, url: "https://herimmigranttales.org" }],
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.summary,
      images: [
        {
          url:
            blog.metaImage ||
            blog.thumbnail ||
            "https://herimmigranttales.org/logo1.svg",
          width: 1200,
          height: 630,
          alt: blog.metaTitle || blog.title || "Her Immigrant Tales",
        },
      ],
      type: "article",
      url: `https://herimmigranttales.org/blog/${blog.slug}`,
      siteName: "Her Immigrant Tales",
      publishedTime: blog.dateCreated,
      modifiedTime: blog.lastUpdated || blog.dateCreated,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.summary,
      images: [
        blog.metaImage ||
          blog.thumbnail ||
          "https://herimmigranttales.org/logo1.svg",
      ],
      creator: blog.author,
    },
    alternates: {
      canonical: `https://herimmigranttales.org/blog/${blog.slug}`,
    },
  };
}

// Server Component - crawlers see this
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  // Fetch data server-side for SEO
  const blog = await getBlogData(slug);
  const otherBlogs = await getOtherBlogs(slug);

  if (!blog) {
    return <BlogDetailsClient blog={null} otherBlogs={[]} />;
  }

  // Do not emit JSON-LD here; rely on `generateMetadata` for meta tags.
  return <BlogDetailsClient blog={blog} otherBlogs={otherBlogs} />;
}
