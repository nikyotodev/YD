"use client";
import { memo, useMemo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types/homepage";
export const TestimonialsSection = memo(function TestimonialsSection() {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        id: "testimonial-anna",
        avatar: "/memoji-anna.png",
        name: "Анна К.",
        role: "Студентка",
        text: "С YourDeutsch я подготовилась к экзамену B1 всего за 3 месяца! AI-помощник был как личный репетитор 24/7.",
        rating: 5,
      },
      {
        id: "testimonial-sergey",
        avatar: "/memoji-sergey.png",
        name: "Сергей М.",
        role: "IT-специалист",
        text: "Благодаря YourDeutsch я получил работу в немецкой компании. Особенно помогли уроки бизнес-немецкого.",
        rating: 5,
      },
      {
        id: "testimonial-maria",
        avatar: "/memoji-maria.png",
        name: "Мария Д.",
        role: "Переводчик",
        text: "Удобный интерфейс и методика обучения на высоте! Рекомендую всем, кто серьезно подходит к изучению немецкого.",
        rating: 5,
      },
    ],
    [],
  );
  return (
    <div className="mb-16 md:mb-24">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-black gradient-text mb-4">
          Что говорят наши студенты
        </h2>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          Истории успеха от людей, которые уже достигли своих целей с
          YourDeutsch
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="glass-card text-center group cursor-pointer transition-all hover:border-german-red/20 dark:hover:border-dark-theme-pink/30 hover:scale-[1.02]"
          >
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 md:w-36 md:h-36">
                <Image
                  src={testimonial.avatar}
                  alt={`Аватар ${testimonial.name}`}
                  width={144}
                  height={144}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
            <div className="flex justify-center mb-3">
              {Array.from({ length: testimonial.rating }, (_, i) => (
                <Star
                  key={`${testimonial.id}-star-${i}`}
                  className="h-4 w-4 md:h-5 md:w-5 text-german-gold fill-german-gold"
                />
              ))}
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed italic px-2">
              "{testimonial.text}"
            </p>
            <div className="border-t border-border/50 pt-4">
              <div className="font-semibold text-foreground mb-1">
                {testimonial.name}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
