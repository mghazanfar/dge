"use client";

import { useForm } from "@/contexts/form-context";
import { useLanguage } from "@/contexts/language-context";
import { AlertCircle } from "lucide-react";

export function PersonalInformation() {
  const { personalForm } = useForm();
  const { t, isRTL } = useLanguage();

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = personalForm;

  const dateOfBirth = watch("dateOfBirth");

  const getBirthYearFromDate = (dateOfBirth: string): string => {
    if (!dateOfBirth) return "";
    return new Date(dateOfBirth).getFullYear().toString();
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(
      4,
      8
    )}-${digits.slice(8, 12)}`;
  };

  const formatNationalId = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 14)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
      7,
      14
    )}-${digits.slice(14, 15)}`;
  };

  const validateNationalId = (value: string) => {
    if (!value) return t("validation.required");

    const digits = value.replace(/\D/g, "");

    // Check if exactly 15 digits
    if (digits.length !== 15) {
      return t("validation.nationalId.format");
    }

    // Check if starts with 784
    if (!digits.startsWith("784")) {
      return t("validation.nationalId.mustStartWith784");
    }

    // Check birth year if date of birth is available
    if (dateOfBirth) {
      const birthYear = getBirthYearFromDate(dateOfBirth);
      const expectedPrefix = `784${birthYear}`;
      if (!digits.startsWith(expectedPrefix)) {
        return t("validation.nationalId.birthYearMismatch").replace(
          "{year}",
          birthYear
        );
      }
    }

    return true;
  };

  const validatePhone = (value: string) => {
    if (!value) return t("validation.required");
    const phoneDigits = value.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return t("validation.phone.format");
    }
    return true;
  };

  const validateAge = (value: string) => {
    if (!value) return t("validation.required");
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18 || age > 100) {
      return t("validation.dateOfBirth.age");
    }
    return true;
  };

  return (
    <div className="space-y-6" role="form" aria-label={t("personal.title")}>
      <h2
        className="text-2xl font-bold text-gray-900 mb-6"
        id="personal-info-heading"
      >
        {t("personal.title")}
      </h2>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        aria-labelledby="personal-info-heading"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.name")} *
          </label>
          <input
            type="text"
            id="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name", {
              required: t("validation.required"),
              minLength: {
                value: 2,
                message: t("validation.name.tooShort"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.name && (
            <div
              className="flex items-center gap-1 mt-1"
              id="name-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.name.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.dateOfBirth")} *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            aria-required="true"
            aria-invalid={!!errors.dateOfBirth}
            aria-describedby={
              errors.dateOfBirth ? "dateOfBirth-error" : undefined
            }
            {...register("dateOfBirth", {
              required: t("validation.required"),
              validate: validateAge,
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateOfBirth ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.dateOfBirth && (
            <div
              className="flex items-center gap-1 mt-1"
              id="dateOfBirth-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.dateOfBirth.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="nationalId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.nationalId")} *
          </label>
          <input
            type="text"
            id="nationalId"
            aria-required="true"
            aria-invalid={!!errors.nationalId}
            aria-describedby={`nationalId-error ${
              errors.nationalId ? "nationalId-format" : ""
            }`}
            {...register("nationalId", {
              required: t("validation.required"),
              validate: validateNationalId,
              onChange: (e) => {
                const formatted = formatNationalId(e.target.value);
                setValue("nationalId", formatted);
              },
            })}
            placeholder={`784-${
              getBirthYearFromDate(dateOfBirth) || "YYYY"
            }-XXXXXXX-X`}
            maxLength={17}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nationalId ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          <div className="text-xs text-gray-500 mt-1" id="nationalId-format">
            {t("validation.nationalId.formatHelp")}
          </div>
          {errors.nationalId && (
            <div
              className="flex items-center gap-1 mt-1"
              id="nationalId-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.nationalId.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.gender")} *
          </label>
          <select
            id="gender"
            aria-required="true"
            aria-invalid={!!errors.gender}
            aria-describedby={errors.gender ? "gender-error" : undefined}
            {...register("gender", {
              required: t("validation.required"),
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">{t("personal.gender")}</option>
            <option value="male">{t("personal.gender.male")}</option>
            <option value="female">{t("personal.gender.female")}</option>
            <option value="other">{t("personal.gender.other")}</option>
          </select>
          {errors.gender && (
            <div
              className="flex items-center gap-1 mt-1"
              id="gender-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.gender.message}
              </span>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.address")} *
          </label>
          <input
            type="text"
            id="address"
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "address-error" : undefined}
            {...register("address", {
              required: t("validation.required"),
              minLength: {
                value: 10,
                message: t("validation.address.tooShort"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.address ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.address && (
            <div
              className="flex items-center gap-1 mt-1"
              id="address-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.address.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.city")} *
          </label>
          <input
            type="text"
            id="city"
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            {...register("city", {
              required: t("validation.required"),
              minLength: {
                value: 2,
                message: t("validation.city.tooShort"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.city && (
            <div
              className="flex items-center gap-1 mt-1"
              id="city-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.city.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.state")} *
          </label>
          <input
            type="text"
            id="state"
            aria-required="true"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? "state-error" : undefined}
            {...register("state", {
              required: t("validation.required"),
              minLength: {
                value: 2,
                message: t("validation.state.tooShort"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.state ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.state && (
            <div
              className="flex items-center gap-1 mt-1"
              id="state-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.state.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.country")} *
          </label>
          <input
            type="text"
            id="country"
            aria-required="true"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? "country-error" : undefined}
            {...register("country", {
              required: t("validation.required"),
              minLength: {
                value: 2,
                message: t("validation.country.tooShort"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.country ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.country && (
            <div
              className="flex items-center gap-1 mt-1"
              id="country-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.country.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.phone")} *
          </label>
          <input
            type="tel"
            id="phone"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone", {
              required: t("validation.required"),
              validate: validatePhone,
              onChange: (e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setValue("phone", formatted);
              },
            })}
            placeholder="+20-10-1234-5678"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.phone && (
            <div
              className="flex items-center gap-1 mt-1"
              id="phone-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.phone.message}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("personal.email")} *
          </label>
          <input
            type="email"
            id="email"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email", {
              required: t("validation.required"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("validation.email.format"),
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            } ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          />
          {errors.email && (
            <div
              className="flex items-center gap-1 mt-1"
              id="email-error"
              role="alert"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500"
                aria-hidden="true"
              />
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
