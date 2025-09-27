import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { initialBlogs } from "@/lib/mockData"

const MAX_DESC_LENGTH = 100

const getCategoryColor = (id: number) => {
    const colors = [
        { text: "text-purple-600", border: "border-purple-600", bg: "bg-purple-100" },
        { text: "text-green-600", border: "border-green-600", bg: "bg-green-100" },
        { text: "text-blue-600", border: "border-blue-600", bg: "bg-blue-100" },
        { text: "text-yellow-600", border: "border-yellow-600", bg: "bg-yellow-100" },
        { text: "text-indigo-600", border: "border-indigo-600", bg: "bg-indigo-100" },
        { text: "text-emerald-600", border: "border-emerald-600", bg: "bg-emerald-100" },
        { text: "text-red-600", border: "border-red-600", bg: "bg-red-100" },
        { text: "text-pink-600", border: "border-pink-600", bg: "bg-pink-100" },
        { text: "text-teal-600", border: "border-teal-600", bg: "bg-teal-100" },
        { text: "text-orange-600", border: "border-orange-600", bg: "bg-orange-100" },
        { text: "text-cyan-600", border: "border-cyan-600", bg: "bg-cyan-100" },
    ]
    return colors[id % colors.length]
}

export default function BlogDetailsPage({ params }: { params: { id: string } }) {
    const blogId = Number.parseInt(params.id)
    const blog = initialBlogs.find((b) => b.id === blogId) || initialBlogs[0]

    const otherBlogs = initialBlogs.filter((b) => b.id !== blogId).slice(0, 3)
    const color = getCategoryColor(blog.id)

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-[1200px] mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link href="/blog" className="hover:text-[#bf5925]">
                        Blog
                    </Link>
                    <span>&gt;</span>
                    <span>Blog Details</span>
                </nav>

                {/* Blog Header */}
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{blog.title}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <span
                            className={`${color.text} ${color.border} ${color.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                        >
                            {blog.category}
                        </span>
                        <span className="text-gray-500">{blog.date}</span>
                    </div>

                    {/* Hero Image */}
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                        <Image
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            width={800}
                            height={450}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </header>

                {/* Blog Content */}
                <article className="prose prose-lg max-w-none">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">{blog.content?.introduction}</p>
                    </div>

                    {blog.content?.sections.map((section, index) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed">{section.content}</p>
                        </div>
                    ))}

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Closing Thoughts</h2>
                        <p className="text-gray-700 leading-relaxed">{blog.content?.closingThoughts}</p>
                    </div>
                </article>
            </main>

            {/* Read Other Blogs Section */}
            <section className="bg-gray-100 py-16 px-6">
                <div className="max-w-[1536px] mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Read Other Blogs</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {otherBlogs.map((blog) => {
                            const isTruncated = blog.description.length > MAX_DESC_LENGTH
                            const preview = isTruncated
                                ? blog.description.slice(0, MAX_DESC_LENGTH) + "..."
                                : blog.description

                            const color = getCategoryColor(blog.id)

                            return (
                                <Link
                                    key={blog.id}
                                    href={`/blog/${blog.id}`}
                                    className="group cursor-pointer block"
                                >
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            width={500}
                                            height={375}
                                            src={blog.image || "/placeholder.svg"}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-[#bf5925] transition-colors">
                                            {blog.title}
                                        </h3>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`${color.text} ${color.border} ${color.bg} border px-3 py-1 rounded-full text-sm font-medium`}
                                            >
                                                {blog.category}
                                            </span>

                                            <span className="text-gray-500 text-sm">{blog.date}</span>
                                        </div>

                                        <p className="text-md text-gray-700 leading-relaxed">
                                            {preview}
                                        </p>
                                        {isTruncated && (
                                            <div className="mt-1">
                                                <span className="text-blue-600 hover:underline text-sm">
                                                    See more
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
