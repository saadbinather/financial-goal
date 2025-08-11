"use client";

import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import LanguageSelector from "./language-selector";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  onAddGoal: () => void;
}

export function Header({ onAddGoal }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('app.title')}
              </h1>
              <p className="text-sm text-gray-500">
                Track your progress, achieve your dreams
              </p>
            </div>
          </div>

          {/* Right side - Language Selector and Add Goal Button */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button
              onClick={onAddGoal}
              className="bg-yellow-400 hover:bg-yellow-600 text-white border-0 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('add.goal')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
