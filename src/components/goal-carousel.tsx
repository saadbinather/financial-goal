"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GoalCarouselProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onUpdateAmount?: (goalId: string, newAmount: number) => void;
}

export function GoalCarousel({
  open,
  onOpenChange,
  goal,
  onUpdateAmount,
}: GoalCarouselProps) {
  const { t } = useLanguage();
  const [addAmount, setAddAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    const number = parseFloat(numericValue);
    if (!isNaN(number)) {
      return number.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return numericValue;
  };

  const handleAddAmount = async () => {
    if (!addAmount.trim()) {
      setError("Please enter an amount");
      return;
    }

    const amount = parseFloat(addAmount.replace(/[$,]/g, ""));
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > 1000000) {
      setError("Amount cannot exceed $1,000,000");
      return;
    }

    // Check if adding this amount would exceed the target
    const newTotal = goal.currentAmount + amount;
    if (newTotal > goal.targetAmount) {
      setError(
        `Cannot exceed target amount of ${formatCurrency(goal.targetAmount)}`
      );
      return;
    }

    setIsAdding(true);
    setError("");

    try {
      if (onUpdateAmount) {
        await onUpdateAmount(goal.id, newTotal);
      }
      setAddAmount("");
      onOpenChange(false); // Close the carousel after successful update
    } catch (error) {
      setError("Failed to update amount. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="relative pb-2">
          <DialogTitle className="text-center text-xl font-light text-gray-900">
            {goal.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Amount */}
          <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-700 text-base">
                {t("goal.currentAmount")}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(goal.currentAmount)}
            </p>
            {goal.currentAmount < goal.targetAmount && (
              <p className="text-sm text-gray-600 mt-1">
                {formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
                remaining
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div className="bg-white/60 p-4 rounded-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-gray-700 text-base">
                {t("goal.targetAmount")}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(goal.targetAmount)}
            </p>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (goal.currentAmount / goal.targetAmount) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Amount Section */}
          <div
            className={`p-4 rounded-lg backdrop-blur-sm border ${
              goal.currentAmount >= goal.targetAmount
                ? "bg-green-50/80 border-green-200/40"
                : "bg-gradient-to-br from-emerald-50/80 to-green-50/60 border-emerald-200/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {goal.currentAmount >= goal.targetAmount ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Plus className="w-5 h-5 text-emerald-600" />
              )}
              <span className="font-semibold text-gray-700 text-base">
                {goal.currentAmount >= goal.targetAmount
                  ? "Goal Complete!"
                  : t("button.addAmount")}
              </span>
            </div>
            <div className="space-y-3">
              {goal.currentAmount >= goal.targetAmount ? (
                <div className="text-center py-4">
                  <p className="text-green-600 font-semibold text-lg">
                    🎉 Congratulations! Goal completed!
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    You've reached your target amount of{" "}
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={t("placeholder.amount")}
                      value={addAmount}
                      onChange={(e) =>
                        setAddAmount(formatCurrencyInput(e.target.value))
                      }
                      className="pl-10 h-10 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 transition-colors"
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-xs flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {error}
                    </p>
                  )}
                  <Button
                    onClick={handleAddAmount}
                    disabled={isAdding || !addAmount.trim()}
                    className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding
                      ? `${t("button.addAmount")}...`
                      : t("button.addAmount")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6"
          >
            {t("button.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
