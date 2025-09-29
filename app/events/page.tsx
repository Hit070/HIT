"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRangeFilter } from "@/components/date-range-filter"
import { DeleteModal } from "@/components/delete-modal"
import { CreateEventModal } from "@/components/create-event-modal"
import { EditEventModal } from "@/components/edit-event-modal"
import { useEventStore } from "@/store/store"
import { toast } from "@/components/ui/use-toast"
import type { Event } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EventsPage() {
  const { events, fetchEvents, updateEvent, deleteEvent } = useEventStore()
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; eventSlug: string | null }>({
    isOpen: false,
    eventSlug: null,
  })
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; eventSlug: string | null }>({
    isOpen: false,
    eventSlug: null,
  })
  const itemsPerPage = 10

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents()
        .catch(() => {
          toast({
            title: "Failed to fetch events",
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

  const filteredData = events.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "All" || item.status.toLowerCase() === activeTab.toLowerCase()
    const matchesDate = !dateRange.from && !dateRange.to
      ? true
      : new Date(item.date) >= (dateRange.from || new Date(0)) &&
      new Date(item.date) <= (dateRange.to || new Date(8640000000000000))
    return matchesSearch && matchesTab && matchesDate
  })

  const handleDeleteClick = (eventSlug: string) => {
    setDeleteModal({ isOpen: true, eventSlug })
  }

  const handleDeleteConfirm = async () => {
    if (deleteModal.eventSlug) {
      try {
        await deleteEvent(deleteModal.eventSlug)
        toast({ title: "Event deleted successfully", variant: "default" })
      } catch (error) {
        toast({ title: "Failed to delete event", variant: "destructive" })
      } finally {
        setDeleteModal({ isOpen: false, eventSlug: null })
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, eventSlug: null })
  }

  const handleEditClick = (eventSlug: string) => {
    setEditModal({ isOpen: true, eventSlug })
  }

  const handleEditClose = () => {
    setEditModal({ isOpen: false, eventSlug: null })
  }

  const handleMarkAsFeatured = async (eventSlug: string) => {
    try {
      const event = events.find((e) => e.slug === eventSlug)
      if (event) {
        await updateEvent(eventSlug, { featured: !event.featured })
        toast({
          title: `Event ${!event.featured ? "marked as featured" : "removed from featured"} successfully`,
          variant: "default",
        })
      }
    } catch (error) {
      toast({ title: "Failed to update featured status", variant: "destructive" })
    }
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "outline" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>,
        )
      }
    } else {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "outline" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 bg-transparent"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      )

      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-muted-foreground">
            ...
          </span>,
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "outline" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>,
        )
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-muted-foreground">
            ...
          </span>,
        )
      }

      if (totalPages > 1) {
        buttons.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "outline" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>,
        )
      }
    }

    return buttons
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-24 w-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="flex justify-end space-x-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Events</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted">
          <TabsTrigger
            value="All"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="Active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="Ended"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Ended
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="md:flex grid grid-cols-1 items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for events by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <h4 className="font-medium">Filter by Date</h4>
                <DateRangeFilter
                  fromDate={dateRange.from}
                  toDate={dateRange.to}
                  onDateRangeChange={(from, to) => setDateRange({ from, to })}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Event ID</TableHead>
              <TableHead>Event Title</TableHead>
              <TableHead className="w-[120px]">Date Created</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No events found</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.slug}>
                  <TableCell className="font-medium text-muted-foreground">#{item.id}</TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground">{item.dateCreated}</TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === "active" ? "default" : "secondary"}
                      className={
                        item.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(item.slug)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsFeatured(item.slug)}
                          >
                            {item.featured ? "Remove as Featured" : "Mark as Featured"}
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(item.slug)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          ← Back
        </Button>

        <div className="flex items-center gap-2">{renderPaginationButtons()}</div>

        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next →
        </Button>
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        itemType="event"
      />

      <CreateEventModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onEventCreated={() => {
          fetchEvents()
          setCreateModal(false)
          toast({ title: "Event created successfully", variant: "default" })
        }}
      />

      <EditEventModal
        isOpen={editModal.isOpen}
        eventSlug={editModal.eventSlug}
        events={events}
        onClose={handleEditClose}
        onEventUpdated={() => {
          fetchEvents()
          handleEditClose()
          toast({ title: "Event updated successfully", variant: "default" })
        }}
      />
    </div>
  )
}
