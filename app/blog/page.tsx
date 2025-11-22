// app/blog/page.tsx
import { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Her Immigrant Tales blog shares inspiring stories and industry updates, highlighting immigrant women's journeys, empowerment, and community growth.",
  keywords: "blog, industry update",
  openGraph: {
    title: "Blog",
    description:
      "Her Immigrant Tales blog shares inspiring stories and industry updates, highlighting immigrant women's journeys, empowerment, and community growth.",
    url: "https://www.herimmigranttales.org/blog",
    images: [
      {
        url: "/logo1.svg",
        width: 1200,
        height: 630,
        alt: "Her Immigrant Tales",
      },
    ],
    type: "website",
    siteName: "Her Immigrant Tales",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Her Immigrant Tales",
    description:
      "Her Immigrant Tales blog shares inspiring stories and industry updates, highlighting immigrant women's journeys, empowerment, and community growth.",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/blog",
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
