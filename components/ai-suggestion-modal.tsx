"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { X, Edit3, Check, Trash2, Zap } from "lucide-react";

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: string;
  onAccept: (text: string) => void;
  onDiscard: () => void;
}

export function AISuggestionModal({
  isOpen,
  onClose,
  suggestion,
  onAccept,
  onDiscard,
}: AISuggestionModalProps) {
  const { t, isRTL } = useLanguage();
  const [editedText, setEditedText] = useState(suggestion);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedText(suggestion);
    setIsEditing(false); // Reset editing mode when new suggestion arrives
  }, [suggestion]);

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(isEditing ? editedText : suggestion);
    onClose();
  };

  const handleDiscard = () => {
    onDiscard();
    onClose();
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-purple-50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">
              Grok-3 AI Suggestion
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t("general.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={`w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          ) : (
            <div
              className={`p-3 bg-purple-50 rounded-lg min-h-[160px] border border-purple-200 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {suggestion}
            </div>
          )}
        </div>

        <div
          className={`flex gap-3 p-6 border-t bg-gray-50 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <button
            onClick={handleAccept}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t("ai.accept")}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {t("ai.edit")}
          </button>

          <button
            onClick={handleDiscard}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t("ai.discard")}
          </button>
        </div>
      </div>
    </div>
  );
}
