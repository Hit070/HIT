"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { initialStories1 } from "@/lib/mockData"
import { useParams } from "next/navigation"

export default function ViewStoryPage() {
  const params = useParams<{ id: string }>()
  const storyId = params.id
  const story = initialStories1.find((s) => s.id === storyId)

  if (!story) {
    return <div>Story not found</div>
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/admin/stories" className="hover:text-[#bf5925]">
            Stories
          </Link>
          <span>&gt;</span>
          <span>Story Details</span>
        </nav>

        {/* Story Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/stories">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Stories
              </Button>
            </Link>
            <Link href={`/stories/${story.id}/edit`}>
              <Button className="bg-primary hover:bg-primary/90">Edit Story</Button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{story.title}</h1>

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
            <span className="text-gray-500">{story.dateCreated}</span>
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

        {/* Story Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{story.summary}</p>
        </div>

        {/* Story Content */}
        <article className="prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Story</h2>
            <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: story.content }} />
          </div>
        </article>
      </main>
    </div>
  )
}
