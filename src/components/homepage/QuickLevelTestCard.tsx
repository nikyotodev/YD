"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Clock, Target, Star, Zap } from "lucide-react";
import Link from "next/link";
interface QuickLevelTestCardProps {
  className?: string;
}
export function QuickLevelTestCard({
  className = "",
}: QuickLevelTestCardProps) {
  return (
    <Card
      className={`glass-card group cursor-pointer transition-all hover:scale-[1.02] border border-white/10 ${className}`}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="glass p-2 bg-gradient-to-br from-german-red/20 to-german-gold/20 rounded-lg">
              <Brain className="h-5 w-5 text-german-red dark:text-dark-theme-pink" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Тест уровня</h3>
              <p className="text-xs text-muted-foreground">
                Узнайте свой уровень за 5 минут
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="glass">
            A1-C2
          </Badge>
        </div>
        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <Clock className="h-4 w-4 text-german-gold mx-auto mb-1" />
            <p className="text-xs font-medium">5 мин</p>
          </div>
          <div className="text-center">
            <Target className="h-4 w-4 text-german-red dark:text-dark-theme-pink mx-auto mb-1" />
            <p className="text-xs font-medium">95% точность</p>
          </div>
          <div className="text-center">
            <Zap className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs font-medium">AI оценка</p>
          </div>
        </div>
        {/* CTA */}
        <Link href="/level-test" className="block">
          <Button
            variant="german"
            size="sm"
            className="w-full group-hover:scale-105 transition-transform"
          >
            Пройти тест
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        {/* Social proof */}
        <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
          <Star className="h-3 w-3 text-german-gold mr-1" />
          <span>2,500+ студентов прошли тест</span>
        </div>
      </CardContent>
    </Card>
  );
}
