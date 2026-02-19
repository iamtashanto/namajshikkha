import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface NavigationCardProps {
    href: string;
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

export default function NavigationCard({
    href,
    icon: Icon,
    title,
    description,
    color,
}: NavigationCardProps) {
    const colorMap: Record<string, { bg: string; iconBg: string; border: string; hover: string }> = {
        emerald: {
            bg: "bg-emerald-50",
            iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            border: "border-emerald-100",
            hover: "hover:border-emerald-300 hover:shadow-emerald-100",
        },
        gold: {
            bg: "bg-gold-50",
            iconBg: "bg-gradient-to-br from-gold-400 to-gold-600",
            border: "border-gold-100",
            hover: "hover:border-gold-300 hover:shadow-gold-100",
        },
        blue: {
            bg: "bg-blue-50",
            iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
            border: "border-blue-100",
            hover: "hover:border-blue-300 hover:shadow-blue-100",
        },
        purple: {
            bg: "bg-purple-50",
            iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
            border: "border-purple-100",
            hover: "hover:border-purple-300 hover:shadow-purple-100",
        },
    };

    const colors = colorMap[color] || colorMap.emerald;

    return (
        <Link
            href={href}
            className={`group block rounded-2xl border ${colors.border} ${colors.bg} p-6 transition-all duration-300 ${colors.hover} hover:shadow-lg hover:-translate-y-1`}
        >
            <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg} shadow-md transition-transform group-hover:scale-110`}
            >
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="bangla-text mb-2 text-lg font-bold text-gray-800">
                {title}
            </h3>
            <p className="bangla-text text-sm leading-relaxed text-gray-500">
                {description}
            </p>
        </Link>
    );
}
