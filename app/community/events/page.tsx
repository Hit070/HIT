// app/events/page.tsx
import { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming events hosted by Her Immigrant Tales. Connect, collaborate, and grow together in a space built on trust, truth, and shared humanity.",
  keywords: "events, community events, immigrant women events, networking",
  openGraph: {
    title: "Events",
    description:
      "Discover upcoming events hosted by Her Immigrant Tales. Connect, collaborate, and grow together.",
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
    siteName: "Her Immigrant Tales",
  },
  twitter: {
    card: "summary_large_image",
    title: "Events",
    description: "Discover upcoming events hosted by Her Immigrant Tales",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/events",
  },
};

// Helper to fetch events server-side
async function getEvents() {
  try {
    const res = await fetch("https://www.herimmigranttales.org/api/events", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const allEvents = await res.json();
    return Array.isArray(allEvents)
      ? allEvents.filter((e: any) => e.status === "active")
      : [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Generate structured data
function generateStructuredData(events: any[]) {
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
        name: "Community",
        item: "https://www.herimmigranttales.org/community",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Events",
        item: "https://www.herimmigranttales.org/events",
      },
    ],
  };

  // If there are events, add EventSeries schema
  if (events.length > 0) {
    const eventSchemas = events.map((event) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      description: event.description,
      startDate: event.date,
      location: {
        "@type": "Place",
        name: event.location,
      },
      image: event.image,
      organizer: {
        "@type": "Organization",
        name: "Her Immigrant Tales",
        url: "https://www.herimmigranttales.org",
      },
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    }));

    return [breadcrumbSchema, ...eventSchemas];
  }

  return [breadcrumbSchema];
}

// Server Component
export default async function EventsPage() {
  // Fetch events server-side
  const serverEvents = await getEvents();

  // Generate structured data
  const structuredData = generateStructuredData(serverEvents);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Pass server data to client component */}
      <EventsClient serverEvents={serverEvents} />
    </>
  );
}
