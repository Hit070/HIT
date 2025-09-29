"use client"

import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

function useCountUp(end: number, duration = 2000) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.3 },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [isVisible])

    useEffect(() => {
        if (!isVisible) return

        let startTime: number
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Smooth easing function (ease-out)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)

            // Use precise decimal calculation for smoother animation
            const currentCount = easeOutQuart * end
            setCount(Math.round(currentCount * 10) / 10) // Round to 1 decimal place for smoothness

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(end) // Ensure we end exactly at the target
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return { count, ref }
}

export default function AboutPage() {

    const counter1 = useCountUp(500, 2000)
    const counter2 = useCountUp(20, 2000)
    const counter3 = useCountUp(100, 2000)
    const counter4 = useCountUp(5, 2000)

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden">
            <Header />

            {/* Background Frame Image */}
            <div className="absolute top-0 left-0 w-full h-[150vh] z-10">
                <Image
                    src="/gridlines.png"
                    alt="Background frame"
                    fill
                    className="object-cover"
                />
                {/* Blur overlay for entire background */}
                <div className="absolute inset-0 bg-gradient-radial from-white/60 via-white/30 to-transparent"></div>
                {/* Circular blur behind header/text area */}
                <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-[1200px] h-[600px] bg-white/50 rounded-full blur-[120px]"></div>
                {/* Bottom circular blur */}
                <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[1400px] h-[400px] bg-white/60 rounded-full blur-[100px]"></div>
            </div>


            {/* Hero Section */}
            <section className="relative py-16 md:py-24 z-10">
                <div className="w-full mx-auto text-center">
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl md:px-0 px-4 font-cormorant leading-tight mb-8">
                        <span className="text-black">Amplifying Voices. Empowering</span>
                        <br />
                        <span className="text-[#bf5925] italic">Immigrant Women.</span>
                        <span className="text-black"> Changing Lives.</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-600 md:px-0 px-4 max-w-5xl mx-auto mb-12 leading-relaxed">
                        Her Immigrant Tales is a global social impact movement dedicated to sharing stories, fostering community,
                        and creating opportunities for immigrant women.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:px-0 px-8 gap-4 justify-center mb-20">
                        <Link href="https://herimmigranttalepartners.framer.website" target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-[#bf5925] text-[#bf5925] hover:bg-[#bf5925] hover:text-white px-8 py-3 rounded-full bg-transparent"
                            >
                                Collaborate
                            </Button>
                        </Link>
                        <Button size="lg" className="bg-[#bf5925] hover:bg-[#a04920] text-white px-8 py-3 rounded-full">
                            Donate
                        </Button>
                    </div>

                    {/* Hero Images with Dynamic Layout */}
                    <div className="relative w-full mx-auto min-h-[500px] md:min-h-[500px]">
                        {/* Background Orange Shapes - Full Width */}
                        <div className="absolute inset-0 w-screen scale-y-75 left-1/2 transform -translate-x-1/2 overflow-hidden">
                            <Image
                                src="/vector.png"
                                alt="Decorative background"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        {/* Images Container */}
                        <div className="relative z-10 max-w-6xl mx-auto px-4">
                            <div className="md:flex md:justify-between md:items-center">
                                {/* Left Image - Brave */}
                                <div className="relative z-20 transform md:-rotate-6 md:translate-y-8 -rotate-12 translate-y-4 mb-16 md:mb-0">
                                    <div className="relative">
                                        <Image
                                            width={288}
                                            height={320}
                                            src="/left.png"
                                            alt="Woman in traditional colorful dress"
                                            className="h-80 object-cover rounded-[50px] shadow-2xl border-[10px] border-[#FFF3EA] mx-auto md:mx-0"
                                        />
                                        <div className="absolute top-8 md:-right-10 -right-0 w-24 bg-[#0E79E5] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                            Brave
                                        </div>
                                    </div>
                                </div>
                                {/* Center Image - Main */}
                                <div className="relative z-20 md:scale-110 scale-100 mb-8 md:mb-0 flex justify-center">
                                    <Image
                                        src="/abouth1.png"
                                        alt="Two women in yellow clothing smiling together"
                                        className="md:w-96 md:h-96 w-80 h-80 object-cover rounded-[50px] shadow-2xl border-[15px] border-[#FFF3EA]"
                                        width={384}
                                        height={384}
                                    />
                                </div>
                                {/* Right Image - Beautiful */}
                                <div className="relative z-20 md:mr-0 mr-12 transform md:rotate-6 md:translate-y-12 rotate-12 translate-y-4 flex justify-end md:justify-start">
                                    <div className="relative">
                                        <Image
                                            src="/right.png"
                                            alt="Woman in red top"
                                            className="h-80 object-cover rounded-[50px] shadow-2xl border-[10px] border-[#FFF3EA]"
                                            width={288}
                                            height={320}
                                        />
                                        <div className="absolute top-8 md:-left-8 -left-10 bg-[#0B902B] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                            Beautiful
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Who We Are Section */}
            <section className="px-4 py-16 md:py-20">
                <div className="max-w-6xl mx-auto">
                    {/* Text Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-cormorant leading-tight text-black">
                                Who We Are And What We Stand For
                            </h2>
                        </div>
                        <div className="flex items-center">
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                HIT is more than a platform, it's a movement where immigrant women share their stories, connect, and are
                                celebrated for their courage and impact.
                            </p>
                        </div>
                    </div>

                    {/* Portrait Images */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Image */}
                        <div className="relative">
                            <div className="rounded-[50px] h-80 flex items-end">
                                <img
                                    src="/who1.png"
                                    alt="Woman in beige top with arms crossed"
                                    className="w-full h-full object-cover object-center rounded-[50px]"
                                />
                            </div>
                        </div>

                        {/* Center Image */}
                        <div className="relative">
                            <div className="rounded-[50px] h-80 flex items-end">
                                <img
                                    src="/who2.png"
                                    alt="Black woman smiling in black top"
                                    className="w-full h-full object-cover object-center rounded-[50px]"
                                />
                            </div>
                        </div>

                        {/* Right Image - Tilted Left */}
                        <div className="relative">
                            <div className="rounded-[50px] h-80 flex items-end transform scale-70 -rotate-48">
                                <img
                                    src="/who3.png"
                                    alt="Asian woman in blue top"
                                    className="w-full h-full object-cover object-center rounded-[50px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, and Goals Section */}
            <section className="px-4 py-16 md:py-20 bg-[#f8f6f3]">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Section Header */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-cormorant leading-tight text-black mb-8">
                        Our Mission, Vision, and Goals
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-28 leading-relaxed">
                        At HIT, our mission drives us, our vision inspires us, and our goals keep us focused on empowering immigrant
                        women worldwide.
                    </p>

                    {/* Cards Container */}
                    <div className="relative md:max-w-[1000px] mx-auto ml-8">
                        {/* Vision Card - Orange (Left) */}
                        <div className="relative md:absolute left-0 top-0 transform -translate-y-12 -rotate-6 z-30 mb-8 md:mb-0">
                            <div className="bg-[#bf5925] text-white p-8 rounded-3xl w-80 h-96 shadow-2xl">
                                <div className="mb-6">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-[#bf5925]" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif mb-4">Our Vision</h3>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    A world where every immigrant woman feels seen, heard, and valued and where her story becomes a source
                                    of healing, pride, and power as we envision Her Immigrant Tales - the global voice of immigrant women
                                    - a platform where stories heal, creations inspire, and opportunities grow.
                                </p>
                            </div>
                        </div>

                        {/* Mission Card - White (Middle) */}
                        <div className="relative md:absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-16 rotate-12 z-20 mb-8 md:mb-0">
                            <div className="bg-white border-2 border-[#bf5925] p-8 rounded-3xl w-80 h-96 shadow-2xl">
                                <div className="mb-6">
                                    <div className="w-12 h-12 bg-[#bf5925] rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif mb-4 text-[#bf5925]">Our Mission</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700">
                                    To amplify the voices and lived experiences of immigrant women through storytelling, healing spaces,
                                    and culturally inspired creations - building community, fostering belonging, and empowering women in a
                                    world that too often overlooks them.
                                </p>
                            </div>
                        </div>

                        {/* Goal Card - White (Right) */}
                        <div className="relative md:absolute right-0 top-0 md:mt-0 -mt-12 transform -translate-y-12 -rotate-6 z-10">
                            <div className="bg-white border-2 border-[#bf5925] p-8 rounded-3xl w-80 h-96 shadow-2xl">
                                <div className="mb-6">
                                    <div className="w-12 h-12 bg-[#bf5925] rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif mb-4 text-[#bf5925]">Our Goal</h3>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-700">
                                    To collaborate for impact by partnering with organizations, creators, and institutions to amplify
                                    immigrant voices through meaningful projects.
                                </p>
                            </div>
                        </div>

                        {/* Spacer for overlapping cards */}
                        <div className="hidden md:block h-96 md:h-80"></div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 md:py-20">
                <div className="max-w-[1536px] mx-auto text-center">
                    {/* Section Header */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-cormorant leading-tight text-black mb-8">What We Do</h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-16 leading-relaxed">
                        At HIT, our mission drives us, our vision inspires us, and our goals keep us focused on empowering immigrant
                        women worldwide.
                    </p>

                    {/* Grid Container with fixed height */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1200px] h-[800px] mx-auto">

                        {/* LEFT COLUMN - Fixed height */}
                        <div className="flex flex-col gap-8 h-[800px]">
                            {/* Community Building - Takes remaining space (40% of left column) */}
                            <div className="bg-green-100 rounded-[50px] p-8 flex flex-col justify-between h-[40%]">
                                <div>
                                    <h3 className="text-2xl md:text-[50px] font-cormorant text-black mb-6">Community Building</h3>

                                    {/* Overlapping Profile Images */}
                                    <div className="flex -space-x-2 justify-center"> {/* Added justify-center to center the images */}
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white bg-white z-30">
                                            <Image
                                                src="/woman-profile.png"
                                                alt="Profile 1"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover bg-cover bg-center"
                                            />
                                        </div>
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white bg-white z-20">
                                            <Image
                                                src="/asian-woman-profile.png"
                                                alt="Profile 2"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover bg-cover bg-center"
                                            />
                                        </div>
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white bg-white z-10">
                                            <Image
                                                src="/asian-woman-profile.png"
                                                alt="Profile 3"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover bg-cover bg-center"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                    We build a strong, interconnected community of women who consistently uplift, encourage, and empower one
                                    another in every aspect of life.
                                </p>
                            </div>

                            {/* Resources - Takes 60% of left column height */}
                            <div className="bg-[url('/resources.png')] bg-cover bg-center rounded-[50px] p-8 flex flex-col gap-6 h-[60%]">
                                <div className="flex-1">
                                    <h3 className="text-2xl text-left md:text-[50px] font-cormorant text-black mb-4">Resources</h3>
                                    <p className="text-sm md:text-base text-left max-w-[50%] text-gray-700 leading-relaxed">
                                        We share tools, insights, and opportunities to help women thrive in their new homes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Fixed height */}
                        <div className="flex flex-col gap-8 h-[800px]">
                            {/* Partnerships - Takes remaining space (30% of right column) */}
                            <div className="bg-amber-700 rounded-[50px] p-8 flex flex-col align-text-top justify-center h-[30%] text-white">
                                <h3 className="text-2xl md:text-[50px] font-cormorant mb-6">Partnerships</h3>
                                <p className="text-sm md:text-base leading-relaxed">
                                    We actively partner with diverse organizations to broaden our reach, amplify our collective impact, and
                                    deliver meaningful, tangible support to those we serve.
                                </p>
                            </div>

                            {/* Storytelling - Takes 70% of right column height */}
                            <div className="bg-[url('/story.png')] bg-cover bg-center rounded-[50px] h-[70%] p-8 gap-6">
                                <div className="flex-1">
                                    <h3 className="text-2xl md:text-[50px] font-cormorant text-black mb-4">Storytelling</h3>
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                        We highlight powerful personal journeys from immigrant women across the globe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Impact Section */}
            <section className="px-4 py-16 md:py-20 md:mt-0 mt-[800px] bg-black text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-cormorant leading-tight mb-8">Our Impact</h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-16">Stories that spark change and build belonging</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Powerful Stories */}
                        <div className="text-center" ref={counter1.ref}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {Math.floor(counter1.count)}+
                            </h1>
                            <p className="text-lg text-gray-300">Powerful stories shared</p>
                        </div>

                        {/* Community Gatherings */}
                        <div className="text-center" ref={counter2.ref}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-4 bg-gradient-to-r from-white to-[#808080] bg-clip-text text-transparent">
                                {Math.floor(counter2.count)}+
                            </h1>
                            <p className="text-lg text-gray-300">Community Gathering</p>
                        </div>

                        {/* Brave Women */}
                        <div className="text-center" ref={counter3.ref}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-4 bg-gradient-to-r from-white to-[#808080] bg-clip-text text-transparent">
                                {Math.floor(counter3.count)}+
                            </h1>
                            <p className="text-lg text-gray-300">Brave Immigrant women</p>
                        </div>

                        {/* Real Partners */}
                        <div className="text-center" ref={counter4.ref}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-cormorant mb-4 bg-gradient-to-r from-white to-[#808080] bg-clip-text text-transparent">
                                {Math.floor(counter4.count)}+
                            </h1>
                            <p className="text-lg text-gray-300">Real Partners</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join the HIT Community Section */}
            <section className="px-4 py-16 md:py-20">
                <div className="max-w-[1536px] mx-auto">
                    <div className="bg-[url('/join1.png')] bg-cover bg-center rounded-[50px] p-12 md:p-16 text-center text-white">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-cormorant leading-tight mb-8">Join the HIT Community</h2>
                        <p className="text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
                            Get inspiring stories of immigrant women, meaningful community updates, and unique opportunities to
                            connect, learn, and grow all delivered straight to your inbox.
                        </p>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                const footer = document.getElementById('footer');
                                if (footer) {
                                    footer.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            size="lg" className="bg-white text-[#bf5925] hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                            Join Us
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
