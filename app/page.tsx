"use client";

import { FormProvider } from "@/contexts/form-context";
import { LanguageProvider } from "@/contexts/language-context";
import { FormWizard } from "@/components/form-wizard";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  return (
    <LanguageProvider>
      <FormProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-base md:text-xl font-semibold text-gray-900">
                  Financial Assistance Application
                </h1>
                <LanguageSwitcher />
              </div>
            </div>
          </header>

          <main className="py-8">
            <FormWizard />
          </main>

          <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <p className="text-center text-gray-500 text-sm">
                © 2024 Financial Assistance Portal. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </FormProvider>
    </LanguageProvider>
  );
}
