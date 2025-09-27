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
import { initialBlogs1, blogCategories } from "@/lib/mockData"
import { toast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const blogId = params.id
  const blog = initialBlogs1.find((b) => b.id === blogId)

  const [thumbnailPreview, setThumbnailPreview] = useState(blog?.thumbnail || "")
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    summary: blog?.summary || "",
    content: blog?.content?.introduction || "",
    category: blog?.category || "",
    type: blog?.type || "text",
    videoUrl: blog?.videoUrl || "",
    audioFile: blog?.audioFile || "",
    thumbnail: blog?.thumbnail || "",
  })

  const [content, setContent] = useState(formData.content);

  if (!blog) {
    return <div>Blog not found</div>
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSave = () => {
    toast({
      title: "Blog saved successfully",
      variant: "default",
    })
    router.push("/blogs")
  }

  const handlePublish = () => {
    toast({
      title: "Blog published successfully",
      variant: "default",
    })
    router.push("/blogs")
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto md:px-20">
        {/* Header */}
        <div className="flex items-center gap-4 md:pl-6">
          <Link href="/blogs">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold ">Edit Blog</h1>
        </div>

        <div className="rounded-lg shadow-sm md:p-8 p-2">
          <div className="space-y-6">
            {/* Blog Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Blog Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full"
              />
            </div>

            {/* Blog Summary */}
            <div>
              <Label htmlFor="summary" className="text-sm font-medium mb-2 block">
                Blog Summary/Abstract
              </Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full h-24 resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Thumbnail */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload Thumbnail</Label>
              {thumbnailPreview ? (
                <div className="mb-4">
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600"
                      onClick={() => setThumbnailPreview("")}
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
                    onClick={() => {
                      // Simulate file upload - in real app, handle file input
                      setThumbnailPreview(formData.thumbnail || "/placeholder-thumbnail.jpg")
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
              )}
            </div>

            {/* Blog Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Blog Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "text" | "video" | "audio") => setFormData({ ...formData, type: value })}
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
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="Enter YouTube or Vimeo URL"
                    className="flex-1"
                    disabled={!!formData.videoUrl}
                  />
                  {formData.videoUrl && (
                    <Button
                      variant="destructive"
                      onClick={() => setFormData({ ...formData, videoUrl: "" })}
                      className="bg-red-500 hover:bg-red-600"
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
                        src={formData.videoUrl.replace("watch?v=", "embed/")}
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
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Rich Text Editor */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Blog Content</Label>
              <div className="border border-gray-300 rounded-lg">
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={handleSave}>
                Save as draft
              </Button>
              <Button onClick={handlePublish} className="bg-app-primary hover:bg-orange-600">
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
