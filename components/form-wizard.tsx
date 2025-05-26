"use client";

import { useState } from "react";
import { useForm } from "@/contexts/form-context";
import { useLanguage } from "@/contexts/language-context";
import { ProgressBar } from "@/components/progress-bar";
import { PersonalInformation } from "@/components/steps/personal-information";
import { FamilyFinancial } from "@/components/steps/family-financial";
import { SituationDescriptions } from "@/components/steps/situation-descriptions";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function FormWizard() {
  const { state, dispatch, personalForm, familyForm, situationForm } =
    useForm();
  const { t, isRTL } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const getCurrentForm = () => {
    switch (state.currentStep) {
      case 1:
        return personalForm;
      case 2:
        return familyForm;
      case 3:
        return situationForm;
      default:
        return personalForm;
    }
  };

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentForm = getCurrentForm();
    const isValid = await currentForm.trigger();

    if (!isValid) {
      setSubmissionError(t("validation.pleaseComplete"));
      return;
    }

    if (state.currentStep < 3) {
      setSubmissionError("");
      dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
    }
  };

  const handlePrevious = () => {
    if (state.currentStep > 1) {
      setSubmissionError("");
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await situationForm.trigger();

    if (!isValid) {
      setSubmissionError(t("validation.pleaseComplete"));
      return;
    }

    console.log("=== Form Submission Started ===");
    console.log("Form data to submit:", state.formData);

    dispatch({ type: "SET_SUBMITTING", payload: true });
    setSubmissionError("");

    try {
      console.log("Making submission request...");

      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.formData),
      });

      console.log("Response received:", response.status, response.statusText);

      // Get response text first
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Try to parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed response:", result);
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError);
        throw new Error("Invalid response from server");
      }

      if (response.ok && result.success) {
        console.log("Submission successful!");
        setApplicationId(result.applicationId);
        setIsSubmitted(true);

        // Clear localStorage after successful submission
        if (typeof window !== "undefined") {
          localStorage.removeItem("financialAssistanceForm");
        }
      } else {
        console.error("Submission failed:", result);
        throw new Error(result.error || result.message || "Submission failed");
      }
    } catch (error) {
      console.error("=== Form Submission Error ===");
      console.error("Error details:", error);

      let errorMessage = t("general.error");

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage = t("ai.networkError");
        } else if (error.message.includes("Invalid response")) {
          errorMessage = "Server communication error. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }

      setSubmissionError(errorMessage);
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <PersonalInformation />;
      case 2:
        return <FamilyFinancial />;
      case 3:
        return <SituationDescriptions />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6" role="alert" aria-live="polite">
        <div className="text-center space-y-6">
          <CheckCircle
            className="w-16 h-16 text-green-600 mx-auto"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            {t("general.success")}
          </h2>
          <p className="text-gray-600">
            {t("submission.applicationId")}:{" "}
            <span
              className="font-mono font-semibold"
              aria-label={`Application ID: ${applicationId}`}
            >
              {applicationId}
            </span>
          </p>
          <div
            className="bg-green-50 border border-green-200 rounded-lg p-4"
            role="status"
          >
            <p className="text-green-800 text-sm">
              {t("submission.confirmationMessage")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressBar />

      <form
        className="bg-white rounded-lg shadow-lg p-8"
        aria-label="Financial Assistance Application Form"
        onSubmit={state.currentStep < 3 ? handleNext : handleSubmit}
      >
        {renderStep()}

        {/* Show submission error if any */}
        {submissionError && (
          <div
            className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-6"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm text-red-800 font-medium">
                {t("validation.error")}
              </p>
              <p className="text-sm text-red-700">{submissionError}</p>
            </div>
          </div>
        )}

        <div
          className={`gap-x-4 flex justify-between mt-8`}
          role="navigation"
          aria-label="Form navigation"
        >
          <button
            type="button"
            onClick={handlePrevious}
            disabled={state.currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={t("nav.previous")}
            aria-disabled={state.currentStep === 1}
          >
            {isRTL ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
            {t("nav.previous")}
          </button>

          {state.currentStep < 3 ? (
            <button
              className={`flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
              aria-label={t("nav.next")}
              type="submit"
            >
              {t("nav.next")}
              {isRTL ? (
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={state.isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              aria-label={
                state.isSubmitting ? t("general.loading") : t("nav.submit")
              }
              aria-disabled={state.isSubmitting}
            >
              {state.isSubmitting ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  {t("general.loading")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {t("nav.submit")}
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
