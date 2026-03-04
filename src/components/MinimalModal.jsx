import React, { useEffect, useState } from "react";

const MinimalModal = ({
  isOpen,
  onClose,
  title,
  description,
  type = "confirm", // "confirm" , "input", "alert"
  value,
  onChange,
  onConfirm,
  confirmText,
  isDanger,
  placeholder = "أدخل القيمة...",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200); // Wait for transition
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-150 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md bg-white dark:bg-dark-200 border border-gray-100 dark:border-dark-300 rounded-2xl shadow-2xl overflow-hidden text-center transition-all duration-300 ease-out transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="p-6 sm:p-8 space-y-4">
          {/* Icon (Optional but nice for UX) */}
          <div className="flex justify-center mb-2">
            {type === "alert" ? (
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500">
                <i className="fa-solid fa-circle-exclamation text-xl"></i>
              </div>
            ) : isDanger ? (
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500">
                <i className="fa-solid fa-trash-can text-xl"></i>
              </div>
            ) : type === "input" ? (
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                <i className="fa-solid fa-pen-to-square text-xl"></i>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                <i className="fa-solid fa-circle-info text-xl"></i>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium px-2 leading-relaxed">
              {description}
            </p>
          )}

          {type === "input" && (
            <div className="pt-2">
              <input
                autoFocus
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-light-100 dark:bg-dark-300 border border-gray-200 dark:border-dark-400 rounded-xl px-4 py-3 text-center outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all dark:text-white text-sm"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row border-t border-gray-100 dark:border-dark-300 bg-gray-50 dark:bg-dark-300/30">
          {type === "alert" ? (
            <button
              onClick={onConfirm || onClose}
              className="w-full py-4 text-sm font-semibold text-brand hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {confirmText || "حسناً"}
            </button>
          ) : (
            <>
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-4 text-sm font-semibold border-b sm:border-b-0 sm:border-l border-gray-100 dark:border-dark-300 transition-colors ${
                    isDanger
                      ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-brand hover:bg-brand/5 dark:hover:bg-brand/10"
                  }`}
                >
                  {confirmText || "تأكيد"}
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                إلغاء
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalModal;
