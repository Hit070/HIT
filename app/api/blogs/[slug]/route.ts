// Updated blogs/[slug] API route
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Blog } from "@/types";

// GET /api/blogs/[slug]
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        const blog = await prisma.blog.findUnique({ where: { slug: params.slug } });
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

// PUT /api/blogs/[slug]
export async function PUT(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    const data = await request.json() as Blog;
    try {
        // If this blog is being marked as featured, unfeature all others first
        if (data.isFeatured) {
            await prisma.blog.updateMany({
                where: { slug: { not: params.slug } },
                data: { isFeatured: false }
            });
        }

        const blog = await prisma.blog.update({
            where: { slug: params.slug },
            data: {
                title: data.title,
                author: data.author,
                summary: data.summary,
                content: data.content,
                category: data.category,
                type: data.type,
                videoUrl: data.videoUrl,
                audioFile: data.audioFile,
                thumbnail: data.thumbnail,
                status: data.status,
                slug: data.slug,
                isFeatured: data.isFeatured,
            },
        });

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}

// DELETE /api/blogs/[slug]
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> }) {
    const params = await context.params;
    try {
        await prisma.blog.delete({ where: { slug: params.slug } });
        return NextResponse.json({ message: "Blog deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}