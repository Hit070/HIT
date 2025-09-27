"use client"

import { useState } from "react"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { initialStories, additionalStories } from "@/lib/mockData"

const MAX_DESC_LENGTH = 100

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

export default function StoriesPage() {
    const [visibleStories, setVisibleStories] = useState(initialStories)
    const [hasLoadedMore, setHasLoadedMore] = useState(false)

    const featuredStory = initialStories.find((s) => s.isFeaturedStory)
    const otherStories = initialStories.filter((s) => !s.isFeaturedStory)

    const handleLoadMore = () => {
        setVisibleStories([...visibleStories, ...additionalStories])
        setHasLoadedMore(true)
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section with Text */}
            <section className="px-4 py-16 max-w-[1440px] mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-cormorant text-[#353336] mb-6 leading-tight">
                    Discover the Voices of  <br /> <span className="text-[#bf5925] italic">Immigrant Women </span>
                    Worldwide
                </h1>
                <p className="text-lg text-[#353336] mb-8 max-w-2xl mx-auto leading-relaxed">
                    Every journey is different, shaped by unique challenges and triumphs, but every story holds power, purpose,
                    and the ability to inspire change.
                </p>
            </section>

            {/* Featured Story Section */}
            {featuredStory && (
                <section className="bg-black px-4 py-16">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left side - Image */}
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    width={600}
                                    height={450}
                                    src={featuredStory.image || "/placeholder.svg"}
                                    alt={featuredStory.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Right side - Content */}
                            <div className="text-white">
                                <div className="inline-block mb-4">
                                    <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Featured Story
                                    </span>
                                </div>

                                <h2 className="text-4xl font-bold mb-4 leading-tight">{featuredStory.title}</h2>

                                <p className="text-gray-300 mb-4">by {featuredStory.author}</p>

                                <p className="text-white/90 text-lg leading-relaxed mb-8">{featuredStory.description}</p>

                                <Link href={`/stories/${featuredStory.id}`}>
                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-full font-medium inline-flex items-center gap-2">
                                        Read full story
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Stories Section */}
            <section className="px-4 py-16 mx-auto bg-gray-100">
                <div className="max-w-[1440px] mx-auto">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12">Recent Stories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {otherStories.map((story) => {
                            const isTruncated = story.description.length > MAX_DESC_LENGTH
                            const preview = isTruncated ? story.description.slice(0, MAX_DESC_LENGTH) + "..." : story.description

                            const color = getCategoryColor(story.id)

                            return (
                                <Link key={story.id} href={`/stories/${story.id}`} className="group cursor-pointer block">
                                    <div className="bg-white rounded-4xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        <div className="p-4 rounded-4xl overflow-hidden">
                                            <Image
                                                width={500}
                                                height={375}
                                                src={story.image || "/placeholder.svg"}
                                                alt={story.title}
                                                className="w-full h-full rounded-4xl object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <h3 className="text-xl line-clamp-1 font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors">
                                                {story.title}
                                            </h3>

                                            <p className="text-sm text-gray-700 leading-relaxed">{preview} {isTruncated && <span className="text-blue-600 hover:underline text-sm">See more</span>}
                                            </p>

                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm">{story.date}</span>
                                            </div>

                                            <div className="flex justify-between items-center pt-2">
                                                <div className="ml-auto p-2 bg-gray-100 rounded-full">
                                                    <ArrowUpRight className="w-5 h-5 text-black group-hover:text-[#bf5925] transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    {!hasLoadedMore && (
                        <div className="text-center">
                            <Button
                                onClick={handleLoadMore}
                                className="bg-[#bf5925] text-white px-8 py-3 rounded-full font-medium hover:bg-[#a04920] transition-colors"
                            >
                                Load More
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}
