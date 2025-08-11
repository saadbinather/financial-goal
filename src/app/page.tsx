"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, HelpCircle } from "lucide-react";
import { AddGoalModal } from "@/components/add-goal-modal";
import { EditGoalModal } from "@/components/edit-goal-modal";
import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Goal {
  id: string;
  name: string;
  description: string;
  type: string;
  startDate: string;
  deadline: string;
  checkInPerson: string;
  checkInEmail: string;
  targetAmount: number;
  currentAmount: number;
  status: "to-do" | "in-progress" | "done";
  category: string;
  createdAt: Date;
}

export default function Home() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Monitor current amount changes and update status automatically
  useEffect(() => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        // If current amount changed from 0 (first time), move to "to-do"
        if (goal.currentAmount > 0 && goal.status === "to-do") {
          return { ...goal, status: "in-progress" };
        }

        // If current amount equals or exceeds target amount, move to "done"
        if (goal.currentAmount >= goal.targetAmount && goal.status !== "done") {
          return { ...goal, status: "done" };
        }

        return goal;
      })
    );
  }, [goals.map((goal) => goal.currentAmount).join(",")]);

  const addGoal = (goalData: {
    name: string;
    description: string;
    type: string;
    startDate: string;
    deadline: string;
    checkInPerson: string;
    checkInEmail: string;
    targetAmount?: number;
    category?: string;
  }) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      status: "to-do",
      targetAmount: goalData.targetAmount || 1000,
      currentAmount: 0,
      category: goalData.category || goalData.type,
      createdAt: new Date(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const getGoalsByStatus = (status: Goal["status"]) => {
    return goals.filter((goal) => goal.status === status);
  };

  const handleEditGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateGoal = (goalId: string, updatedGoal: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            name: updatedGoal.name || goal.name,
            description: updatedGoal.description || goal.description,
            category: updatedGoal.category || goal.category,
            deadline: updatedGoal.deadline || goal.deadline,
            targetAmount: updatedGoal.targetAmount || goal.targetAmount,
            currentAmount: updatedGoal.currentAmount || goal.currentAmount,
            status: updatedGoal.status || goal.status,
          };
        }
        return goal;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const handleMarkComplete = (goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, status: "done" } : goal
      )
    );
  };

  const handleUpdateAmount = (goalId: string, newAmount: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, currentAmount: newAmount } : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onAddGoal={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* TO DO Column */}
          <div className="flex flex-col">
            <div className="bg-red-500 text-white font-bold text-lg px-4 py-3 rounded-t-xl">
              {t("status.todo")}
            </div>
            <Card className="flex-1 rounded-t-none border-0 shadow-lg">
              <CardContent className="p-4 min-h-[200px] bg-white rounded-b-xl">
                {getGoalsByStatus("to-do").length === 0 ? (
                  <div className="text-gray-400 text-center mt-8">
                    {t("message.noGoals")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getGoalsByStatus("to-do").map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 bg-red-50 rounded-lg border border-red-200"
                      >
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {goal.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* IN PROGRESS Column */}
          <div className="flex flex-col">
            <div className="bg-yellow-500 text-white font-bold text-lg px-4 py-3 rounded-t-xl">
              {t("status.inprogress")}
            </div>
            <Card className="flex-1 rounded-t-none border-0 shadow-lg">
              <CardContent className="p-4 min-h-[200px] bg-white rounded-b-xl">
                {getGoalsByStatus("in-progress").length === 0 ? (
                  <div className="text-gray-400 text-center mt-8">
                    {t("message.noGoals")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getGoalsByStatus("in-progress").map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {goal.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* DONE Column */}
          <div className="flex flex-col">
            <div className="bg-green-600 text-white font-bold text-lg px-4 py-3 rounded-t-xl">
              {t("status.done")}
            </div>
            <Card className="flex-1 rounded-t-none border-0 shadow-lg">
              <CardContent className="p-4 min-h-[200px] bg-white rounded-b-xl">
                {getGoalsByStatus("done").length === 0 ? (
                  <div className="text-gray-400 text-center mt-8">
                    {t("message.noGoals")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getGoalsByStatus("done").map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {goal.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard */}
        <Dashboard
          goals={goals}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoal}
          onMarkComplete={handleMarkComplete}
          onUpdateAmount={handleUpdateAmount}
        />

        {/* Bottom Help Section */}
        <div className="flex items-center gap-4 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 rounded-xl"
          >
            {t("button.help")}
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 rounded-xl"
          >
            {t("button.disclaimer")}
          </Button>
        </div>
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddTask={addGoal}
      />

      {/* Edit Goal Modal */}
      <EditGoalModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        goal={selectedGoal}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
}
