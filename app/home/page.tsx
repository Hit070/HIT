"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "@/components/headeruser"
import Footer from "@/components/footer"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const storyNotifications = [
    {
      name: "Li Na shared her story",
      position: "top-2 left-4 md:-top-4 md:left-4",
      rotation: "rotate-[-5.58deg]",
      initial: "L",
    },
    {
      name: "Li Wei shared a story",
      position: "top-0 right-4 md:-top-6 md:right-4",
      rotation: "rotate-[5.58deg]",
      initial: "L",
    },
    {
      name: "Kavya shared her story",
      position: "top-8 left-1/2 transform -translate-x-1/2 md:-top-2 md:left-1/2 md:transform md:-translate-x-1/2",
      rotation: "rotate-[-4.07deg]",
      initial: "K",
    },
  ]

  const testimonials = [
    {
      quote:
        "HIT gave me a platform, but more importantly, it gave me courage. I finally believe my story matters.",
      name: "Ebere Chinemeye",
    },
    {
      quote: "When I felt unseen, HIT became my mirror, reflecting my strength back to me.",
      name: "Maria Rodriguez",
    },
    {
      quote:
        "Every story on HIT is like a lantern in the dark. It guided me when I couldn't see my next step.",
      name: "Aisha Patel",
    },
    {
      quote:
        "Her Immigrant Tales isn't just about storytelling — it's about healing and collective growth.",
      name: "Fatima Al-Zahra",
    },
    {
      quote:
        "I've read hundreds of stories on HIT, but they all remind me of one truth — we are stronger together.",
      name: "Lila Chen",
    },
    {
      quote: "This platform has created a safe space to tell the truth to family.",
      name: "Sofia Petrov",
    },
    {
      quote: "HIT showed me that my struggles weren't burdens, but bridges to connect with others.",
      name: "Priya Sharma",
    },
    {
      quote: "Through HIT, I learned that vulnerability is not weakness—it's the birthplace of courage.",
      name: "Amara Johnson",
    },
    {
      quote: "The stories here reminded me that home isn't just a place, it's a feeling we carry within.",
      name: "Zara Hassan",
    },
    {
      quote: "HIT taught me that my accent isn't a flaw, it's the melody of my heritage.",
      name: "Nina Kowalski",
    },
    {
      quote: "Every story I read here feels like a warm embrace from a sister I've never met.",
      name: "Rosa Martinez",
    },
    {
      quote: "HIT gave me permission to be proud of my journey, not just my destination.",
      name: "Kenji Tanaka",
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Background Frame Image with Blur Effects */}
      <div className="absolute top-0 left-0 w-full h-[150vh] z-0 overflow-hidden">
        <Image
          src="/gridlines.png"
          alt="Background frame"
          fill
          className="object-cover"
        />
        {/* Blur overlay for entire background */}
        <div className="absolute inset-0 bg-gradient-radial from-white/60 via-white/30 to-transparent"></div>
        {/* Circular blur behind header/text area */}
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[1200px] h-[600px] bg-white/50 rounded-full blur-[120px]"></div>
        {/* Bottom circular blur */}
        <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[1400px] h-[400px] bg-white/60 rounded-full blur-[100px]"></div>
      </div>


      {/* Main Content */}
      <main className="relative px-6 py-16">
        <div className="relative max-w-[1536px] mx-auto">
          <div className="absolute w-[587px] h-[740px] top-[142px] left-[427px] bg-app-primary rounded-[293.3px/369.87px] rotate-[-52.53deg] blur-[374.42px] opacity-[0.16]" />
          <div className="absolute inset-0 pointer-events-none">
            {storyNotifications.map((notification, index) => (
              <div
                key={index}
                className={`absolute ${notification.position} ${notification.rotation} pointer-events-auto z-50`}
              >
                <div className="inline-flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-[#ffffffe6] rounded-full border border-[#bbbbbb3d] shadow-[0px_0px_32px_#00000005] backdrop-blur-[10px] text-xs md:text-sm">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#bf5925] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                    {notification.initial}
                  </div>
                  <div className="pr-1 md:pr-2 font-normal text-[#161616] whitespace-nowrap">{notification.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Hero Section */}
          <div className="text-center py-16 relative z-10">
            <div className="absolute w-[587px] h-[740px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#bf5925] rounded-[293.3px/369.87px] rotate-[-52.53deg] blur-[374.42px] opacity-[0.16] -z-10" />

            <h1 className="text-5xl md:text-6xl font-cormorant text-[#353336] mb-6 leading-tight">
              Celebrating <span className="text-[#bf5925] italic">Immigrant Women</span>,
              <br />
              Amplifying their Voices & Stories
            </h1>
            <p className="text-lg text-[#353336] mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover powerful stories, connect with a vibrant community, and help us honor the voices of immigrant
              women everywhere.
            </p>
            <div className="flex items-center justify-center gap-4 mb-16">
              <Button
                variant="outline"
                className="border-[#bf5925] text-[#bf5925] hover:bg-[#bf5925] hover:text-white rounded-full px-8 py-3 bg-white"
              >
                Collaborate
              </Button>
              <Button className="bg-[#bf5925] hover:bg-[#bf5925]/90 text-white rounded-full px-8 py-3">Donate</Button>
            </div>

            <div className="relative">
              {/* Bottom notifications */}
              <div className="absolute left-4 -top-4 md:left-8 md:-top-8 rotate-[3.38deg] pointer-events-auto z-50">
                <div className="inline-flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-[#ffffffe6] rounded-full border border-[#bbbbbb3d] shadow-[0px_0px_32px_#00000005] backdrop-blur-[10px] text-xs md:text-sm">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#bf5925] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                    M
                  </div>
                  <div className="pr-1 md:pr-2 font-normal text-[#161616] whitespace-nowrap">
                    Mwangi shared her story
                  </div>
                </div>
              </div>

              <div className="absolute right-4 -top-0 md:right-16 md:-top-4 rotate-[-3.38deg] pointer-events-auto z-50">
                <div className="inline-flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-[#ffffffe6] rounded-full border border-[#bbbbbb3d] shadow-[0px_0px_32px_#00000005] backdrop-blur-[10px] text-xs md:text-sm">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#bf5925] rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                    B
                  </div>
                  <div className="pr-1 md:pr-2 font-normal text-[#161616] whitespace-nowrap">
                    Beatriz shared her story
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid md:grid-cols-2 gap-6 max-w-[1536px] mx-auto mt-24">
            {/* Left Image with Quote */}
            <div className="relative">
              <div className="rounded-[50px] overflow-hidden">
                <Image
                  src="/hero1.png"
                  alt="Diverse women celebrating together"
                  width={600}
                  height={400}
                  className="w-full h-[500px] object-cover bg-cover bg-center"
                />
              </div>
              <div className="absolute bottom-6 md:left-6 left-6 md:right-0 right-6 bg-white rounded-[50px] p-6 max-w-sm">
                <div className="text-[#bf5925] text-4xl mb-2">"</div>
                <p className="text-[#353336] text-md mb-4">
                  I arrived with two suitcases and no job. Today, I run my own catering business feeding other...
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image src="/woman-profile.png" alt="Testimonial author" width={32} height={32} />
                  </div>
                  <span className="text-sm text-[#353336]">xxx</span>
                </div>
              </div>
            </div>

            {/* Right Image with Stats */}
            <div className="relative">
              <div className="rounded-[50px] overflow-hidden">
                <Image
                  src="/hero2.png"
                  alt="Three diverse women smiling"
                  width={600}
                  height={400}
                  className="w-full h-[500px] object-cover bg-cover bg-center"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-tl-[50px] p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-[#353336] mb-2">500+</h1>
                    <div className="text-sm text-[#5c5c5c]">Powerful stories shared</div>
                  </div>
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-[#353336] mb-2">100+</h1>
                    <div className="text-sm text-[#5c5c5c]">Brave Immigrant women</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Who We Are Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1536px] mx-auto">
          {/* Header Content */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cormorant text-[#353336] mb-6">Who We Are</h2>
            <p className="text-lg text-[#353336] max-w-4xl mx-auto leading-relaxed mb-8">
              Her Immigrant Tales (HIT) is a storytelling platform amplifying the voices of immigrant women worldwide.
              We celebrate their resilience, honor their journeys, and build a community rooted in trust, truth, and
              shared humanity.
            </p>
            <Button className="bg-[#bf5925] hover:bg-[#bf5925]/90 text-white rounded-full px-8 py-6 inline-flex items-center gap-2">
              Learn more
              <ArrowRight className="w-16 h-16" />
            </Button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Large Image with Overlay */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/diverse-women-celebrating-together-at-community-ev.jpg"
                  alt="Three diverse women laughing together"
                  width={600}
                  height={600}
                  className="w-full h-[600px] object-cover bg-cover bg-center"
                />
              </div>
              {/* Overlay notification */}
              <div className="absolute bottom-6 left-4 right-4 md:left-40 lg:left-40 md:right-auto">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 max-w-sm md:max-w-lg mx-auto"> {/* Added mx-auto to center the container */}
                  <div className="space-y-3">
                    <div className="flex -space-x-2 justify-center"> {/* Added justify-center to center the images */}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-3 border-white bg-white z-30">
                        <Image
                          src="/woman-profile.png"
                          alt="Profile 1"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover bg-cover bg-center"
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-3 border-white bg-white z-20">
                        <Image
                          src="/asian-woman-profile.png"
                          alt="Profile 2"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover bg-cover bg-center"
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden border-3 border-white bg-white z-10">
                        <Image
                          src="/asian-woman-profile.png"
                          alt="Profile 3"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover bg-cover bg-center"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#353336] text-sm font-medium md:mr-2">With 100+ immigrant women stories</span>
                      <Button className="bg-[#bf5925] hover:bg-[#bf5925]/90 text-white rounded-full px-4 py-2 text-sm whitespace-nowrap">
                        Share yours
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Three Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {/* Top Left Image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/asian-woman-profile.png"
                  alt="Woman in traditional dress"
                  width={400}
                  height={180}
                  className="w-full h-[180px] object-cover bg-cover bg-center"
                />
              </div>

              {/* Top Right Image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/three-diverse-women-smiling-together-portrait.jpg"
                  alt="Three women celebrating"
                  width={400}
                  height={180}
                  className="w-full h-[180px] object-cover bg-cover bg-center"
                />
              </div>

              {/* Bottom Full Width Image */}
              <div className="sm:col-span-2 rounded-3xl overflow-hidden">
                <Image
                  src="/globe.png"
                  alt="Immigrant Women Across the Globe"
                  width={400}
                  height={390}
                  className="w-full h-[390px] object-cover bg-cover bg-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="bg-black py-16 px-6">
        <div className="max-w-[1536px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="rounded-3xl overflow-hidden">
              <Image
                src="three-diverse-women-smiling-together-portrait.jpg"
                alt="Smiling woman in colorful traditional dress on city street"
                width={600}
                height={400}
                className="w-full h-[400px] lg:h-[500px] object-cover bg-cover bg-center"
              />
            </div>

            {/* Right Side - Content */}
            <div className="text-white">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-white text-sm font-medium">Featured Story</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-cormorant text-white mb-6 leading-tight">
                Finding Home in a New Land
              </h2>

              <p className="text-white/80 text-lg mb-2">by Zhang Mei</p>

              <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-lg">
                When I arrived in Toronto, I spoke little English and knew no one. Sharing my story helped me find a
                community that feels like family.
              </p>

              <Button className="bg-white text-[#353336] hover:bg-white/90 rounded-full px-8 py-6 inline-flex items-center gap-2 font-medium">
                Read full story
                <ArrowRight className="w-16 h-16" />

              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Community Says Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-[1536px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cormorant text-[#353336] mb-6">What Our Community Says</h2>
            <p className="text-lg text-[#353336] max-w-4xl mx-auto leading-relaxed">
              From women who have shared their journeys to those who have found strength in them, these voices show how
              Her Immigrant Tales is building trust, inspiring hope, and creating a true sense of belonging.
            </p>
          </div>

          {/* Testimonials Carousel with blur overlay */}
          <div className="relative h-[600px] overflow-hidden">
            {/* Blur gradient overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="h-full w-full bg-gradient-to-t from-white via-transparent to-white opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-white opacity-40"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
              {(() => {

                type Testimonial = {
                  quote: string;
                  name: string;
                };
                const columns: Testimonial[][] = [[], [], [], []];
                testimonials.forEach((testimonial: Testimonial, index) => {
                  columns[index % 4].push(testimonial);
                });


                const animationClasses = [
                  "animate-scroll-up",
                  "animate-scroll-up-delay-1",
                  "animate-scroll-up-delay-2",
                  "animate-scroll-up-delay-3",
                ]

                return columns.map((column, columnIndex) => (
                  <div key={columnIndex} className={`flex flex-col space-y-6 ${animationClasses[columnIndex]}`}>
                    {/* Triple the testimonials to ensure seamless loop */}
                    {[...column, ...column, ...column].map((testimonial, index) => (
                      <div
                        key={`${columnIndex}-${index}`}
                        className="bg-white rounded-2xl p-6 border border-gray-100 flex-shrink-0"
                      >
                        <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#bf5925] flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{testimonial.name.charAt(0)}</span>
                          </div>
                          <span className="text-gray-600 font-medium">{testimonial.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-up {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-33.333%);
            }
          }

          .animate-scroll-up {
            animation: scroll-up 15s linear infinite; 
          }

          .animate-scroll-up-delay-1 {
            animation: scroll-up 15s linear infinite; 
            animation-delay: -3.75s; 
          }

          .animate-scroll-up-delay-2 {
            animation: scroll-up 15s linear infinite; 
            animation-delay: -7.5s;
          }

          .animate-scroll-up-delay-3 {
            animation: scroll-up 15s linear infinite;
            animation-delay: -11.25s;
          }
        `}</style>
      </section>

      {/* Join the HIT Community Section */}
      <section className="bg-white pt-16 px-6">
        <div className="max-w-[1536px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Orange Content Area */}
            <div className="bg-[url('/join.png')] bg-cover bg-center rounded-[2rem] p-8 lg:p-10 text-white h-[520px] flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-cormorant mb-4 leading-tight">Join the HIT Community</h2>
              <p className="text-base mb-6 leading-relaxed opacity-95">
                Get inspiring stories of immigrant women, meaningful community updates, and unique opportunities to
                connect, learn, and grow - all delivered straight to your inbox.
              </p>
              <Button className="bg-white text-[#bf5925] hover:bg-gray-50 rounded-full px-8 py-3 font-medium w-fit">
                Join Us
              </Button>
            </div>

            {/* Right Side - 2x2 Photo Grid */}
            <div className="grid grid-cols-2 gap-4 h-[520px] md:max-w-[80%] md:ml-10 ml-0 md:gap-8 relative">
              {/* Top Row */}
              <div className="rounded-[50px] overflow-hidden">
                <Image
                  src="/woman-green-top.jpg"
                  alt="Asian woman in professional attire with colorful scarf"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover bg-cover bg-center"
                />
              </div>
              <div className="rounded-[50px] overflow-hidden transform md:-rotate-[25deg] md:translate-y-4 md:scale-80">
                <Image
                  src="/woman-golden-outfit.jpg"
                  alt="Woman in golden bronze colored clothing"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover bg-cover bg-center"
                />
              </div>

              {/* Bottom Row */}
              <div className="rounded-[50px] overflow-hidden">
                <Image
                  src="/woman-green-top.jpg"
                  alt="Woman in green top"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover bg-cover bg-center"
                />
              </div>
              <div className="rounded-[50px] overflow-hidden">
                <Image
                  src="/woman-blue-denim.jpg"
                  alt="Woman in blue denim shirt"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover bg-cover bg-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIT TALES text section */}
      <section className="bg-[#f5f5f5] px-1 overflow-hidden">
        <div className="w-full mx-auto text-center relative overflow-hidden">
          <h2 className="text-[5rem] md:text-[16rem] lg:text-[18rem] font-cormorant text-[#353336] opacity-20 tracking-widest leading-none select-none pointer-events-none overflow-hidden">
            HIT Tales
          </h2>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
