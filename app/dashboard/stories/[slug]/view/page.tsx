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

export default function ViewStoryPage() {
  const params = useParams<{ slug: string }>()
  const storySlug = params.slug
  const { stories, fetchStories } = useContentStore()
  const [loading, setLoading] = useState(true)
  const story = stories.find((b) => b.slug === storySlug)

  useEffect(() => {
    if (stories.length === 0) {
      fetchStories()
        .catch(() => {
          toast({
            title: "Failed to fetch stories",
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

  if (!story) {
    return <div>Story not found</div>
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/dashboard/stories" className="hover:text-[#bf5925]">
            Stories
          </Link>
          <span>&gt;</span>
          <span>Story Details</span>
        </nav>

        {/* Story Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/stories">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stories
              </Button>
            </Link>
            <Link href={`/dashboard/stories/${story.slug}/edit`}>
              <Button className="bg-primary hover:bg-primary/90">Edit Story</Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{story.title}</h1>
          {/* Story Summary */}
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold mb-4">Summary</h2> */}
            <p className="leading-relaxed">{story.summary}</p>
          </div>
          <div className="flex items-center gap-4 mb-8">
            <Badge
              variant={story.status === "published" ? "default" : "secondary"}
              className={
                story.status === "published"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-orange-100 text-orange-800 hover:bg-orange-100"
              }
            >
              {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
            </Badge>
            <span className="text-gray-500"> {new Date(story.dateCreated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</span>
            <span className="text-gray-500">Type: {story.type.charAt(0).toUpperCase() + story.type.slice(1)}</span>
          </div>

          {/* Hero Image */}
          {story.thumbnail && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <Image
                src={story.thumbnail || "/placeholder.svg"}
                alt={story.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Video Embed */}
          {story.type === "video" && story.videoUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <iframe src={story.videoUrl.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen title="frame" />
            </div>
          )}

          {/* Audio Player */}
          {story.type === "audio" && story.audioFile && (
            <div className="mb-8">
              <audio controls className="w-full">
                <source src={story.audioFile} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </header>

        {/* Story Content */}
        <article className="prose prose-lg max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono">
          <div
            className="mb-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.content.html || "" }}
          />
        </article>
      </main>
    </div>
  )
}
