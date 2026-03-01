"use client";

import React, { useState } from "react";

export default function RightDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
      >
        Open Drawer
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Drawer Panel
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm"
          >
            Close
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This drawer slides from the right side and matches your UI.
          </p>

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            Add any content here — forms, details, upload UI, settings, etc.
          </div>
        </div>
      </div>
    </>
  );
}
