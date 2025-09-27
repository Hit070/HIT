"use client"

import { use } from "react"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { initialStories } from "@/lib/mockData"
import { ArrowUpRight } from "lucide-react"

const getCategoryColor = (id: number) => {
    const colors = [
        { text: "text-purple-600", border: "border-purple-600", bg: "bg-purple-100" },
        { text: "text-green-600", border: "border-green-600", bg: "bg-green-100" },
        { text: "text-blue-600", border: "border-blue-600", bg: "bg-blue-100" },
        { text: "text-yellow-600", border: "border-yellow-600", bg: "bg-yellow-100" },
        { text: "text-indigo-600", border: "border-indigo-600", bg: "bg-indigo-100" },
        { text: "text-emerald-600", border: "border-emerald-600", bg: "bg-emerald-100" },
        { text: "text-red-600", border: "border-red-600", bg: "bg-red-100" },
        { text: "text-pink-600", border: "border-pink-600", bg: "bg-pink-100" },
        { text: "text-teal-600", border: "border-teal-600", bg: "bg-teal-100" },
        { text: "text-orange-600", border: "border-orange-600", bg: "bg-orange-100" },
        { text: "text-cyan-600", border: "border-cyan-600", bg: "bg-cyan-100" },
    ]
    return colors[id % colors.length]
}

export default function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const story = initialStories.find((s) => s.id === Number.parseInt(id))

    if (!story) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="px-4 py-16 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Not Found</h1>
                    <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
                    <Link href="/stories" className="text-[#bf5925] hover:underline">
                        ← Back to Stories
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const color = getCategoryColor(story.id)
    const latestStories = initialStories.filter((s) => s.id !== story.id).slice(0, 3)

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <article className="px-4 py-16 max-w-[1440px] mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link href="/stories" className="text-gray-500 hover:text-[#bf5925]">
                        Stories
                    </Link>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="text-gray-900">Story Details</span>
                </nav>

                <div className="bg-gray-50 rounded-4xl py-12 px-6 md:px-36">
                    {/* Story Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{story.title}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <span
                                className={`${color.text} ${color.border} ${color.bg} border px-4 py-2 rounded-full text-sm font-medium`}
                            >
                                {story.category}
                            </span>
                            <span className="text-gray-500">{story.date}</span>
                        </div>

                        {/* Hero Image */}
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                            <Image
                                width={800}
                                height={450}
                                src={story.image || "/placeholder.svg"}
                                alt={story.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </header>

                    {/* Story Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">{story.content.introduction}</p>
                        </div>

                        {story.content.sections.map((section, index) => (
                            <div key={index} className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                                <p className="text-gray-700 leading-relaxed">{section.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </article>

            {/* Read Other Stories Section */}
            <section className="px-4 py-16">
                <div className="max-w-[1440px] mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Read Other Stories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestStories.map((otherStory) => {
                            const otherColor = getCategoryColor(otherStory.id)
                            return (
                                <Link
                                    key={otherStory.id}
                                    href={`/stories/${otherStory.id}`}
                                    className="group cursor-pointer block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    <div className="p-4 rounded-4xl overflow-hidden">
                                        <Image
                                            width={400}
                                            height={300}
                                            src={otherStory.image || "/placeholder.svg"}
                                            alt={otherStory.title}
                                            className="w-full h-full rounded-4xl object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors">
                                            {otherStory.title}
                                        </h3>

                                        <p className="text-sm text-gray-700 leading-relaxed">{otherStory.description.slice(0, 100)}...</p>

                                        <div className="flex justify-between items-center pt-4">
                                            <span className="text-gray-500 text-sm">{otherStory.date}</span>
                                            <div className="ml-auto p-2 bg-gray-100 rounded-full">
                                                <ArrowUpRight className="w-5 h-5 text-black group-hover:text-[#bf5925] transition-colors" />
                                            </div>                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
