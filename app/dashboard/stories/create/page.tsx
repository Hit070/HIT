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
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useContentStore, useAuthStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"
import { Story } from "@/types"
import { useRouter } from "next/navigation"

export default function CreateStoryPage() {
  const router = useRouter()
  const { addStory } = useContentStore()
  const { user } = useAuthStore()
  const [storyType, setStoryType] = useState<"text" | "video" | "audio">("text")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoPreview, setVideoPreview] = useState("")
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState<Record<string, any>>({})
  const [author, setAuthor] = useState(user?.name || "")
  const [thumbnail, setThumbnail] = useState("")
  const [audioFile, setAudioFile] = useState("")
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
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

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG or JPG).",
        variant: "destructive",
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }
    setIsUploadingThumbnail(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload/stories", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Upload failed")
      const { url } = await response.json()
      setThumbnail(url)
      toast({ title: "Thumbnail uploaded", description: "Upload successful." })
    } catch (error) {
      console.error("[UPLOAD_THUMBNAIL]", error)
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file (MP3, WAV).",
        variant: "destructive",
      })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an audio file smaller than 10MB.",
        variant: "destructive",
      })
      return
    }
    setIsUploadingAudio(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload/stories", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Upload failed")
      const { url } = await response.json()
      setAudioFile(url)
      toast({ title: "Audio uploaded", description: "Upload successful." })
    } catch (error) {
      console.error("[UPLOAD_AUDIO]", error)
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsUploadingAudio(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleSubmit = async (status: "published" | "draft") => {
    if (!user) {
      toast({ title: "Please log in to create a story", variant: "destructive" })
      return
    }
    if (!title || !summary || Object.keys(content).length === 0) {
      toast({ title: "Please fill in all required fields", variant: "destructive" })
      return
    }
    const setLoading = status === "draft" ? setIsSavingDraft : setIsPublishing
    setLoading(true)
    try {
      const story: Omit<Story, "id" | "dateCreated" | "lastUpdated" | "isFeatured"> = {
        title,
        author,
        summary,
        content,
        type: storyType,
        videoUrl: storyType === "video" ? videoUrl : undefined,
        audioFile: storyType === "audio" ? audioFile : undefined,
        thumbnail: thumbnail || undefined,
        status,
        slug: generateSlug(title),
      }
      await addStory(story)
      toast({ title: `Story ${status === "published" ? "published" : "saved as draft"} successfully`, variant: "default" })
      router.push("/dashboard/stories")
    } catch (error) {
      console.error("[CREATE_STORY]", error)
      toast({ title: "Failed to create story", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="md:px-20 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/stories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Create Story</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Story Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title"
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            className="text-base"
            disabled={isUploadingAudio || isSavingDraft || isPublishing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Story Summary/Abstract</Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter story summary"
            className="min-h-[100px] text-base"
            disabled={isUploadingAudio || isSavingDraft || isPublishing}
          />
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
                  disabled={isUploadingThumbnail || isSavingDraft || isPublishing}
                >
                  {isUploadingThumbnail ? "Uploading..." : "Browse Files"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  title="thumbnail"
                  onChange={handleThumbnailChange}
                />
              </div>
              {thumbnail && (
                <img src={thumbnail} alt="Thumbnail preview" className="mt-4 h-24 w-24 object-cover rounded" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="story-type">Story Type</Label>
          <Select
            value={storyType}
            onValueChange={(value: string) => setStoryType(value as "text" | "video" | "audio")}
            disabled={isUploadingAudio || isSavingDraft || isPublishing}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {storyType === "video" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Enter YouTube or Vimeo URL"
                className="text-base"
                disabled={isUploadingAudio || isSavingDraft || isPublishing}
              />
            </div>
            {videoPreview && (
              <div className="space-y-2">
                <Label>Video Preview</Label>
                <div className="aspect-video rounded-lg overflow-hidden border">
                  <iframe
                    title="video-preview"
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

        {storyType === "audio" && (
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
                    disabled={isUploadingAudio || isSavingDraft || isPublishing}
                  >
                    {isUploadingAudio ? "Uploading..." : "Browse Files"}
                  </Button>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    title="audio"
                    onChange={handleAudioChange}
                  />
                </div>
                {audioFile && (
                  <audio controls src={audioFile} className="mt-4 w-full max-w-md">
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Label>Story Content</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your story content here..."
            disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSubmit("draft")}
            disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
          >
            {isSavingDraft ? "Saving..." : "Save as draft"}
          </Button>
          <Button
            size="lg"
            className="bg-app-primary hover:bg-primary/90"
            onClick={() => handleSubmit("published")}
            disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
