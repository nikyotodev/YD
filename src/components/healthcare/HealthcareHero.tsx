"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export function HealthcareHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with medical image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 z-10" />
        <Image
          src="https://ugc.same-assets.com/R15PaE2qpRdjp4rJVDo80nFsgffq9hiz.jpeg"
          alt="German healthcare doctor consultation"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float animation-delay-2000" />
      </div>
      <div className="relative z-30 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Badge
              variant="secondary"
              className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium"
            >
              <Heart className="h-4 w-4 mr-2" />
              Немецкая система здравоохранения
            </Badge>
          </motion.div>
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            Медицинская помощь{" "}
            <span className="relative">
              <span className="relative z-10">мирового уровня</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-primary/70 transform -skew-x-12 z-0" />
            </span>
          </motion.h1>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Узнайте всё о немецкой системе здравоохранения: страхование, поиск врачей,
            экстренная помощь и качественное медицинское обслуживание для жизни в Германии
          </motion.p>
          {/* Key points */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-white/80"
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-accent" />
              Обязательное страхование
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2 text-accent" />
              Качественная медицина
            </div>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-accent" />
              Доступная помощь 24/7
            </div>
          </motion.div>
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold group"
            >
              <Link href="#healthcare-system">
                Изучить систему
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/80 bg-white/10 text-white px-8 py-3 text-lg font-semibold backdrop-blur-sm"
            >
              <Link href="#healthcare-insurance">
                Про страхование
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
