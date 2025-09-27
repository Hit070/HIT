"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Calendar, MapPin, Clock, Link2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Event } from "@/types"  // Changed from Events to Event

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onEventCreated: (event: Omit<Event, "id">) => void
}

export function CreateEventModal({ isOpen, onClose, onEventCreated }: CreateEventModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<"active" | "ended">("active")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: Omit<Event, "id"> = {
      title,
      date,
      time,
      location,
      description,
      meetingLink,
      featured: featured,
      status: status,
      image: "/community-event.png",
      dateCreated: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
    }

    onEventCreated(newEvent)

    // Reset form
    setTitle("")
    setDate("")
    setTime("")
    setLocation("")
    setDescription("")
    setMeetingLink("")
    setFeatured(false)
    setStatus("active")
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle>Create New Event</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-12 w-12 bg-gray-50 p-2 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Event Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g., 10:00 AM"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Enter Zoom, Teams, or other meeting link"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Upload Event Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center bg-muted/10">
              <div className="flex flex-col items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Upload event image. PNG or JPG format recommended.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileUpload}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Browse Files
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" title="Upload Image" />
                </div>
              </div>
            </div>
          </div>
          {/* 
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "active" | "ended") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured">Featured Event</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                <Label htmlFor="featured" className="text-sm text-muted-foreground">
                  Mark as featured
                </Label>
              </div>
            </div>
          </div> */}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
