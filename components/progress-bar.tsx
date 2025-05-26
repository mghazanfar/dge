"use client";

import { useLanguage } from "@/contexts/language-context";
import { useForm } from "@/contexts/form-context";

const steps = [
  { key: "personalInfo", number: 1 },
  { key: "familyFinancial", number: 2 },
  { key: "situationDescriptions", number: 3 },
];

export function ProgressBar() {
  const { t, isRTL } = useLanguage();
  const { state } = useForm();

  return (
    <div className="w-full mb-8">
      <div className="md:gap-y-0 flex flex-col md:flex-row md:items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className="py-3 md:pb-0 border-b md:border-0 flex items-center"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                state.currentStep >= step.number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            <div
              className={`ml-2 text-sm font-medium ${isRTL ? "mr-2 ml-0" : ""}`}
            >
              <div
                className={
                  state.currentStep >= step.number
                    ? "text-blue-600"
                    : "text-gray-500"
                }
              >
                {t(`nav.step`)} {step.number}
              </div>
              <div className="text-xs text-gray-500">
                {t(`nav.${step.key}`)}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block flex-1 h-0.5 mx-4 transition-colors ${
                  state.currentStep > step.number
                    ? "bg-blue-600"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(state.currentStep / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
