// app/community/page.tsx
import { Metadata } from "next";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  title: "Global Community",
  description:
    "Join our global community of immigrant women sharing stories, building connections, and inspiring change across cultures and borders.",
  keywords:
    "global community, immigrant women",
  openGraph: {
    title: "Global Community | Her Immigrant Tales",
    description:
      "Join our global community of immigrant women sharing stories, building connections, and inspiring change across cultures and borders.",
    url: "https://www.herimmigranttales.org/community",
    images: [
      {
        url: "/logo1.svg",
        width: 1200,
        height: 630,
        alt: "Her Immigrant Tales",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Community | Her Immigrant Tales",
    description:
      "Join our global community of immigrant women sharing stories, building connections, and inspiring change across cultures and borders.",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/community",
  },
};

export default function CommunityPage() {
  return <CommunityClient />;
}
