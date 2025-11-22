// app/contact/page.tsx
import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Her Immigrant Tales to share your story, ask questions, or collaborate. We’d love to connect and support you.",
  keywords: "contact",
  openGraph: {
    title: "Contact Us | Her Immigrant Tales",
    description:
      "Contact Her Immigrant Tales to share your story, ask questions, or collaborate. We’d love to connect and support you.",
    url: "https://www.herimmigranttales.org/contact",
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
    title: "Contact Us | Her Immigrant Tales",
    description:
      "Contact Her Immigrant Tales to share your story, ask questions, or collaborate. We’d love to connect and support you.",
    images: ["/logo1.svg"],
  },
  alternates: {
    canonical: "https://www.herimmigranttales.org/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
