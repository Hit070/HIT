// app/page.tsx
import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover powerful stories, connect with a vibrant community, and help us honor the voices of immigrant women everywhere.",
  keywords: "immigrant women, immigrant women health",
  openGraph: {
    title: "Her Immigrant Tales | Immigrant Women Stories",
    description:
      "Discover powerful stories, connect with a vibrant community, and help us honor the voices of immigrant women everywhere.",
    url: "https://www.herimmigranttales.org/home",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Her Immigrant Tales",
      },
      {
        url: "/logo1.svg",
        width: 1200,
        height: 630,
        alt: "Her Immigrant Tales",
      },
    ],
  },
  twitter: {
    title: "Her Immigrant Tales | Immigrant Women Stories",
    description:
      "Discover powerful stories, connect with a vibrant community, and help us honor the voices of immigrant women everywhere.",
    images: ["/favicon.png"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/home",
  },
};

async function getStoriesData() {
  try {
    const res = await fetch("https://www.herimmigranttales.org/api/stories", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("[GET_STORIES]", err);
    return [];
  }
}

export default async function HomePage() {
  const serverStories = await getStoriesData();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.herimmigranttales.org/home",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomePageClient serverStories={serverStories} />
    </>
  );
}
