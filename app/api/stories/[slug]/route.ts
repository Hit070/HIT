// api/stories/[slug]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Story } from "@/types";

// GET /api/stories/[slug]
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        const story = await prisma.story.findUnique({ where: { slug: params.slug } });
        if (!story) return NextResponse.json({ error: "Story not found" }, { status: 404 });
        return NextResponse.json(story);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
    }
}

// PUT /api/stories/[slug]
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    const data = await request.json() as Story;
    try {
        // If this story is being marked as featured, unfeature all others
        if (data.isFeatured) {
            await prisma.story.updateMany({
                where: {
                    isFeatured: true,
                    slug: { not: params.slug } // Don't update the current story
                },
                data: { isFeatured: false }
            });
        }

        const story = await prisma.story.update({
            where: { slug: params.slug },
            data: {
                title: data.title,
                author: data.author,
                summary: data.summary,
                content: data.content,
                type: data.type,
                videoUrl: data.videoUrl,
                audioFile: data.audioFile,
                thumbnail: data.thumbnail,
                status: data.status,
                slug: data.slug,
                isFeatured: data.isFeatured,
            },
        });
        return NextResponse.json(story);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
    }
}

// DELETE /api/stories/[slug]
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        await prisma.story.delete({ where: { slug: params.slug } });
        return NextResponse.json({ message: "Story deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
    }
}