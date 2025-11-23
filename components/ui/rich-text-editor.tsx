"use client";

import isHotkey from "is-hotkey";
import React, {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
  Text,
  Range,
} from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Heading1,
  Heading2,
  ImagePlus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "block-quote"
  | "numbered-list"
  | "bulleted-list"
  | "list-item"
  | "image";
type CustomTextKey = "bold" | "italic" | "underline" | "code";

type ImageElement = {
  type: "image";
  url: string;
  link?: string;
  alt?: string;
  children: CustomText[];
};

type CustomElement =
  | {
      type: Exclude<CustomElementType, "image">;
      align?: "left" | "center" | "right" | "justify";
      children: (CustomText | CustomElement)[];
    }
  | ImageElement;

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: Editor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS: Record<string, CustomTextKey> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"] as const;
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

// Extend editor with image support
const withImages = (editor: Editor & ReactEditor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return (element as CustomElement).type === "image" ? true : isVoid(element);
  };

  return editor;
};

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write your content here...",
  disabled = false,
}: {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  // Convert HTML to Slate value or use default
  const initialValue = useMemo((): Descendant[] => {
    if (content.html && content.html.trim() !== "") {
      try {
        return htmlToSlate(content.html);
      } catch (e) {
        console.warn("Failed to parse HTML content, using default");
      }
    }
    return [{ type: "paragraph", children: [{ text: "" }] }];
  }, [content.html]);

  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Update value when content changes externally
  useEffect(() => {
    if (content.html !== slateToHtml(value)) {
      setValue(initialValue);
    }
  }, [content.html, initialValue, value]);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);

      const isAstChange = editor.operations.some(
        (op) => "set_selection" !== op.type
      );

      if (isAstChange) {
        const html = slateToHtml(newValue);
        onChange({ html });
      }
    },
    [editor.operations, onChange]
  );

  const insertImage = () => {
    if (!imageUrl) return;

    const image: ImageElement = {
      type: "image",
      url: imageUrl,
      ...(imageLink && { link: imageLink }),
      ...(imageAlt && { alt: imageAlt }),
      children: [{ text: "" }],
    };

    Transforms.insertNodes(editor, image);
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ text: "" }],
    });

    // Reset form
    setImageUrl("");
    setImageLink("");
    setImageAlt("");
    setImageDialogOpen(false);
  };

  return (
    <div className="border rounded-lg">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
          {/* Text Formatting */}
          <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} />
          <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} />
          <MarkButton
            format="underline"
            icon={<Underline className="h-4 w-4" />}
          />
          <MarkButton format="code" icon={<Code className="h-4 w-4" />} />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Headings */}
          <BlockButton
            format="heading-one"
            icon={<Heading1 className="h-4 w-4" />}
          />
          <BlockButton
            format="heading-two"
            icon={<Heading2 className="h-4 w-4" />}
          />
          <BlockButton
            format="block-quote"
            icon={<Quote className="h-4 w-4" />}
          />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists */}
          <BlockButton
            format="bulleted-list"
            icon={<List className="h-4 w-4" />}
          />
          <BlockButton
            format="numbered-list"
            icon={<ListOrdered className="h-4 w-4" />}
          />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Alignment */}
          <BlockButton format="left" icon={<AlignLeft className="h-4 w-4" />} />
          <BlockButton
            format="center"
            icon={<AlignCenter className="h-4 w-4" />}
          />
          <BlockButton
            format="right"
            icon={<AlignRight className="h-4 w-4" />}
          />
          <BlockButton
            format="justify"
            icon={<AlignJustify className="h-4 w-4" />}
          />

          <div className="w-px h-6 bg-border mx-1" />

          {/* Image */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onPointerDown={(event: PointerEvent<HTMLButtonElement>) =>
              event.preventDefault()
            }
            onClick={() => setImageDialogOpen(true)}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            className="min-h-[300px] p-4 text-base outline-none prose prose-sm max-w-none
              [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 
              [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 
              [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3
              [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
            readOnly={disabled}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </div>
      </Slate>

      {/* Image Insert Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL *</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-link">Link URL (optional)</Label>
              <Input
                id="image-link"
                placeholder="https://example.com/destination"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                If provided, clicking the image will open this link in a new tab
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-alt">Alt Text (optional)</Label>
              <Input
                id="image-alt"
                placeholder="Description of the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertImage} disabled={!imageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Core functions from Slate demo
const toggleBlock = (editor: Editor, format: CustomElementFormat) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? "align" : "type"
  );
  const isList = isListType(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type as any) &&
      !isAlignType(format),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    } as any;
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    } as any;
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: CustomTextKey) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: Editor,
  format: CustomElementFormat,
  blockType: "type" | "align" = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === "align" && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: CustomTextKey) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Image element renderer
const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  const imageElement = element as ImageElement;

  const removeImage = () => {
    const path = ReactEditor.findPath(editor as ReactEditor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  const imageContent = (
    <div className="relative inline-block group">
      <img
        src={imageElement.url}
        alt={imageElement.alt || ""}
        className={`max-w-full h-auto rounded-lg ${
          selected && focused ? "ring-2 ring-blue-500" : ""
        } ${
          imageElement.link
            ? "cursor-pointer hover:opacity-90 transition-opacity"
            : ""
        }`}
        style={{ maxHeight: "500px" }}
      />
      {selected && focused && (
        <button
          onClick={removeImage}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          contentEditable={false}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  return (
    <div {...attributes} contentEditable={false} className="my-4">
      {children}
      {imageElement.link ? (
        <div className="border-2 border-blue-200 rounded-lg p-3 bg-blue-50/50 hover:bg-blue-50 transition-colors">
          <a
            href={imageElement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {imageContent}
            <div className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span className="font-medium">🔗 Click to open:</span>
              <span className="truncate">{imageElement.link}</span>
            </div>
          </a>
        </div>
      ) : (
        imageContent
      )}
    </div>
  );
};

// Element renderer from Slate demo
const Element = ({ attributes, children, element }: RenderElementProps) => {
  if (element.type === "image") {
    return (
      <ImageElement
        attributes={attributes}
        children={children}
        element={element}
      />
    );
  }

  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align as AlignType;
  }

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

// Leaf renderer from Slate demo
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

// Button components
interface BlockButtonProps {
  format: CustomElementFormat;
  icon: React.ReactNode;
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
      data-active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? "align" : "type"
      )}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) =>
        event.preventDefault()
      }
      onClick={() => toggleBlock(editor, format)}
    >
      {icon}
    </Button>
  );
};

interface MarkButtonProps {
  format: CustomTextKey;
  icon: React.ReactNode;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
      data-active={isMarkActive(editor, format)}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) =>
        event.preventDefault()
      }
      onClick={() => toggleMark(editor, format)}
    >
      {icon}
    </Button>
  );
};

// Type guards
const isAlignType = (format: CustomElementFormat): format is AlignType => {
  return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (
  element: CustomElement
): element is CustomElement & { align: AlignType } => {
  return "align" in element && element.align !== undefined;
};

// HTML conversion functions
function htmlToSlate(html: string): Descendant[] {
  const div = document.createElement("div");
  div.innerHTML = html;

  const parseElement = (el: Element): CustomElement => {
    const tagName = el.tagName.toLowerCase();

    // Handle images
    if (tagName === "img") {
      const url = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      return {
        type: "image",
        url,
        alt,
        children: [{ text: "" }],
      } as ImageElement;
    }

    // Handle linked images (a > img)
    if (tagName === "a") {
      const img = el.querySelector("img");
      if (img) {
        const url = img.getAttribute("src") || "";
        const alt = img.getAttribute("alt") || "";
        const link = el.getAttribute("href") || "";
        return {
          type: "image",
          url,
          alt,
          link,
          children: [{ text: "" }],
        } as ImageElement;
      }
    }

    const children: (CustomText | CustomElement)[] = [];

    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        if (text) children.push({ text });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childEl = child as Element;
        const parsed = parseElement(childEl);
        if (parsed) children.push(parsed);
      }
    }

    if (children.length === 0) {
      children.push({ text: "" });
    }

    const textAlign = el.style.textAlign as AlignType | undefined;

    switch (tagName) {
      case "h1":
        return {
          type: "heading-one",
          children: children as CustomText[],
          ...(textAlign && { align: textAlign }),
        };
      case "h2":
        return {
          type: "heading-two",
          children: children as CustomText[],
          ...(textAlign && { align: textAlign }),
        };
      case "blockquote":
        return {
          type: "block-quote",
          children: children as CustomText[],
          ...(textAlign && { align: textAlign }),
        };
      case "ul":
        return { type: "bulleted-list", children: children as CustomElement[] };
      case "ol":
        return { type: "numbered-list", children: children as CustomElement[] };
      case "li":
        return { type: "list-item", children: children as CustomText[] };
      default:
        return {
          type: "paragraph",
          children: children as CustomText[],
          ...(textAlign && { align: textAlign }),
        };
    }
  };

  try {
    if (div.children.length === 0) {
      return [{ type: "paragraph", children: [{ text: html }] }];
    }

    return Array.from(div.children).map(parseElement);
  } catch (e) {
    return [{ type: "paragraph", children: [{ text: html }] }];
  }
}

function slateToHtml(value: Descendant[]): string {
  const serialize = (node: any): string => {
    if (Text.isText(node)) {
      let string = node.text;
      if (node.bold) string = `<strong>${string}</strong>`;
      if (node.italic) string = `<em>${string}</em>`;
      if (node.underline) string = `<u>${string}</u>`;
      if (node.code) string = `<code>${string}</code>`;
      return string;
    }

    // Handle images
    if (node.type === "image") {
      const img = `<img src="${node.url}" alt="${
        node.alt || ""
      }" style="max-width: 100%; height: auto; max-height: 500px; border-radius: 0.5rem;" />`;

      if (node.link) {
        return `<div style="border: 2px solid #bfdbfe; border-radius: 0.5rem; padding: 0.75rem; background-color: #eff6ff; margin: 1rem 0;">
                    <a href="${node.link}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none;">
                        ${img}
                        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #2563eb;">
                            <span style="font-weight: 500;">🔗 Click to open:</span>
                            <span style="margin-left: 0.25rem;">${node.link}</span>
                        </div>
                    </a>
                </div>`;
      }

      return `<div style="margin: 1rem 0;">${img}</div>`;
    }

    const children = node.children.map(serialize).join("");
    const content = children.trim() === "" ? "&nbsp;" : children;
    const align = node.align ? ` style="text-align: ${node.align}"` : "";

    switch (node.type) {
      case "paragraph":
        return `<p${align}>${content}</p>`;
      case "heading-one":
        return `<h1${align}>${content}</h1>`;
      case "heading-two":
        return `<h2${align}>${content}</h2>`;
      case "block-quote":
        return `<blockquote${align}>${content}</blockquote>`;
      case "bulleted-list":
        return `<ul>${children}</ul>`;
      case "numbered-list":
        return `<ol>${children}</ol>`;
      case "list-item":
        return `<li>${content}</li>`;
      default:
        return children;
    }
  };

  return value.map(serialize).join("");
}
