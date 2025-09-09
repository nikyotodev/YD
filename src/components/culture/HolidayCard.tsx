"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { HolidayData } from "@/data/holidays";

interface HolidayCardProps {
  holiday: HolidayData;
  onClick: () => void;
}

export function HolidayCard({ holiday, onClick }: HolidayCardProps) {
  return (
    <Card
      className="group relative h-80 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-center bg-cover transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundImage: holiday.style.fallback
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {holiday.type === 'religious' && '🙏 Религиозный'}
            {holiday.type === 'cultural' && '🎭 Культурный'}
            {holiday.type === 'national' && '🇩🇪 Национальный'}
            {holiday.type === 'regional' && '🏘️ Региональный'}
          </Badge>
          {holiday.region && (
            <Badge variant="outline" className="border-white/30 text-white">
              <MapPin className="w-3 h-3 mr-1" />
              {holiday.region}
            </Badge>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
          {holiday.germanName}
        </h3>
        <p className="text-lg opacity-90 mb-2">{holiday.name}</p>

        <div className="flex items-center gap-4 text-sm opacity-80 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {holiday.date}
          </div>
        </div>

        <p className="text-sm opacity-90 mb-4 line-clamp-2">
          {holiday.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Sparkles className="w-4 h-4" />
            {holiday.traditions.length} традиций
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Подробнее
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
