"use client"

import { useForm } from "@/contexts/form-context"
import { useLanguage } from "@/contexts/language-context"
import { AlertCircle } from "lucide-react"

export function FamilyFinancial() {
  const { familyForm } = useForm()
  const { t, isRTL } = useLanguage()

  const {
    register,
    formState: { errors },
  } = familyForm

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("family.title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
            {t("family.maritalStatus")} *
          </label>
          <select
            id="maritalStatus"
            {...register("maritalStatus", {
              required: t("validation.required"),
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.maritalStatus ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">{t("family.maritalStatus")}</option>
            <option value="single">{t("family.maritalStatus.single")}</option>
            <option value="married">{t("family.maritalStatus.married")}</option>
            <option value="divorced">{t("family.maritalStatus.divorced")}</option>
            <option value="widowed">{t("family.maritalStatus.widowed")}</option>
          </select>
          {errors.maritalStatus && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.maritalStatus.message}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-2">
            {t("family.dependents")} *
          </label>
          <input
            type="number"
            id="dependents"
            min="0"
            {...register("dependents", {
              required: t("validation.required"),
              min: {
                value: 0,
                message: t("validation.dependents.min"),
              },
              valueAsNumber: true,
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dependents ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.dependents && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.dependents.message}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-2">
            {t("family.employmentStatus")} *
          </label>
          <select
            id="employmentStatus"
            {...register("employmentStatus", {
              required: t("validation.required"),
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.employmentStatus ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">{t("family.employmentStatus")}</option>
            <option value="employed">{t("family.employmentStatus.employed")}</option>
            <option value="unemployed">{t("family.employmentStatus.unemployed")}</option>
            <option value="selfEmployed">{t("family.employmentStatus.selfEmployed")}</option>
            <option value="retired">{t("family.employmentStatus.retired")}</option>
            <option value="student">{t("family.employmentStatus.student")}</option>
          </select>
          {errors.employmentStatus && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.employmentStatus.message}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
            {t("family.monthlyIncome")} *
          </label>
          <input
            type="number"
            id="monthlyIncome"
            min="0"
            step="0.01"
            {...register("monthlyIncome", {
              required: t("validation.required"),
              min: {
                value: 0,
                message: t("validation.monthlyIncome.min"),
              },
              valueAsNumber: true,
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.monthlyIncome ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.monthlyIncome && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.monthlyIncome.message}</span>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="housingStatus" className="block text-sm font-medium text-gray-700 mb-2">
            {t("family.housingStatus")} *
          </label>
          <select
            id="housingStatus"
            {...register("housingStatus", {
              required: t("validation.required"),
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.housingStatus ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">{t("family.housingStatus")}</option>
            <option value="owned">{t("family.housingStatus.owned")}</option>
            <option value="rented">{t("family.housingStatus.rented")}</option>
            <option value="family">{t("family.housingStatus.family")}</option>
            <option value="homeless">{t("family.housingStatus.homeless")}</option>
          </select>
          {errors.housingStatus && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.housingStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
