"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Info,
} from "lucide-react";
import { DecisionTree, DecisionResult } from "@/src/types/content";

interface DecisionTreeFlowProps {
  tree: DecisionTree;
}

export function DecisionTreeFlow({ tree }: DecisionTreeFlowProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(tree.rootNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState<DecisionResult | null>(null);

  const currentNode = tree.nodes[currentNodeId];

  const handleSelectOption = (option: (typeof currentNode.options)[0]) => {
    if (option.result) {
      setActiveResult(option.result);
    } else if (option.nextId && tree.nodes[option.nextId]) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextId);
      setActiveResult(null);
    }
  };

  const handleBack = () => {
    if (activeResult) {
      setActiveResult(null);
      return;
    }
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentNodeId(prevNodeId);
      setActiveResult(null);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(tree.rootNodeId);
    setHistory([]);
    setActiveResult(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/90 bg-white shadow-sm dark:border-dark-border dark:bg-dark-card">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 dark:border-dark-border dark:bg-dark-card-hover flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {tree.title}
            </h3>
            <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-muted">
              {tree.description}
            </p>
          </div>
        </div>

        {(history.length > 0 || activeResult) && (
          <button
            type="button"
            onClick={handleReset}
            className="bangla-text inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300 dark:hover:bg-dark-card-hover"
          >
            <RotateCcw className="h-3 w-3" />
            <span>শুরু থেকে</span>
          </button>
        )}
      </div>

      {/* Body Area */}
      <div className="p-5 sm:p-6">
        {activeResult ? (
          /* Result Card */
          <div className="space-y-4">
            <div
              className={`rounded-2xl border p-5 sm:p-6 ${
                activeResult.status === "sajda_sahu"
                  ? "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
                  : activeResult.status === "repeat"
                  ? "border-rose-200 bg-rose-50/80 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"
                  : "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {activeResult.status === "sajda_sahu" ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                ) : activeResult.status === "repeat" ? (
                  <AlertOctagon className="h-6 w-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="bangla-text text-xs font-bold uppercase tracking-wider">
                    {activeResult.status === "sajda_sahu"
                      ? "সিজদায়ে সাহু ওয়াজিব"
                      : activeResult.status === "repeat"
                      ? "নামাজ পুনরায় পড়া আবশ্যক"
                      : "নামাজ সহীহ ও গ্রহণযোগ্য"}
                  </span>
                  <h4 className="bangla-text text-lg sm:text-xl font-bold mt-0.5">
                    {activeResult.title}
                  </h4>
                </div>
              </div>

              <p className="bangla-text text-sm sm:text-base leading-relaxed mb-4">
                {activeResult.description}
              </p>

              <div className="rounded-xl border border-current/20 bg-white/70 p-3.5 dark:bg-dark-card/60">
                <span className="bangla-text text-xs font-bold block mb-1">
                  করণীয় আমল:
                </span>
                <p className="bangla-text text-sm font-medium">
                  {activeResult.action}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="bangla-text text-xs font-semibold text-gray-600 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:text-white"
              >
                ← পূর্ববর্তী ধাপে ফিরুন
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bangla-text rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                অন্য ভুল পরীক্ষা করুন
              </button>
            </div>
          </div>
        ) : currentNode ? (
          /* Question Node */
          <div className="space-y-4">
            <div>
              <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 block">
                ধাপ {history.length + 1}
              </span>
              <h4 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {currentNode.question}
              </h4>
              {currentNode.hint && (
                <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {currentNode.hint}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {currentNode.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-3.5 sm:p-4 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-dark-border dark:bg-dark-card-hover dark:hover:border-emerald-800"
                >
                  <span className="bangla-text text-sm font-semibold text-gray-800 group-hover:text-emerald-800 dark:text-white dark:group-hover:text-emerald-400">
                    {option.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bangla-text text-xs font-semibold text-gray-500 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:text-white"
                >
                  ← পূর্ববর্তী প্রশ্ন
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

