"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "অনুসন্ধান করুন..." }: SearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-emerald-400 dark:text-emerald-500" />
            <input
                id="search-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bangla-text w-full rounded-xl border border-emerald-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm transition-all placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:placeholder:text-dark-text-muted dark:focus:border-emerald-600 dark:focus:ring-emerald-900/30"
            />
        </div>
    );
}
