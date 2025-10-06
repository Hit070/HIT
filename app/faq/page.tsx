"use client"

import Footer from "@/components/footer"
import Header from "@/components/headeruser"
import Image from "next/image"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0)

    const faqs = [
        {
            question: "What is Her Immigrant Tales (HIT)",
            answer:
                "HIT is a storytelling platform and community that celebrates immigrant women by sharing their journeys, amplifying their voices, and fostering belonging.",
        },
        {
            question: "How can I share my story with HIT?",
            answer:
                "You can share your story by submitting it through our website's story submission form, or by reaching out to us directly through our contact page.",
        },
        {
            question: "Do I have to pay to be part of the HIT community?",
            answer:
                "No, joining the HIT community is completely free. We believe in making our platform accessible to all immigrant women.",
        },
        {
            question: "Can I collaborate or volunteer with HIT?",
            answer:
                "Yes! We welcome volunteers and collaborators. You can help with events, content creation, community outreach, and more.",
        },
        {
            question: "Is HIT a nonprofit?",
            answer:
                "Yes, HIT operates as a nonprofit organization dedicated to supporting and empowering immigrant women through storytelling.",
        },
        {
            question: "What type of stories do you publish?",
            answer:
                "We publish authentic stories from immigrant women about their journeys, challenges, triumphs, and experiences in their new homelands.",
        },
        {
            question: "Do you host events?",
            answer:
                "Yes, we regularly host workshops, panels, and community meetups both virtually and in-person to bring immigrant women together.",
        },
        {
            question: "How can I support HIT financially?",
            answer:
                "You can support us through donations, sponsoring events, or partnering with us on initiatives that empower immigrant women.",
        },
    ]

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="text-center relative h-[400px]">
                <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden">
                    <Image src="/eventsbg.png" alt="Background frame" fill className="object-cover object-center" />
                </div>

                <div className="relative z-20 max-w-2xl mx-auto pt-24">
                    <h1 className="text-5xl md:text-6xl font-cormorant text-[#353336] mb-6 leading-tight">
                        Your Questions, <span className="text-[#bf5925] italic">Answered</span>
                    </h1>
                    <p className="text-lg text-[#353336] mb-8 md:max-w-2xl md:px-0 px-6 mx-auto leading-relaxed">
                        Clear guidance for immigrant women and supporters of HIT — all in one place. If you still can't find what
                        you need, we're just a message away.
                    </p>
                </div>
            </div>

            <div className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[#bf5925] text-lg font-medium mb-4">Frequently Asked Questions</h2>
                        <h3 className="text-4xl md:text-5xl font-cormorant text-[#353336] leading-tight">
                            Got Any Questions?
                            <br />
                            We've Got Answers
                        </h3>
                    </div>

                    <div className="space-y-6 md:px-0 px-2">
                        {faqs.map((faq, index) => {
                            const isOpen = openFAQ === index;
                            return (
                                <div
                                    key={index}
                                    className={`transition-colors rounded-lg ${isOpen ? "bg-gray-50" : ""}`}
                                >
                                    {/* Question */}
                                    <button
                                        className={`w-full cursor-pointer flex justify-between items-center text-left ${isOpen ? "px-6 py-6" : "px-0 py-0"}`}
                                        onClick={() => setOpenFAQ(isOpen ? null : index)}
                                    >
                                        <span className="text-lg font-medium text-[#353336] pr-4">
                                            {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <Minus className="w-6 h-6 text-[#353336] flex-shrink-0" />
                                        ) : (
                                            <Plus className="w-6 h-6 text-[#353336] flex-shrink-0" />
                                        )}
                                    </button>

                                    {/* Answer */}
                                    <div
                                        className="overflow-hidden transition-all duration-300 ease-in-out"
                                        style={{ maxHeight: isOpen ? '500px' : '0' }}
                                    >
                                        <div className="px-6 pb-6">
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}
