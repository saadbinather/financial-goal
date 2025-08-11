"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Target,
  Calendar,
  DollarSign,
  Filter,
  Search,
  SortAsc,
} from "lucide-react";
import { GoalCard } from "@/components/goal-card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Goal {
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
}

interface DashboardProps {
  goals: Goal[];
  onEditGoal: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onMarkComplete: (goalId: string) => void;
  onUpdateAmount?: (goalId: string, newAmount: number) => void;
}

export function Dashboard({
  goals,
  onEditGoal,
  onDeleteGoal,
  onMarkComplete,
  onUpdateAmount,
}: DashboardProps) {
  const { t } = useLanguage();
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>(goals);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter and sort goals
  useEffect(() => {
    let filtered = goals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (goal) =>
          goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((goal) => goal.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((goal) => goal.status === statusFilter);
    }

    // Sort goals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "amount":
          return b.targetAmount - a.targetAmount;
        case "progress":
          return (
            b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredGoals(filtered);
  }, [goals, searchTerm, sortBy, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("dashboard")}
          </h2>
          <p className="text-gray-600 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredGoals.length} of {goals.length} goals
          </span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("placeholder.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("placeholder.sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">{t("sort.deadline")}</SelectItem>
              <SelectItem value="amount">{t("sort.amount")}</SelectItem>
              <SelectItem value="progress">{t("sort.progress")}</SelectItem>
              <SelectItem value="name">{t("sort.name")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("placeholder.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("category.all")}</SelectItem>
              <SelectItem value="personal">{t("category.personal")}</SelectItem>
              <SelectItem value="work">{t("category.work")}</SelectItem>
              <SelectItem value="financial">
                {t("category.financial")}
              </SelectItem>
              <SelectItem value="health">{t("category.health")}</SelectItem>
              <SelectItem value="education">
                {t("category.education")}
              </SelectItem>
              <SelectItem value="other">{t("category.other")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Target className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("placeholder.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("sort.all")}</SelectItem>
              <SelectItem value="to-do">{t("status.todo")}</SelectItem>
              <SelectItem value="in-progress">
                {t("status.inprogress")}
              </SelectItem>
              <SelectItem value="done">{t("status.done")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEditGoal={onEditGoal}
            onDeleteGoal={onDeleteGoal}
            onMarkComplete={onMarkComplete}
            onUpdateAmount={onUpdateAmount}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("message.noGoalsFound")}
          </h3>
          <p className="text-gray-600">
            {goals.length === 0
              ? t("message.createFirstGoal")
              : t("message.adjustFilters")}
          </p>
        </div>
      )}
    </div>
  );
}
