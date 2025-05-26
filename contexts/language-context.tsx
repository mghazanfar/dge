"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    "nav.step": "Step",
    "nav.personalInfo": "Personal Information",
    "nav.familyFinancial": "Family & Financial Info",
    "nav.situationDescriptions": "Situation Descriptions",
    "nav.next": "Next",
    "nav.previous": "Previous",
    "nav.submit": "Submit Application",

    // Personal Information
    "personal.title": "Personal Information",
    "personal.name": "Full Name",
    "personal.nationalId": "National ID",
    "personal.dateOfBirth": "Date of Birth",
    "personal.gender": "Gender",
    "personal.gender.male": "Male",
    "personal.gender.female": "Female",
    "personal.gender.other": "Other",
    "personal.address": "Address",
    "personal.city": "City",
    "personal.state": "State/Province",
    "personal.country": "Country",
    "personal.phone": "Phone Number",
    "personal.email": "Email Address",

    // Family & Financial
    "family.title": "Family & Financial Information",
    "family.maritalStatus": "Marital Status",
    "family.maritalStatus.single": "Single",
    "family.maritalStatus.married": "Married",
    "family.maritalStatus.divorced": "Divorced",
    "family.maritalStatus.widowed": "Widowed",
    "family.dependents": "Number of Dependents",
    "family.employmentStatus": "Employment Status",
    "family.employmentStatus.employed": "Employed",
    "family.employmentStatus.unemployed": "Unemployed",
    "family.employmentStatus.selfEmployed": "Self-Employed",
    "family.employmentStatus.retired": "Retired",
    "family.employmentStatus.student": "Student",
    "family.monthlyIncome": "Monthly Income",
    "family.housingStatus": "Housing Status",
    "family.housingStatus.owned": "Owned",
    "family.housingStatus.rented": "Rented",
    "family.housingStatus.family": "Living with Family",
    "family.housingStatus.homeless": "Homeless",

    // Situation Descriptions
    "situation.title": "Situation Descriptions",
    "situation.currentFinancial": "Current Financial Situation",
    "situation.currentFinancial.placeholder":
      "Describe your current financial situation, including any debts, expenses, or financial challenges you are facing...",
    "situation.employment": "Employment Circumstances",
    "situation.employment.placeholder":
      "Explain your current employment situation, including any job loss, reduced hours, or other employment-related challenges...",
    "situation.reason": "Reason for Applying",
    "situation.reason.placeholder":
      "Describe why you are applying for financial assistance and how it will help improve your situation...",
    "situation.helpMeWrite": "Help Me Write",

    // AI Assistant
    "ai.generating": "Generating suggestion...",
    "ai.suggestion": "AI Suggestion",
    "ai.accept": "Accept",
    "ai.edit": "Edit",
    "ai.discard": "Discard",
    "ai.error": "Failed to generate suggestion. Please try again.",
    "ai.rateLimited": "Too many requests. Please wait a moment and try again.",
    "ai.serviceUnavailable":
      "AI service is temporarily unavailable. Please try again later.",
    "ai.networkError":
      "Network error. Please check your connection and try again.",
    "ai.timeout": "Request timed out. Please try again.",
    "ai.tryAgainLater": "You can continue writing manually or try again later.",
    "ai.suggestion.success": "Grok-3 AI suggestion generated successfully!",
    "ai.suggestion.accepted": "Grok-3 suggestion accepted and applied",
    "ai.suggestion.discarded": "Grok-3 suggestion discarded",
    "ai.generated": "generated",
    "ai.characters": "characters",
    "ai.success.title": "Grok-3 AI Success!",
    "ai.error.title": "Grok-3 AI Error",

    // AI Debug
    "ai.debug.title": "Grok-3 AI Debug Information",
    "ai.debug.service": "AI Service",
    "ai.debug.model": "Model",
    "ai.debug.language": "Language",
    "ai.debug.activeField": "Active Field",
    "ai.debug.loading": "Loading",
    "ai.debug.hasSuggestion": "Has Suggestion",
    "ai.debug.status": "Status",
    "ai.debug.ready": "Ready",
    "ai.debug.none": "None",
    "ai.debug.note": "Note: Using GROK_API_KEY with grok-3 model",

    // Submission
    "submission.applicationId": "Application ID",
    "submission.confirmationMessage":
      "Your application has been submitted successfully. You will receive a confirmation email shortly.",

    // Validation
    "validation.required": "This field is required",
    "validation.email": "Please enter a valid email address",
    "validation.email.format": "Please enter a valid email address",
    "validation.phone": "Please enter a valid phone number",
    "validation.phone.format": "Phone number must be between 10-15 digits",
    "validation.nationalId": "Please enter a valid national ID",
    "validation.nationalId.format":
      "National ID must be exactly 15 digits in format 784-YYYY-XXXXXXX-X",
    "validation.nationalId.mustStartWith784": "National ID must start with 784",
    "validation.nationalId.birthYearMismatch":
      "National ID birth year must match your date of birth ({year})",
    "validation.nationalId.formatHelp":
      "Format: 784-YYYY-XXXXXXX-X (where YYYY is your birth year)",
    "validation.name.tooShort": "Name must be at least 2 characters",
    "validation.address.tooShort": "Address must be at least 10 characters",
    "validation.city.tooShort": "City must be at least 2 characters",
    "validation.state.tooShort": "State must be at least 2 characters",
    "validation.country.tooShort": "Country must be at least 2 characters",
    "validation.dateOfBirth.age": "Age must be between 18 and 100 years",
    "validation.textarea.tooShort": "This field must be at least 10 characters",
    "validation.dependents.min": "Number of dependents cannot be negative",
    "validation.monthlyIncome.min": "Monthly income cannot be negative",
    "validation.pleaseComplete":
      "Please complete all required fields correctly",
    "validation.error": "Validation Error",

    // General
    "general.loading": "Loading...",
    "general.success": "Application submitted successfully!",
    "general.error": "An error occurred. Please try again.",
    "general.language": "Language",
    "general.close": "Close",
  },
  ar: {
    // Navigation
    "nav.step": "الخطوة",
    "nav.personalInfo": "المعلومات الشخصية",
    "nav.familyFinancial": "معلومات الأسرة والمالية",
    "nav.situationDescriptions": "وصف الحالة",
    "nav.next": "التالي",
    "nav.previous": "السابق",
    "nav.submit": "تقديم الطلب",

    // Personal Information
    "personal.title": "المعلومات الشخصية",
    "personal.name": "الاسم الكامل",
    "personal.nationalId": "رقم الهوية الوطنية",
    "personal.dateOfBirth": "تاريخ الميلاد",
    "personal.gender": "الجنس",
    "personal.gender.male": "ذكر",
    "personal.gender.female": "أنثى",
    "personal.gender.other": "آخر",
    "personal.address": "العنوان",
    "personal.city": "المدينة",
    "personal.state": "المحافظة/الولاية",
    "personal.country": "البلد",
    "personal.phone": "رقم الهاتف",
    "personal.email": "البريد الإلكتروني",

    // Family & Financial
    "family.title": "معلومات الأسرة والمالية",
    "family.maritalStatus": "الحالة الاجتماعية",
    "family.maritalStatus.single": "أعزب",
    "family.maritalStatus.married": "متزوج",
    "family.maritalStatus.divorced": "مطلق",
    "family.maritalStatus.widowed": "أرمل",
    "family.dependents": "عدد المعالين",
    "family.employmentStatus": "حالة التوظيف",
    "family.employmentStatus.employed": "موظف",
    "family.employmentStatus.unemployed": "عاطل عن العمل",
    "family.employmentStatus.selfEmployed": "يعمل لحسابه الخاص",
    "family.employmentStatus.retired": "متقاعد",
    "family.employmentStatus.student": "طالب",
    "family.monthlyIncome": "الدخل الشهري",
    "family.housingStatus": "حالة السكن",
    "family.housingStatus.owned": "مملوك",
    "family.housingStatus.rented": "مستأجر",
    "family.housingStatus.family": "يعيش مع الأسرة",
    "family.housingStatus.homeless": "بلا مأوى",

    // Situation Descriptions
    "situation.title": "وصف الحالة",
    "situation.currentFinancial": "الوضع المالي الحالي",
    "situation.currentFinancial.placeholder":
      "اصف وضعك المالي الحالي، بما في ذلك أي ديون أو مصاريف أو تحديات مالية تواجهها...",
    "situation.employment": "ظروف التوظيف",
    "situation.employment.placeholder":
      "اشرح وضع عملك الحالي، بما في ذلك أي فقدان للوظيفة أو تقليل ساعات العمل أو تحديات أخرى متعلقة بالعمل...",
    "situation.reason": "سبب التقديم",
    "situation.reason.placeholder":
      "اصف لماذا تتقدم بطلب للحصول على مساعدة مالية وكيف ستساعد في تحسين وضعك...",
    "situation.helpMeWrite": "ساعدني في الكتابة (Grok-3)",

    // AI Assistant
    "ai.generating": "جاري إنشاء الاقتراح...",
    "ai.suggestion": "اقتراح الذكاء الاصطناعي",
    "ai.accept": "قبول",
    "ai.edit": "تعديل",
    "ai.discard": "تجاهل",
    "ai.error": "فشل في إنشاء الاقتراح. يرجى المحاولة مرة أخرى.",
    "ai.rateLimited":
      "طلبات كثيرة جداً. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
    "ai.serviceUnavailable":
      "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.",
    "ai.networkError":
      "خطأ في الشبكة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
    "ai.timeout": "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.",
    "ai.tryAgainLater": "يمكنك المتابعة بالكتابة يدوياً أو المحاولة لاحقاً.",
    "ai.suggestion.success": "تم إنشاء اقتراح Grok-3 بنجاح!",
    "ai.suggestion.accepted": "تم قبول وتطبيق اقتراح Grok-3",
    "ai.suggestion.discarded": "تم تجاهل اقتراح Grok-3",
    "ai.generated": "تم إنشاء",
    "ai.characters": "حرف",
    "ai.success.title": "نجح Grok-3!",
    "ai.error.title": "خطأ في Grok-3",

    // AI Debug
    "ai.debug.title": "معلومات تصحيح Grok-3",
    "ai.debug.service": "خدمة الذكاء الاصطناعي",
    "ai.debug.model": "النموذج",
    "ai.debug.language": "اللغة",
    "ai.debug.activeField": "الحقل النشط",
    "ai.debug.loading": "جاري التحميل",
    "ai.debug.hasSuggestion": "يحتوي على اقتراح",
    "ai.debug.status": "الحالة",
    "ai.debug.ready": "جاهز",
    "ai.debug.none": "لا يوجد",
    "ai.debug.note": "ملاحظة: استخدام GROK_API_KEY مع نموذج grok-3",

    // Submission
    "submission.applicationId": "رقم الطلب",
    "submission.confirmationMessage":
      "تم تقديم طلبك بنجاح. ستتلقى رسالة تأكيد عبر البريد الإلكتروني قريباً.",

    // Validation
    "validation.required": "هذا الحقل مطلوب",
    "validation.email": "يرجى إدخال عنوان بريد إلكتروني صحيح",
    "validation.email.format": "يرجى إدخال عنوان بريد إلكتروني صحيح",
    "validation.phone": "يرجى إدخال رقم هاتف صحيح",
    "validation.phone.format": "رقم الهاتف يجب أن يكون بين 10-15 رقم",
    "validation.nationalId": "يرجى إدخال رقم هوية وطنية صحيح",
    "validation.nationalId.format":
      "رقم الهوية الوطنية يجب أن يكون 15 رقم بالضبط بصيغة 784-YYYY-XXXXXXX-X",
    "validation.nationalId.mustStartWith784":
      "رقم الهوية الوطنية يجب أن يبدأ بـ 784",
    "validation.nationalId.birthYearMismatch":
      "سنة الميلاد في رقم الهوية يجب أن تطابق تاريخ ميلادك ({year})",
    "validation.nationalId.formatHelp":
      "الصيغة: 784-YYYY-XXXXXXX-X (حيث YYYY هي سنة ميلادك)",
    "validation.name.tooShort": "الاسم يجب أن يكون على الأقل حرفين",
    "validation.address.tooShort": "العنوان يجب أن يكون على الأقل 10 أحرف",
    "validation.city.tooShort": "المدينة يجب أن تكون على الأقل حرفين",
    "validation.state.tooShort": "المحافظة يجب أن تكون على الأقل حرفين",
    "validation.country.tooShort": "البلد يجب أن يكون على الأقل حرفين",
    "validation.dateOfBirth.age": "العمر يجب أن يكون بين 18 و 100 سنة",
    "validation.textarea.tooShort": "هذا الحقل يجب أن يكون على الأقل 10 أحرف",
    "validation.dependents.min": "عدد المعالين لا يمكن أن يكون سالباً",
    "validation.monthlyIncome.min": "الدخل الشهري لا يمكن أن يكون سالباً",
    "validation.pleaseComplete": "يرجى إكمال جميع الحقول المطلوبة بشكل صحيح",
    "validation.error": "خطأ في التحقق",

    // General
    "general.loading": "جاري التحميل...",
    "general.success": "تم تقديم الطلب بنجاح!",
    "general.error": "حدث خطأ. يرجى المحاولة مرة أخرى.",
    "general.language": "اللغة",
    "general.close": "إغلاق",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  const isRTL = language === "ar";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      if (saved && (saved === "en" || saved === "ar")) {
        setLanguage(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
