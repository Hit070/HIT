"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { initialBlogs1 } from "@/lib/mockData"
import { useParams } from "next/navigation"

const getCategoryColor = (id: string) => {
  const colors = [
    { text: "text-purple-600", border: "border-purple-600", bg: "bg-purple-100" },
    { text: "text-green-600", border: "border-green-600", bg: "bg-green-100" },
    { text: "text-blue-600", border: "border-blue-600", bg: "bg-blue-100" },
    { text: "text-yellow-600", border: "border-yellow-600", bg: "bg-yellow-100" },
    { text: "text-indigo-600", border: "border-indigo-600", bg: "bg-indigo-100" },
  ]

  // Convert string ID to number using hash function
  const numericId = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return colors[numericId % colors.length]
}

export default function ViewBlogPage() {
  const params = useParams<{ id: string }>()
  const blogId = params.id
  const blog = initialBlogs1.find((b) => b.id === blogId)

  if (!blog) {
    return <div>Blog not found</div>
  }

  // const otherBlogs = initialBlogs1.filter((b) => b.id !== blogId).slice(0, 3)
  const color = getCategoryColor(blog.id)

  return (
    <div className="min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/admin/blogs" className="hover:text-[#bf5925]">
            Blogs
          </Link>
          <span>&gt;</span>
          <span>Blog Details</span>
        </nav>

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/blogs">
              <Button variant="ghost" size="sm" className=" hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
            <Link href={`/blogs/${blog.id}/edit`}>
              <Button className="bg-primary hover:bg-primary/90">Edit Blog</Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>

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
            <span>{blog.date}</span>
          </div>

          {/* Hero Image */}
          {blog.thumbnail && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src={blog.thumbnail || "/placeholder.svg"}
                alt={blog.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Video Embed */}
          {blog.type === "video" && blog.videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <iframe src={blog.videoUrl.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen title="embed" />
            </div>
          )}

          {/* Audio Player */}
          {blog.type === "audio" && blog.audioFile && (
            <div className="mb-8">
              <audio controls className="w-full">
                <source src={blog.audioFile} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </header>

        {/* Blog Content */}
        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="leading-relaxed">{blog.content?.introduction}</p>
          </div>

          {blog.content?.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <p className="leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Closing Thoughts</h2>
            <p className="leading-relaxed">{blog.content?.closingThoughts}</p>
          </div>
        </article>
      </main>

      {/* Read Other Blogs Section */}
      {/* <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-[1536px] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Read Other Blogs</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherBlogs.map((blog) => {
              const color = getCategoryColor(blog.id)

              return (
                <Link key={blog.id} href={`/admin/blogs/${blog.id}/view`} className="group cursor-pointer block">
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
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors">
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

                    <p className="text-md text-gray-700 leading-relaxed">{blog.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section> */}
    </div>
  )
}
