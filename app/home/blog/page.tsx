"use client"

import { useState } from "react"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import { CircleArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { initialBlogs, additionalBlogs } from "@/lib/mockData"

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

export default function BlogPage() {
    const [visibleBlogs, setVisibleBlogs] = useState(initialBlogs)
    const [hasLoadedMore, setHasLoadedMore] = useState(false)

    const featuredBlog = initialBlogs.find((b) => b.isFeaturedBlog)
    const otherBlogs = initialBlogs.filter((b) => !b.isFeaturedBlog)

    const featuredColor = featuredBlog ? getCategoryColor(featuredBlog.id) : getCategoryColor(0)

    const handleLoadMore = () => {
        setVisibleBlogs([...visibleBlogs, ...additionalBlogs])
        setHasLoadedMore(true)
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            {featuredBlog && (
                <section className="px-4 py-16 max-w-[1440px] mx-auto">
                    <Link href={`/blog/${featuredBlog.id}`}>
                        <div
                            className="relative rounded-[50px] overflow-hidden h-[700px] bg-cover bg-center"
                            style={{ backgroundImage: `url(${featuredBlog.image})` }}
                        >
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-black/20"></div>

                            {/* Content */}
                            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                                <div className="flex flex-col md:flex-row justify-between items-end w-full">
                                    {/* Left side content */}
                                    <div className="flex-1 mb-4 md:mb-0">
                                        {/* Featured Blog label */}
                                        <div className="inline-block mb-4">
                                            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Featured Blog
                                            </span>
                                        </div>

                                        {/* Main content */}
                                        <div className="max-w-2xl">
                                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                                {featuredBlog.title}
                                            </h1>

                                            {/* Tags and date */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <span
                                                    className={`${featuredColor.text} ${featuredColor.border} ${featuredColor.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                                                >
                                                    {featuredBlog.category}
                                                </span>
                                                <span className="text-white/80 text-sm">{featuredBlog.date}</span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-white/90 text-lg leading-relaxed mb-6">
                                                {featuredBlog.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right side - Arrow button */}
                                    <div className="flex-1 flex justify-center md:justify-end">
                                        <CircleArrowRight className="w-12 h-12 md:w-24 md:h-24 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            <section className="px-4 py-16 max-w-[1440px] mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-12">
                    Recent Blogs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {otherBlogs.map((blog) => {
                        const isTruncated = blog.description.length > MAX_DESC_LENGTH
                        const preview = isTruncated
                            ? blog.description.slice(0, MAX_DESC_LENGTH) + "..."
                            : blog.description

                        const color = getCategoryColor(blog.id)

                        return (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.id}`}
                                className="group cursor-pointer block"
                            >
                                <div className="rounded-2xl transition-shadow duration-300 overflow-hidden h-full">

                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            width={500}
                                            height={375}
                                            src={blog.image || "/placeholder.svg"}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl line-clamp-1 font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors">
                                            {blog.title}
                                        </h3>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`${color.text} ${color.border} ${color.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                                            >
                                                {blog.category}
                                            </span>

                                            <span className="text-gray-500 text-sm">{blog.date}</span>
                                        </div>

                                        <p className="text-md text-gray-700 leading-relaxed">
                                            {preview}
                                        </p>
                                        {isTruncated && (
                                            <div className="mt-1">
                                                <span className="text-blue-600 hover:underline text-sm">
                                                    See more
                                                </span>
                                            </div>
                                        )}
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
            </section>

            <Footer />
        </div>
    )
}
