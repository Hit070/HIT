// api/events/[slug]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Event } from "@/types";

// GET /api/events/[slug]
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        const event = await prisma.event.findUnique({ where: { slug: params.slug } });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
}

// PUT /api/events/[slug]
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    const data = await request.json() as Event;
    try {
        // If this event is being marked as featured, unfeature all others
        if (data.featured) {
            await prisma.event.updateMany({
                where: {
                    featured: true,
                    slug: { not: params.slug } // Don't update the current event
                },
                data: { featured: false }
            });
        }

        const event = await prisma.event.update({
            where: { slug: params.slug },
            data: {
                title: data.title,
                date: data.date,
                location: data.location,
                description: data.description,
                image: data.image,
                meetingLink: data.meetingLink,
                status: data.status,
                time: data.time,
                slug: data.slug,
                featured: data.featured,
            },
        });
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

// DELETE /api/events/[slug]
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        await prisma.event.delete({ where: { slug: params.slug } });
        return NextResponse.json({ message: "Event deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}