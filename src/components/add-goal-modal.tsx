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
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (goalData: {
    name: string;
    description: string;
    type: string;
    startDate: string;
    deadline: string;
    checkInPerson: string;
    checkInEmail: string;
    targetAmount?: number;
    category?: string;
  }) => void;
}

interface FormData {
  goalTitle: string;
  targetAmount: string;
  targetDate: string;
  category: string;
  description: string;
}

interface FormErrors {
  goalTitle?: string;
  targetAmount?: string;
  targetDate?: string;
  category?: string;
}

export function AddGoalModal({
  open,
  onOpenChange,
  onAddTask,
}: AddGoalModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    goalTitle: "",
    targetAmount: "",
    targetDate: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        goalTitle: "",
        targetAmount: "",
        targetDate: "",
        category: "",
        description: "",
      });
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }
  }, [open]);

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};

    // Goal Title validation
    if (touched.goalTitle) {
      if (!formData.goalTitle.trim()) {
        newErrors.goalTitle = "Goal title is required";
      } else if (formData.goalTitle.length < 3) {
        newErrors.goalTitle = "Goal title must be at least 3 characters";
      } else if (formData.goalTitle.length > 50) {
        newErrors.goalTitle = "Goal title must be less than 50 characters";
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

    // Target Date validation
    if (touched.targetDate) {
      if (!formData.targetDate) {
        newErrors.targetDate = "Target date is required";
      } else {
        const selectedDate = new Date(formData.targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.targetDate = "Target date cannot be in the past";
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
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Format with commas
    const number = parseFloat(numericValue);
    if (!isNaN(number)) {
      return number.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }

    return numericValue;
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    handleInputChange("targetAmount", formatted);
  };

  const isFormValid = () => {
    return (
      formData.goalTitle.trim() &&
      formData.targetAmount.trim() &&
      formData.targetDate &&
      formData.category &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      goalTitle: true,
      targetAmount: true,
      targetDate: true,
      category: true,
    });

    // Wait for validation to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const amount = parseFloat(formData.targetAmount.replace(/[$,]/g, ""));

      onAddTask({
        name: formData.goalTitle,
        description: formData.description,
        type: formData.category,
        startDate: new Date().toISOString().split("T")[0],
        deadline: formData.targetDate,
        checkInPerson: "",
        checkInEmail: "",
        targetAmount: amount,
        category: formData.category,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error adding goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader className="relative pb-8">
          {/* Elegant Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>

          <DialogTitle className="text-center text-2xl font-light text-gray-900 mb-3">
            {t("add.goal")}
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm leading-relaxed">
            Define your objectives and set a clear path to achievement
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("goal.name")}
            </label>
            <Input
              placeholder={t("placeholder.name")}
              value={formData.goalTitle}
              onChange={(e) => handleInputChange("goalTitle", e.target.value)}
              className={`h-11 text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900/20 transition-colors ${
                errors.goalTitle ? "border-red-300 bg-red-50" : ""
              }`}
            />
            {errors.goalTitle && (
              <p className="text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.goalTitle}
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("goal.targetAmount")}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("placeholder.amount")}
                value={formData.targetAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`h-11 pl-10 text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900/20 transition-colors ${
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

          {/* Target Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("goal.deadline")}
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange("targetDate", e.target.value)
                }
                className={`h-11 text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900/20 transition-colors ${
                  errors.targetDate ? "border-red-300 bg-red-50" : ""
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.targetDate && (
              <p className="text-red-600 text-xs flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.targetDate}
              </p>
            )}
          </div>

          {/* Goal Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("goal.category")}
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={`h-11 text-sm border-gray-300 focus:border-gray-900 focus:ring-gray-900/20 transition-colors ${
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

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("goal.description")}{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <Textarea
              placeholder={t("placeholder.description")}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="border-gray-300 focus:border-gray-900 focus:ring-gray-900/20 transition-colors min-h-[100px] resize-none text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("button.add")}...
                </>
              ) : (
                t("button.add")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
