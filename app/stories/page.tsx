// app/stories/page.tsx
import { Metadata } from "next";
import StoriesPageClient from "./StoriesPageClient";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Discover inspiring immigrant stories and voices of immigrant women, sharing experiences, resilience, and industry updates from around the world.",
  keywords: "immigrant stories, voices of immigrant women",
  openGraph: {
    title: "Immigrant Women Stories",
    description:
      "Discover inspiring immigrant stories and voices of immigrant women, sharing experiences, resilience, and industry updates from around the world.",
    url: "https://www.herimmigranttales.org/stories",
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
    title: "Stories | Her Immigrant Tales",
    description:
      "Discover inspiring immigrant stories and voices of immigrant women, sharing experiences, resilience, and industry updates from around the world.",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/stories",
  },
};

export default function StoriesPage() {
  return <StoriesPageClient />;
}
