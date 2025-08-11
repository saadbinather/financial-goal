"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoalCarousel } from "@/components/goal-carousel";
import {
  Edit3,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Sparkles,
  Plus,
  Zap,
  Star,
  Award,
} from "lucide-react";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    description: string;
    type: string;
    startDate: string;
    deadline: string;
    targetAmount: number;
    currentAmount: number;
    status: "to-do" | "in-progress" | "done";
    category: string;
    createdAt: Date;
  };
  onEditGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onMarkComplete: (goalId: string) => void;
  onUpdateAmount?: (goalId: string, newAmount: number) => void;
}

export function GoalCard({
  goal,
  onEditGoal,
  onDeleteGoal,
  onMarkComplete,
  onUpdateAmount,
}: GoalCardProps) {
  const [carouselOpen, setCarouselOpen] = useState(false);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusConfig = (status: GoalCardProps["goal"]["status"]) => {
    switch (status) {
      case "to-do":
        return {
          bg: "bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-100/40 backdrop-blur-sm",
          border: "border-slate-200/40",
          accent: "from-slate-600 via-slate-500 to-slate-400",
          icon: <Clock className="w-4 h-4" />,
          progress: "from-slate-500 via-slate-400 to-slate-300",
          badge:
            "bg-slate-100/80 text-slate-700 border-slate-200/60 backdrop-blur-sm",
          glow: "shadow-slate-500/20",
          pulse: "animate-pulse",
        };
      case "in-progress":
        return {
          bg: "bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 backdrop-blur-sm",
          border: "border-blue-200/40",
          accent: "from-blue-600 via-indigo-500 to-purple-400",
          icon: <TrendingUp className="w-4 h-4" />,
          progress: "from-blue-500 via-indigo-400 to-purple-300",
          badge:
            "bg-blue-100/80 text-blue-700 border-blue-200/60 backdrop-blur-sm",
          glow: "shadow-blue-500/20",
          pulse: "",
        };
      case "done":
        return {
          bg: "bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/40 backdrop-blur-sm",
          border: "border-emerald-200/40",
          accent: "from-emerald-600 via-green-500 to-teal-400",
          icon: <CheckCircle2 className="w-4 h-4" />,
          progress: "from-emerald-500 via-green-400 to-teal-300",
          badge:
            "bg-emerald-100/80 text-emerald-700 border-emerald-200/60 backdrop-blur-sm",
          glow: "shadow-emerald-500/20",
          pulse: "",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-100/40 backdrop-blur-sm",
          border: "border-gray-200/40",
          accent: "from-gray-600 via-gray-500 to-gray-400",
          icon: <Target className="w-4 h-4" />,
          progress: "from-gray-500 via-gray-400 to-gray-300",
          badge:
            "bg-gray-100/80 text-gray-700 border-gray-200/60 backdrop-blur-sm",
          glow: "shadow-gray-500/20",
          pulse: "",
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const daysRemaining = getDaysRemaining(goal.deadline);
  const isOverdue = daysRemaining < 0;
  const statusConfig = getStatusConfig(goal.status);

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] ${
        statusConfig.bg
      } ${
        statusConfig.border
      } border backdrop-blur-sm shadow-lg hover:shadow-2xl ${
        statusConfig.glow
      } hover:${statusConfig.glow.replace("/20", "/40")}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none animate-pulse" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/15 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Status indicator line with glow */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusConfig.accent} shadow-lg`}
      />

      {/* Action Buttons - Only show if goal is not completed */}
      {goal.currentAmount < goal.targetAmount && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {/* Edit Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 bg-white/80 hover:bg-white/95 backdrop-blur-sm border border-white/20 text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:rotate-3 transform-gpu group/edit"
            onClick={() => onEditGoal(goal.id)}
          >
            <Edit3 className="w-4 h-4 group-hover/edit:scale-110 transition-transform duration-300" />
          </Button>

          {/* Plus Button */}
          <Button
            className="w-8 h-8 bg-emerald-600/90 hover:bg-emerald-700/95 backdrop-blur-sm border border-emerald-500/20 text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:-rotate-3 transform-gpu group/plus"
            onClick={() => setCarouselOpen(true)}
          >
            <Plus className="w-4 h-4 group-hover/plus:rotate-90 group-hover/plus:scale-110 transition-all duration-300" />
          </Button>
        </div>
      )}

      {/* Delete Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 bg-red-500/90 hover:bg-red-600/95 backdrop-blur-sm border border-red-400/20 text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 hover:rotate-3 transform-gpu group/delete"
          onClick={() => onDeleteGoal(goal.id)}
        >
          <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-300" />
        </Button>
      </div>

      {/* Achievement badge for completed goals */}
      {goal.status === "done" && (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/90 to-orange-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-bounce">
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-br ${statusConfig.accent} text-white shadow-lg border border-white/20 ${statusConfig.pulse}`}
              >
                {statusConfig.icon}
              </div>
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.badge} shadow-sm backdrop-blur-sm`}
              >
                {goal.status.replace("-", " ").toUpperCase()}
              </div>
              {progress >= 100 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full border border-yellow-300/30">
                  <Star className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-bold text-yellow-700">
                    COMPLETE
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-3 leading-tight group-hover:text-gray-800 transition-colors">
              {goal.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors">
              {goal.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Enhanced Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Progress
            </span>
            <span className="text-lg font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="relative">
            <div className="w-full h-3 bg-gray-200/40 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full bg-gradient-to-r ${statusConfig.progress} rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden`}
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 mt-3">
              <span className="bg-white/60 px-2 py-1 rounded-md backdrop-blur-sm">
                {formatCurrency(goal.currentAmount)}
              </span>
              <span className="bg-white/60 px-2 py-1 rounded-md backdrop-blur-sm">
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Goal Details */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-gray-600 bg-white/40 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">
              Due: {formatDate(goal.deadline)}
            </span>
            {isOverdue && (
              <span className="text-red-600 font-bold text-xs bg-red-100/80 px-3 py-1 rounded-full border border-red-200/60 backdrop-blur-sm animate-pulse">
                {Math.abs(daysRemaining)} days overdue
              </span>
            )}
            {!isOverdue && daysRemaining <= 30 && (
              <span className="text-amber-600 font-bold text-xs bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200/60 backdrop-blur-sm">
                {daysRemaining} days left
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-gray-600 bg-white/40 p-3 rounded-xl backdrop-blur-sm border border-white/20">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="font-semibold">{goal.category}</span>
          </div>
        </div>

        {/* Enhanced sparkle effect for completed goals */}
        {goal.status === "done" && (
          <div className="absolute top-4 right-16 opacity-80 animate-pulse">
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
        )}
      </CardContent>

      {/* Goal Carousel Modal */}
      <GoalCarousel
        open={carouselOpen}
        onOpenChange={setCarouselOpen}
        goal={goal}
        onUpdateAmount={onUpdateAmount}
      />
    </Card>
  );
}
