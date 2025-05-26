"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useForm as useHookForm, type UseFormReturn } from "react-hook-form"

export interface PersonalInfo {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
}

export interface FamilyFinancialInfo {
  maritalStatus: string
  dependents: number
  employmentStatus: string
  monthlyIncome: number
  housingStatus: string
}

export interface SituationDescriptions {
  currentFinancialSituation: string
  employmentCircumstances: string
  reasonForApplying: string
}

export interface FormData {
  personalInfo: PersonalInfo
  familyFinancialInfo: FamilyFinancialInfo
  situationDescriptions: SituationDescriptions
}

interface FormState {
  currentStep: number
  formData: FormData
  isSubmitting: boolean
}

type FormAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_PERSONAL_INFO"; payload: Partial<PersonalInfo> }
  | { type: "UPDATE_FAMILY_FINANCIAL_INFO"; payload: Partial<FamilyFinancialInfo> }
  | { type: "UPDATE_SITUATION_DESCRIPTIONS"; payload: Partial<SituationDescriptions> }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "LOAD_FROM_STORAGE"; payload: FormData }

const initialFormData: FormData = {
  personalInfo: {
    name: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
  },
  familyFinancialInfo: {
    maritalStatus: "",
    dependents: 0,
    employmentStatus: "",
    monthlyIncome: 0,
    housingStatus: "",
  },
  situationDescriptions: {
    currentFinancialSituation: "",
    employmentCircumstances: "",
    reasonForApplying: "",
  },
}

const initialState: FormState = {
  currentStep: 1,
  formData: initialFormData,
  isSubmitting: false,
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "UPDATE_PERSONAL_INFO":
      return {
        ...state,
        formData: {
          ...state.formData,
          personalInfo: { ...state.formData.personalInfo, ...action.payload },
        },
      }
    case "UPDATE_FAMILY_FINANCIAL_INFO":
      return {
        ...state,
        formData: {
          ...state.formData,
          familyFinancialInfo: { ...state.formData.familyFinancialInfo, ...action.payload },
        },
      }
    case "UPDATE_SITUATION_DESCRIPTIONS":
      return {
        ...state,
        formData: {
          ...state.formData,
          situationDescriptions: { ...state.formData.situationDescriptions, ...action.payload },
        },
      }
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload }
    case "LOAD_FROM_STORAGE":
      return { ...state, formData: action.payload }
    default:
      return state
  }
}

interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormAction>
  saveToStorage: () => void
  loadFromStorage: () => void
  personalForm: UseFormReturn<PersonalInfo>
  familyForm: UseFormReturn<FamilyFinancialInfo>
  situationForm: UseFormReturn<SituationDescriptions>
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  // Initialize React Hook Forms for each step
  const personalForm = useHookForm<PersonalInfo>({
    defaultValues: state.formData.personalInfo,
    mode: "onChange",
  })

  const familyForm = useHookForm<FamilyFinancialInfo>({
    defaultValues: state.formData.familyFinancialInfo,
    mode: "onChange",
  })

  const situationForm = useHookForm<SituationDescriptions>({
    defaultValues: state.formData.situationDescriptions,
    mode: "onChange",
  })

  const saveToStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("financialAssistanceForm", JSON.stringify(state.formData))
    }
  }

  const loadFromStorage = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("financialAssistanceForm")
      if (saved) {
        try {
          const parsedData = JSON.parse(saved)
          dispatch({ type: "LOAD_FROM_STORAGE", payload: parsedData })

          // Reset forms with loaded data
          personalForm.reset(parsedData.personalInfo)
          familyForm.reset(parsedData.familyFinancialInfo)
          situationForm.reset(parsedData.situationDescriptions)
        } catch (error) {
          console.error("Error loading from storage:", error)
        }
      }
    }
  }

  // Sync form data with state when forms change
  useEffect(() => {
    const subscription = personalForm.watch((data) => {
      dispatch({ type: "UPDATE_PERSONAL_INFO", payload: data as Partial<PersonalInfo> })
    })
    return () => subscription.unsubscribe()
  }, [personalForm])

  useEffect(() => {
    const subscription = familyForm.watch((data) => {
      dispatch({ type: "UPDATE_FAMILY_FINANCIAL_INFO", payload: data as Partial<FamilyFinancialInfo> })
    })
    return () => subscription.unsubscribe()
  }, [familyForm])

  useEffect(() => {
    const subscription = situationForm.watch((data) => {
      dispatch({ type: "UPDATE_SITUATION_DESCRIPTIONS", payload: data as Partial<SituationDescriptions> })
    })
    return () => subscription.unsubscribe()
  }, [situationForm])

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    saveToStorage()
  }, [state.formData])

  return (
    <FormContext.Provider
      value={{
        state,
        dispatch,
        saveToStorage,
        loadFromStorage,
        personalForm,
        familyForm,
        situationForm,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
