"use client"

import { useState, useEffect } from "react"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useContentStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"
import { Blog } from "@/types"
import { useParams } from "next/navigation"

const MAX_DESC_LENGTH = 100

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

    // If category is not provided, return the first color
    if (!category) {
        return colors[0]
    }

    // Create a simple hash from the category string to get consistent colors
    let hash = 0
    for (let i = 0; i < category.length; i++) {
        const char = category.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }

    // Use absolute value to ensure positive index
    const index = Math.abs(hash) % colors.length
    return colors[index]
}

export default function BlogDetailsPage() {
    const params = useParams<{ slug: string }>()
    const blogSlug = params.slug
    const { blogs, fetchBlogs } = useContentStore()
    const [loading, setLoading] = useState<boolean>(true)
    const [blog, setBlog] = useState<Blog | null>(null)
    const [otherBlogs, setOtherBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const loadBlog = async () => {
            try {
                if (blogs.length === 0) {
                    await fetchBlogs()
                }
            } catch (error) {
                toast({
                    title: "Failed to fetch blogs",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        loadBlog()
    }, [blogs.length, fetchBlogs])

    useEffect(() => {
        if (blogs.length > 0) {
            // Find the current blog by slug
            const currentBlog = blogs.find((b: Blog) => b.slug === blogSlug)
            setBlog(currentBlog || null)

            // Get other published blogs (excluding current one)
            const others = blogs
                .filter((b: Blog) => b.slug !== blogSlug && b.status === "published")
                .slice(0, 3)
            setOtherBlogs(others)
        }
    }, [blogs, blogSlug])

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

    if (!blog) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
                    <Link
                        href="/blog"
                        className="text-[#bf5925] hover:underline"
                    >
                        ← Back to blogs
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const color = getCategoryColor(blog.category)

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link href="/blog" className="hover:text-[#bf5925]">
                        Blog
                    </Link>
                    <span>&gt;</span>
                    <span>Blog Details</span>
                </nav>

                {/* Blog Header */}
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span
                            className={`${color.text} ${color.border} ${color.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                        >
                            {blog.category || 'Uncategorized'}
                        </span>
                        <span className="text-gray-500"> {new Date(blog.dateCreated).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}</span>
                        <span className="text-gray-500">By {blog.author}</span>
                    </div>

                    {/* Summary */}
                    {blog.summary && (
                        <div className="py-6 rounded-xl mb-8">
                            <p className="text-lg text-gray-700 leading-relaxed italic">
                                {blog.summary}
                            </p>
                        </div>
                    )}

                    {/* Hero Image */}
                    {blog.thumbnail && (
                        <div className="aspect-[16/9] rounded-[50px] overflow-hidden mb-8">
                            <Image
                                src={blog.thumbnail}
                                alt={blog.title}
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </header>

                {/* Blog Content */}
                <article className="text-xl prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono">
                    <div
                        className="mb-8 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blog.content?.html || "" }}
                    />
                </article>

                {/* Media Content */}
                {blog.type === "video" && blog.videoUrl && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch Video</h2>
                        <div className="aspect-video rounded-xl overflow-hidden">
                            <iframe
                                src={blog.videoUrl}
                                className="w-full h-full"
                                allowFullScreen
                                title={blog.title}
                            />
                        </div>
                    </div>
                )}

                {blog.type === "audio" && blog.audioFile && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Listen to Audio</h2>
                        <audio
                            controls
                            className="w-full"
                            src={blog.audioFile}
                        />
                    </div>
                )}
            </main>

            {/* Read Other Blogs Section */}
            {otherBlogs.length > 0 && (
                <section className="bg-gray-50 py-16 px-6">
                    <div className="max-w-[1200px] mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Read Other Blogs</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {otherBlogs.map((otherBlog: Blog) => {
                                const isTruncated = otherBlog.summary && otherBlog.summary.length > MAX_DESC_LENGTH
                                const preview = isTruncated
                                    ? otherBlog.summary.slice(0, MAX_DESC_LENGTH) + "..."
                                    : (otherBlog.summary || '')

                                const otherColor = getCategoryColor(otherBlog.category)

                                return (
                                    <Link
                                        key={otherBlog.id}
                                        href={`/blog/${otherBlog.slug}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <Image
                                                    width={500}
                                                    height={375}
                                                    src={otherBlog.thumbnail || "/placeholder.svg"}
                                                    alt={otherBlog.title || 'Blog post'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            <div className="p-6 space-y-3">
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors line-clamp-2">
                                                    {otherBlog.title || 'Untitled'}
                                                </h3>

                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`${otherColor.text} ${otherColor.border} ${otherColor.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                                                    >
                                                        {otherBlog.category || 'Uncategorized'}
                                                    </span>
                                                    <span className="text-gray-500 text-sm"> {new Date(otherBlog.dateCreated).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}</span>
                                                </div>

                                                <p className="text-gray-700 leading-relaxed line-clamp-3">
                                                    {preview}
                                                </p>
                                                {isTruncated && (
                                                    <div className="mt-2">
                                                        <span className="text-[#bf5925] hover:underline text-sm font-medium">
                                                            Read more →
                                                        </span>
                                                    </div>
                                                )}
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