"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const bannerSlides = [
  {
    id: 1,
    title: "智慧仓储 · 资源共享",
    subtitle: "打造中铁物资循环物资平台仓储基地",
    description: "整合全国仓储资源，提供一站式仓储出租、委托运营、智能匹配服务",
    image: "linear-gradient(135deg, oklch(0.45 0.15 250) 0%, oklch(0.35 0.12 270) 100%)",
  },
  {
    id: 2,
    title: "物资托管 · 专业运营",
    subtitle: "让闲置物资创造更大价值",
    description: "分成模式、整租模式灵活选择，专业团队全程运营管理",
    image: "linear-gradient(135deg, oklch(0.55 0.18 145) 0%, oklch(0.45 0.15 160) 100%)",
  },
  {
    id: 3,
    title: "智能寻租 · 精准匹配",
    subtitle: "基于大数据的仓储资源智能推荐",
    description: "输入需求，系统自动匹配最优仓储站点，实现快速寻租",
    image: "linear-gradient(135deg, oklch(0.5 0.12 200) 0%, oklch(0.4 0.1 220) 100%)",
  },
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying, nextSlide])

  return (
    <section
      className="relative w-full h-[400px] overflow-hidden rounded-xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full shrink-0 relative"
            style={{ background: slide.image }}
          >
            <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
              <span className="text-sm font-medium mb-2 opacity-90">{slide.subtitle}</span>
              <h1 className="text-4xl font-bold mb-4 text-balance">{slide.title}</h1>
              <p className="text-lg opacity-90 max-w-xl text-pretty">{slide.description}</p>
              <div className="mt-6 flex gap-4">
                <Button size="lg" className="bg-white text-foreground hover:bg-white/90">
                  立即体验
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  了解更多
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  )
}
