"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useContentStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"

const getCategoryColor = (slug: string) => {
  const colors = [
    { text: "text-purple-600", border: "border-purple-600", bg: "bg-purple-100" },
    { text: "text-green-600", border: "border-green-600", bg: "bg-green-100" },
    { text: "text-blue-600", border: "border-blue-600", bg: "bg-blue-100" },
    { text: "text-yellow-600", border: "border-yellow-600", bg: "bg-yellow-100" },
    { text: "text-indigo-600", border: "border-indigo-600", bg: "bg-indigo-100" },
  ]
  const numericId = Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return colors[numericId % colors.length]
}

export default function ViewBlogPage() {
  const params = useParams<{ slug: string }>()
  const blogSlug = params.slug
  const { blogs, fetchBlogs } = useContentStore()
  const [loading, setLoading] = useState(true)
  const blog = blogs.find((b) => b.slug === blogSlug)

  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs()
        .catch(() => {
          toast({
            title: "Failed to fetch blogs",
            variant: "destructive",
          })
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  const color = getCategoryColor(blog.slug)

  return (
    <div className="min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/dashboard/blogs" className="hover:text-[#bf5925]">
            Blogs
          </Link>
          <span>&gt;</span>
          <span>Blog Details</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/blogs">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
            <Link href={`/dashboard/blogs/${blog.slug}/edit`}>
              <Button className="bg-primary hover:bg-primary/90">Edit Blog</Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>
          {/* Blog Summary */}
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold mb-4">Summary</h2> */}
            <p className="leading-relaxed">{blog.summary}</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Badge
              variant={blog.status === "published" ? "default" : "secondary"}
              className={
                blog.status === "published"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-orange-100 text-orange-800 hover:bg-orange-100"
              }
            >
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </Badge>
            <span
              className={`${color.text} ${color.border} ${color.bg} border px-3 py-1 rounded-full text-sm font-medium`}
            >
              {blog.category}
            </span>
            <span> {new Date(blog.dateCreated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</span>
          </div>

          {blog.thumbnail && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {blog.type === "video" && blog.videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <iframe
                src={blog.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allowFullScreen
                title="video-embed"
              />
            </div>
          )}

          {blog.type === "audio" && blog.audioFile && (
            <div className="mb-8">
              <audio controls className="w-full">
                <source src={blog.audioFile} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </header>

        <article className="prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono">
          <div
            className="mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content.html || "" }}
          />
        </article>
      </main>
    </div>
  )
}