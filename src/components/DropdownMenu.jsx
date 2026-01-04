import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const DropdownMenu = ({ trigger, items, position = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 224; 
    const menuHeight = items.length * 40 + 20; 
    
    let top = rect.bottom + window.scrollY;
    let left = position === "right" ? rect.right + window.scrollX - menuWidth : rect.left + window.scrollX;

    if (rect.bottom + menuHeight > window.innerHeight + window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - 8;
    }

    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }
    if (left < 0) {
      left = 10;
    }

    setCoords({ top, left });
  }, [position, items.length]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) updatePosition();
    setIsOpen(!isOpen);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setCoords(null);
  }, []);

  useLayoutEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEvents = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !triggerRef.current.contains(e.target)) close();
    };
    window.addEventListener("mousedown", handleEvents);
    window.addEventListener("scroll", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("mousedown", handleEvents);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, close]);

  const renderIcon = (icon) => {
    if (!icon) return null;
    return typeof icon === "string" ? <i className={`${icon} w-4 text-center`}></i> : icon;
  };

  return (
    <>
      <div ref={triggerRef} onClick={toggleMenu} className="inline-block">
        {trigger}
      </div>

      {isOpen && coords && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            minWidth: "14rem",
          }}
          className="z-[9999] rounded-xl border border-gray-100 dark:border-dark-100 bg-white dark:bg-dark-300 shadow-2xl py-1.5 animate-in fade-in zoom-in duration-100"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick?.();
                close();
              }}
              className={`cursor-pointer w-full px-4 py-2.5 text-sm text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors ${
                item.variant === "danger" ? "text-red-500" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {renderIcon(item.icon)}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default DropdownMenu;