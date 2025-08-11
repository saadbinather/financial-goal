"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  DollarSign,
  Loader2,
  X,
  Edit3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
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

interface EditGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onUpdateGoal: (goalId: string, updatedGoal: Partial<Goal>) => void;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  deadline: string;
  targetAmount: string;
  currentAmount: string;
  status: "to-do" | "in-progress" | "done";
}

interface FormErrors {
  name?: string;
  targetAmount?: string;
  currentAmount?: string;
  deadline?: string;
  category?: string;
}

export function EditGoalModal({
  open,
  onOpenChange,
  goal,
  onUpdateGoal,
}: EditGoalModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    deadline: "",
    targetAmount: "",
    currentAmount: "",
    status: "to-do",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes or goal changes
  useEffect(() => {
    if (open && goal) {
      setFormData({
        name: goal.name,
        description: goal.description,
        category: goal.category,
        deadline: goal.deadline,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        status: goal.status,
      });
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [open, goal]);

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    // Name validation
    if (touched.name) {
      if (!formData.name.trim()) {
        newErrors.name = "Goal name is required";
      } else if (formData.name.length < 3) {
        newErrors.name = "Goal name must be at least 3 characters";
      } else if (formData.name.length > 50) {
        newErrors.name = "Goal name must be less than 50 characters";
      }
    }

    // Target Amount validation
    if (touched.targetAmount) {
      if (!formData.targetAmount.trim()) {
        newErrors.targetAmount = "Target amount is required";
      } else {
        const amount = parseFloat(formData.targetAmount.replace(/[$,]/g, ""));
        if (isNaN(amount) || amount <= 0) {
          newErrors.targetAmount = "Please enter a valid amount";
        } else if (amount > 1000000) {
          newErrors.targetAmount = "Amount cannot exceed $1,000,000";
        }
      }
    }

    // Current Amount validation
    if (touched.currentAmount) {
      if (!formData.currentAmount.trim()) {
        newErrors.currentAmount = "Current amount is required";
      } else {
        const currentAmount = parseFloat(
          formData.currentAmount.replace(/[$,]/g, "")
        );
        if (isNaN(currentAmount) || currentAmount < 0) {
          newErrors.currentAmount = "Please enter a valid amount";
        } else if (currentAmount > 1000000) {
          newErrors.currentAmount = "Amount cannot exceed $1,000,000";
        }
      }
    }

    // Deadline validation
    if (touched.deadline) {
      if (!formData.deadline) {
        newErrors.deadline = "Deadline is required";
      } else {
        const selectedDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.deadline = "Deadline cannot be in the past";
        }
      }
    }

    // Category validation
    if (touched.category) {
      if (!formData.category) {
        newErrors.category = "Please select a category";
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const formatCurrency = (value: string) => {
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

  const handleAmountChange = (
    field: "targetAmount" | "currentAmount",
    value: string
  ) => {
    const formatted = formatCurrency(value);
    handleInputChange(field, formatted);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.targetAmount.trim() &&
      formData.currentAmount.trim() &&
      formData.deadline &&
      formData.category &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      targetAmount: true,
      currentAmount: true,
      deadline: true,
      category: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!isFormValid() || !goal) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const targetAmount = parseFloat(
        formData.targetAmount.replace(/[$,]/g, "")
      );
      const currentAmount = parseFloat(
        formData.currentAmount.replace(/[$,]/g, "")
      );

      onUpdateGoal(goal.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        deadline: formData.deadline,
        targetAmount,
        currentAmount,
        status: formData.status,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="relative pb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
          </div>

          <DialogTitle className="text-center text-2xl font-light text-gray-900 mb-3">
            {t("button.edit")} {t("goal.name")}
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm leading-relaxed">
            {t("message.updateGoalDetails")}
          </p>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("goal.name")}
              </label>
              <Input
                placeholder={t("placeholder.name")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors ${
                  errors.name ? "border-red-300 bg-red-50" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("goal.description")}
              </label>
              <Textarea
                placeholder={t("placeholder.description")}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors min-h-[100px] resize-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("goal.category")}
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={`h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors ${
                    errors.category ? "border-red-300 bg-red-50" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">
                    {t("category.personal")}
                  </SelectItem>
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
              {errors.category && (
                <p className="text-red-600 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("goal.deadline")}
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    handleInputChange("deadline", e.target.value)
                  }
                  className={`h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors ${
                    errors.deadline ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.deadline && (
                <p className="text-red-600 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.deadline}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("goal.targetAmount")}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("placeholder.amount")}
                    value={formData.targetAmount}
                    onChange={(e) =>
                      handleAmountChange("targetAmount", e.target.value)
                    }
                    className={`pl-10 h-11 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-colors ${
                      errors.targetAmount ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.targetAmount && (
                  <p className="text-red-600 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.targetAmount}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {t("progress.title")}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {(() => {
                    const current =
                      parseFloat(formData.currentAmount.replace(/[$,]/g, "")) ||
                      0;
                    const target =
                      parseFloat(formData.targetAmount.replace(/[$,]/g, "")) ||
                      0;
                    if (target === 0) return "0.0%";
                    return (
                      Math.min((current / target) * 100, 100).toFixed(1) + "%"
                    );
                  })()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(() => {
                      const current =
                        parseFloat(
                          formData.currentAmount.replace(/[$,]/g, "")
                        ) || 0;
                      const target =
                        parseFloat(
                          formData.targetAmount.replace(/[$,]/g, "")
                        ) || 0;
                      if (target === 0) return "0%";
                      return Math.min((current / target) * 100, 100) + "%";
                    })()}`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                <span>
                  $
                  {(
                    parseFloat(formData.currentAmount.replace(/[$,]/g, "")) || 0
                  ).toLocaleString()}
                </span>
                <span>
                  $
                  {(
                    parseFloat(formData.targetAmount.replace(/[$,]/g, "")) || 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("button.save")}...
                </>
              ) : (
                t("button.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
