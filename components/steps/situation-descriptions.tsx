"use client";

import { useState } from "react";
import { useForm } from "@/contexts/form-context";
import { useLanguage } from "@/contexts/language-context";
import { useAIAssistance } from "@/hooks/use-ai-assistance";
import { AISuggestionModal } from "@/components/ai-suggestion-modal";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
  Key,
} from "lucide-react";

export function SituationDescriptions() {
  const { situationForm } = useForm();
  const { t, isRTL, language } = useLanguage();
  const { generateSuggestion, isLoading, suggestion, error } =
    useAIAssistance();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = situationForm;

  // Separate state for each field to prevent linking
  const [activeField, setActiveField] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [fieldStates, setFieldStates] = useState<{
    [key: string]: {
      lastError: string;
      lastSuccess: string;
      debugInfo: string;
      currentSuggestion: string;
    };
  }>({
    currentFinancialSituation: {
      lastError: "",
      lastSuccess: "",
      debugInfo: "",
      currentSuggestion: "",
    },
    employmentCircumstances: {
      lastError: "",
      lastSuccess: "",
      debugInfo: "",
      currentSuggestion: "",
    },
    reasonForApplying: {
      lastError: "",
      lastSuccess: "",
      debugInfo: "",
      currentSuggestion: "",
    },
  });

  const updateFieldState = (
    fieldKey: string,
    updates: Partial<(typeof fieldStates)[string]>
  ) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], ...updates },
    }));
  };

  const handleAIAssistance = async (
    fieldType:
      | "currentFinancialSituation"
      | "employmentCircumstances"
      | "reasonForApplying"
  ) => {
    console.log("=== Grok-3 AI Assistance Button Clicked ===");
    console.log("Field type:", fieldType);

    setActiveField(fieldType);
    updateFieldState(fieldType, {
      lastError: "",
      lastSuccess: "",
      debugInfo: t("ai.generating"),
    });

    const currentValue = watch(fieldType);

    try {
      updateFieldState(fieldType, {
        debugInfo: `${t("ai.generating")} ${fieldType}...`,
      });

      const result = await generateSuggestion({
        fieldType,
        currentValue,
        language,
      });

      console.log("Grok-3 AI assistance result:", result);

      if (result.suggestion) {
        updateFieldState(fieldType, {
          lastSuccess: t("ai.suggestion.success"),
          debugInfo: `${t("general.success")} Grok-3 ${t("ai.generated")} ${
            result.suggestion.length
          } ${t("ai.characters")}`,
          currentSuggestion: result.suggestion,
        });
        setShowModal(true);
      } else if (result.error) {
        updateFieldState(fieldType, {
          lastError: result.error,
          debugInfo: `${t("general.error")}: ${result.error}`,
        });
      }
    } catch (err) {
      console.error("Error in handleAIAssistance:", err);
      const errorMsg = err instanceof Error ? err.message : t("general.error");
      updateFieldState(fieldType, {
        lastError: errorMsg,
        debugInfo: `${t("general.error")}: ${errorMsg}`,
      });
    }
  };

  const handleAcceptSuggestion = (text: string) => {
    setValue(activeField as keyof typeof fieldStates, text);
    setShowModal(false);
    updateFieldState(activeField, {
      lastError: "",
      lastSuccess: "",
      debugInfo: t("ai.suggestion.accepted"),
    });
    setActiveField("");
  };

  const handleDiscardSuggestion = () => {
    setShowModal(false);
    updateFieldState(activeField, {
      lastError: "",
      lastSuccess: "",
      debugInfo: t("ai.suggestion.discarded"),
    });
    setActiveField("");
  };

  const fields = [
    {
      key: "currentFinancialSituation",
      label: t("situation.currentFinancial"),
      placeholder: t("situation.currentFinancial.placeholder"),
    },
    {
      key: "employmentCircumstances",
      label: t("situation.employment"),
      placeholder: t("situation.employment.placeholder"),
    },
    {
      key: "reasonForApplying",
      label: t("situation.reason"),
      placeholder: t("situation.reason.placeholder"),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t("situation.title")}
      </h2>

      {/* Enhanced Debug Panel with Grok-3 Model Info */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-purple-600" />
          <strong className="text-purple-800">{t("ai.debug.title")}</strong>
        </div>
        <div className="text-xs text-purple-700 space-y-1">
          <div className="flex items-center gap-2">
            <Key className="w-3 h-3" />
            <span>{t("ai.debug.service")}: Grok-3 (xAI)</span>
          </div>
          <div>{t("ai.debug.model")}: grok-3</div>
          <div>
            {t("ai.debug.language")}: {language}
          </div>
          <div>
            {t("ai.debug.activeField")}: {activeField || t("ai.debug.none")}
          </div>
          <div>
            {t("ai.debug.loading")}: {isLoading.toString()}
          </div>
          <div>
            {t("ai.debug.hasSuggestion")}: {!!suggestion}
          </div>
          <div>
            {t("ai.debug.status")}:{" "}
            {activeField
              ? fieldStates[activeField]?.debugInfo || t("ai.debug.ready")
              : t("ai.debug.ready")}
          </div>
          <div className="text-xs text-purple-600 mt-2">
            {t("ai.debug.note")}
          </div>
        </div>
      </div>

      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <div className="gap-x-4 flex items-center justify-between">
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label} *
            </label>
            <button
              type="button"
              onClick={() => handleAIAssistance(field.key as any)}
              disabled={isLoading && activeField === field.key}
              className={`flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {isLoading && activeField === field.key ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isLoading && activeField === field.key
                ? t("ai.generating")
                : t("situation.helpMeWrite")}
            </button>
          </div>

          <textarea
            id={field.key}
            {...register(field.key as keyof typeof fieldStates, {
              required: t("validation.required"),
              minLength: {
                value: 10,
                message: t("validation.textarea.tooShort"),
              },
            })}
            placeholder={field.placeholder}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
              errors[field.key as keyof typeof errors]
                ? "border-red-500"
                : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />

          {/* Show validation error */}
          {errors[field.key as keyof typeof errors] && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">
                {errors[field.key as keyof typeof errors]?.message}
              </span>
            </div>
          )}

          {/* Show success message */}
          {fieldStates[field.key]?.lastSuccess && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  {t("ai.success.title")}
                </p>
                <p className="text-sm text-green-700">
                  {fieldStates[field.key].lastSuccess}
                </p>
              </div>
            </div>
          )}

          {/* Show error message */}
          {fieldStates[field.key]?.lastError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  {t("ai.error.title")}
                </p>
                <p className="text-sm text-red-700">
                  {fieldStates[field.key].lastError}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {t("ai.tryAgainLater")}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      <AISuggestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        suggestion={fieldStates[activeField]?.currentSuggestion || suggestion}
        onAccept={handleAcceptSuggestion}
        onDiscard={handleDiscardSuggestion}
      />
    </div>
  );
}
