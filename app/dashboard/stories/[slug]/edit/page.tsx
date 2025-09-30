"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContentStore, useAuthStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Story } from "@/types"

export default function EditStoryPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const storySlug = params.slug

  const { stories, fetchStories, updateStory } = useContentStore()

  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: { html: "" } as Record<string, any>,
    type: "text" as "text" | "video" | "audio",
    videoUrl: "",
    videoPreview: "",
    audioFile: "",
    thumbnail: "",
  })
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (stories.length === 0) {
      fetchStories()
        .then(() => {
          const story = stories.find((s: Story) => s.slug === storySlug)
          if (story) {
            setFormData({
              title: story.title,
              slug: story.slug,
              summary: story.summary,
              content: story.content,
              type: story.type,
              videoUrl: story.videoUrl || "",
              videoPreview: story.videoUrl || "",
              audioFile: story.audioFile || "",
              thumbnail: story.thumbnail || "",
            })
          }
        }).catch(() => {
          toast({ title: "Failed to fetch story", variant: "destructive" })
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      const story = stories.find((s: Story) => s.slug === storySlug)
      if (story) {
        setFormData({
          title: story.title,
          slug: story.slug,
          summary: story.summary,
          content: story.content,
          type: story.type,
          videoUrl: story.videoUrl || "",
          videoPreview: story.videoUrl || "",
          audioFile: story.audioFile || "",
          thumbnail: story.thumbnail || "",
        })
      }
      setLoading(false)
    }
  }, [stories, storySlug, fetchStories])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleContentChange = (newContent: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, content: newContent }))
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
      setFormData((prev) => ({ ...prev, thumbnail: url }))
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
      setFormData((prev) => ({ ...prev, audioFile: url }))
      toast({ title: "Audio uploaded", description: "Upload successful." })
    } catch (error) {
      console.error("[UPLOAD_AUDIO]", error)
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsUploadingAudio(false)
    }
  }


  const handleVideoUrlChange = (url: string) => {
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
    setFormData((prev) => ({ ...prev, videoUrl: url, videoPreview: embedUrl }))
  }

  const handleSubmit = async (status: "published" | "draft") => {
    if (!user) {
      toast({ title: "Please log in to update a story", variant: "destructive" })
      return
    }
    if (!formData.title || !formData.summary || Object.keys(formData.content).length === 0) {
      toast({ title: "Please fill in all required fields", variant: "destructive" })
      return
    }
    if (!formData.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      toast({ title: "Invalid slug format", description: "Use lowercase letters, numbers, and hyphens only.", variant: "destructive" })
      return
    }
    const setLoading = status === "draft" ? setIsSavingDraft : setIsPublishing
    setLoading(true)
    try {
      const updatedStory: Partial<Story> = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        type: formData.type,
        videoUrl: formData.type === "video" ? formData.videoUrl : undefined,
        audioFile: formData.type === "audio" ? formData.audioFile : undefined,
        thumbnail: formData.thumbnail || undefined,
        status,
      }
      await updateStory(storySlug, updatedStory)
      toast({ title: `Story ${status === "published" ? "updated and published" : "saved as draft"} successfully`, variant: "default" })
      router.push("/dashboard/stories")
    } catch (error) {
      console.error("[UPDATE_STORY]", error)
      toast({ title: "Failed to update story", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!stories.find((s: Story) => s.slug === storySlug)) {
    {
      return <div>Story not found</div>
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto md:px-20">
        {/* Header */}
        <div className="flex items-center gap-4 md:pl-6">
          <Link href="/dashboard/stories">
            <Button variant="ghost" size="sm" className=" hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Story</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm md:p-8 p-2">
          <div className="space-y-6">
            {/* Story Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Story Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Story Slug */}
            <div>
              <Label htmlFor="slug" className="text-sm font-medium mb-2 block">
                Story Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Enter story slug"
                className="w-full"
                disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
              />
            </div>

            {/* Story Summary */}
            <div>
              <Label htmlFor="summary" className="text-sm font-medium mb-2 block">
                Story Summary/Abstract
              </Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full h-24 resize-none"
              />
            </div>

            {/* Upload Thumbnail */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload Thumbnail</Label>
              {formData.thumbnail ? (
                <div className="mb-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600"
                      onClick={() => setFormData({ ...formData, thumbnail: "" })}
                      disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload your files, JPG or PNG format, we recommend 1024 x 1024
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Drag file or browse</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-app-primary text-white border-app-primary hover:bg-orange-600"
                    onClick={handleFileUpload}
                    disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
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
              )}
            </div>

            {/* Story Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Story Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) => setFormData({ ...formData, type: value as "text" | "video" | "audio" })}
                disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
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

            {/* Conditional Video URL Input */}
            {formData.type === "video" && (
              <div>
                <Label htmlFor="videoUrl" className="text-sm font-medium text-gray-700 mb-2 block">
                  Video URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="Enter YouTube or Vimeo URL"
                    className="flex-1"
                    disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
                  />
                  {formData.videoUrl && (
                    <Button
                      variant="destructive"
                      onClick={() => setFormData({ ...formData, videoUrl: "", videoPreview: "" })}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {formData.videoUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">Video Preview</span>
                    </div>
                    <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                      <iframe
                        src={formData.videoPreview || formData.videoUrl.replace("watch?v=", "embed/")}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Video preview"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conditional Audio Upload */}
            {formData.type === "audio" && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Upload Audio File</Label>
                {formData.audioFile ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Audio File Attached</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setFormData({ ...formData, audioFile: "" })}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
                      >
                        Remove
                      </Button>
                    </div>
                    <audio controls className="w-full">
                      <source src={formData.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Upload audio file (MP3, WAV)</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-app-primary text-white border-app-primary hover:bg-orange-600"
                      onClick={handleAudioUpload}
                      disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
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
                )}
              </div>
            )}

            {/* Rich Text Editor */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Story Content</Label>
              <div className="border border-gray-300 rounded-lg">
                <RichTextEditor
                  content={formData.content}
                  onChange={handleContentChange}
                  placeholder="Write your story content here..."
                  disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
              >
                {isSavingDraft ? "Saving..." : "Save as draft"}
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                className="bg-app-primary hover:bg-primary/90"
                disabled={isSavingDraft || isPublishing || isUploadingThumbnail || isUploadingAudio}
              >
                {isPublishing ? "Updating..." : "Update and Publish"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

