"use client"

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { blogCategories } from "@/lib/mockData"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function CreateBlogPage() {
  const [blogType, setBlogType] = useState("Text")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoPreview, setVideoPreview] = useState("")
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)

    // Generate preview for common video platforms
    let embedUrl = ""
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0]
      embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split("?")[0]
      embedUrl = `https://player.vimeo.com/video/${videoId}`
    }

    setVideoPreview(embedUrl)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleAudioUpload = () => {
    audioInputRef.current?.click()
  }

  return (
    <div className="md:px-20 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Create Blog</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Blog Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Blog Summary/Abstract</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter blog summary"
            className="min-h-[100px] text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Upload Thumbnail</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/10">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Upload your files. PNG or JPG format, we recommend 1200x630 px.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFileUpload}
                  className="bg-app-primary text-primary-foreground hover:bg-primary/90"
                >
                  Browse Files
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" title="file" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-type">Blog Type</Label>
          <Select value={blogType} onValueChange={setBlogType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {blogType === "Video" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Enter YouTube, Vimeo, or other video URL"
                className="text-base"
              />
            </div>
            {videoPreview && (
              <div className="space-y-2">
                <Label>Video Preview</Label>
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    title="frame"
                    src={videoPreview}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {blogType === "Audio" && (
          <div className="space-y-4">
            <Label>Upload Audio</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center bg-muted/10">
              <div className="flex flex-col items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Upload audio file (MP3, WAV, etc.)</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAudioUpload}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Files
                  </Button>
                  <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" title="frame" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label className="text-sm font-medium mb-2 block">Blog Content</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <Button variant="outline" size="lg">
            Save as draft
          </Button>
          <Button size="lg" className="bg-app-primary hover:bg-primary/90">
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
