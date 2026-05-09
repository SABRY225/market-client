import React, { useState } from "react";

export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300
        ${checked ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"}`}
    >
      <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-300" />
    </button>
  );
}
