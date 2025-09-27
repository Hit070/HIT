"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

export function RichTextEditor({
    content,
    onChange,
    placeholder = "Write your content here..."
}: {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}) {
    const editorRef = useRef<HTMLDivElement>(null)

    // Set initial content only once
    useEffect(() => {
        if (editorRef.current && content !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = content
        }
    }, [content])

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const formatText = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        // No need to manually update state here, handleInput will be called on input
    }

    return (
        <div className="border rounded-lg">
            <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                {/* Toolbar buttons with the same functionality as in create page */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("bold")}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("italic")}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("underline")}
                    type="button"
                >
                    <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("insertUnorderedList")}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("insertOrderedList")}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("justifyLeft")}
                    type="button"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("justifyCenter")}
                    type="button"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => formatText("justifyRight")}
                    type="button"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                {/*
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        const url = prompt("Enter URL:")
                        if (url) formatText("createLink", url)
                    }}
                    type="button"
                >
                    <Link2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        const url = prompt("Enter image URL:")
                        if (url) formatText("insertImage", url)
                    }}
                    type="button"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button> */}
            </div>

            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="min-h-[300px] p-4 text-base outline-none relative"
                style={{ whiteSpace: "pre-wrap" }}
                suppressContentEditableWarning={true}
            />
        </div>
    )
}