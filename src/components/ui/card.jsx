import React from "react";
import clsx from "clsx";

/**
 * مكون الـ Card الأساسي
 */
export function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-2xl shadow-sm transition hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * رأس الـ Card
 * يُستخدم لوضع العنوان والأيقونات في الجزء العلوي
 */
export function CardHeader({ children, className }) {
  return (
    <div className={clsx("p-4 border-b border-gray-100 flex flex-col space-y-1.5", className)}>
      {children}
    </div>
  );
}

/**
 * عنوان الـ Card
 * يُستخدم داخل CardHeader لتنسيق النص الرئيسي
 */
export function CardTitle({ children, className }) {
  return (
    <h3
      className={clsx(
        "text-lg font-semibold leading-none tracking-tight text-gray-900",
        className
      )}
    >
      {children}
    </h3>
  );
}

/**
 * محتوى الـ Card الداخلي
 */
export function CardContent({ children, className }) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}