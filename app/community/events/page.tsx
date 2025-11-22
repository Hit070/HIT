// app/contact/page.tsx
import { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming events hosted by Her Immigrant Tales",
  keywords: "events",
  openGraph: {
    title: "Events | Her Immigrant Tales",
    description: "Discover upcoming events hosted by Her Immigrant Tales",
    url: "https://www.herimmigranttales.org/events",
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
    title: "Events | Her Immigrant Tales",
    description: "Discover upcoming events hosted by Her Immigrant Tales",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/events",
  },
};

export default function EventsPage() {
  return <EventsClient />;
}
