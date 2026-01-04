import React from "react";

const MinimalModal = ({
  isOpen,
  onClose,
  title,
  description, 
  type = "confirm", // "confirm" , "input"
  value, 
  onChange,
  onConfirm,
  confirmText,
  isDanger,
  placeholder = "أدخل القيمة...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-white/60 dark:bg-dark-100/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm space-y-8 text-center animate-in zoom-in-95 duration-300">
        <div className="space-y-2">
          <h2 className="text-lg font-medium dark:text-white tracking-tight">
            {title}
          </h2>
          
          {description && (
            <div className="text-sm text-gray-400 font-light px-4">
              {description}
            </div>
          )}

          {type === "input" && (
            <div className="px-4 pt-4">
              <input
                autoFocus
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-gray-100 dark:border-dark-300 py-2 text-center outline-none focus:border-brand transition-colors dark:text-white text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`cursor-pointer text-[10px] uppercase tracking-[3px] font-bold py-4 rounded-full transition-all active:scale-95 ${
                isDanger ? "bg-red-500 text-white" : "bg-brand text-white"
              }`}
            >
              {confirmText || "تأكيد"}
            </button>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer text-[10px] uppercase tracking-[3px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors py-2"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinimalModal;