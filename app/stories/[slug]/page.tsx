"use client"

import { useState, useEffect } from "react"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useContentStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"
import { Story } from "@/types"
import { ArrowUpRight } from "lucide-react"
import { useParams } from "next/navigation"

const getCategoryColor = (category: string) => {
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

    if (!category) {
        return colors[0]
    }

    let hash = 0
    for (let i = 0; i < category.length; i++) {
        const char = category.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }

    const index = Math.abs(hash) % colors.length
    return colors[index]
}

export default function StoryDetailPage() {
    const params = useParams<{ slug: string }>()
    const storySlug = params.slug
    const { stories, fetchStories } = useContentStore()
    const [loading, setLoading] = useState<boolean>(true)
    const [story, setStory] = useState<Story | null>(null)
    const [otherStories, setOtherStories] = useState<Story[]>([])

    useEffect(() => {
        const loadStory = async () => {
            try {
                if (stories.length === 0) {
                    await fetchStories()
                }
            } catch (error) {
                toast({
                    title: "Failed to fetch stories",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        loadStory()
    }, [])

    useEffect(() => {
        if (stories.length > 0 && storySlug) {
            // Find the current story by slug
            const currentStory = stories.find((s: Story) => s.slug === storySlug)
            setStory(currentStory || null)

            // Get other published stories (excluding current one)
            const others = stories
                .filter((s: Story) => s.slug !== storySlug && s.status === "published")
                .slice(0, 3)
            setOtherStories(others)
        }
    }, [stories, storySlug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-gray-500">Loading...</div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="px-4 py-16 max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Story Not Found</h1>
                    <p className="text-gray-600 mb-8">The story you're looking for doesn't exist.</p>
                    <Link href="/stories" className="text-[#bf5925] hover:underline">
                        ← Back to Stories
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

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

                <div className="rounded-[50px] bg-gray-50 py-12 px-6 md:px-36">
                    {/* Story Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {story.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-gray-500"> {new Date(story.dateCreated).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}</span>
                            <span className="text-gray-500">By {story.author}</span>
                        </div>

                        {/* Summary */}
                        {story.summary && (
                            <div className="py-6 rounded-xl mb-8">
                                <p className="text-lg text-gray-700 leading-relaxed italic">
                                    {story.summary}
                                </p>
                            </div>
                        )}

                        {/* Hero Image */}
                        {story.thumbnail && (
                            <div className="aspect-[16/9] rounded-[50px] overflow-hidden mb-8">
                                <Image
                                    width={800}
                                    height={450}
                                    src={story.thumbnail}
                                    alt={story.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </header>

                    {/* Story Content */}
                    <article className="text-xl prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono">
                        <div
                            className="mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: story.content?.html || "" }}
                        />
                    </article>

                    {/* Media Content */}
                    {story.type === "video" && story.videoUrl && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch Video</h2>
                            <div className="aspect-video rounded-xl overflow-hidden">
                                <iframe
                                    src={story.videoUrl}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={story.title}
                                />
                            </div>
                        </div>
                    )}

                    {story.type === "audio" && story.audioFile && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listen to Audio</h2>
                            <audio
                                controls
                                className="w-full"
                                src={story.audioFile}
                            />
                        </div>
                    )}
                </div>
            </article>

            {/* Read Other Stories Section */}
            {otherStories.length > 0 && (
                <section className="px-4 py-16">
                    <div className="max-w-[1440px] mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12">Read Other Stories</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {otherStories.map((otherStory: Story) => {
                                const preview = otherStory.summary && otherStory.summary.length > 100
                                    ? otherStory.summary.slice(0, 100) + "..."
                                    : (otherStory.summary || '')

                                return (
                                    <Link
                                        key={otherStory.id}
                                        href={`/stories/${otherStory.slug}`}
                                        className="group cursor-pointer block bg-white rounded-3xl hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
                                        style={{
                                            boxShadow: '0 0 60px 20px rgba(0, 0, 0, 0.08)'
                                        }}
                                    >
                                        <div className="p-4 rounded-3xl overflow-hidden">
                                            <Image
                                                width={400}
                                                height={300}
                                                src={otherStory.thumbnail || "/placeholder.svg"}
                                                alt={otherStory.title || 'Story'}
                                                className="w-full h-full rounded-3xl object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors line-clamp-2">
                                                {otherStory.title || 'Untitled'}
                                            </h3>

                                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                                {preview}
                                            </p>

                                            <div className="flex justify-between items-center pt-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-500 text-sm"> {new Date(otherStory.dateCreated).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}</span>
                                                    <span className="text-gray-400 text-xs">By {otherStory.author}</span>
                                                </div>
                                                <div className="ml-auto p-2 bg-gray-100 rounded-full">
                                                    <ArrowUpRight className="w-5 h-5 text-black group-hover:text-[#bf5925] transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    )
}