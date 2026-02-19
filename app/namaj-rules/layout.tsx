import { Metadata } from "next";

export const metadata: Metadata = {
    title: "নামাজের নিয়ম | চিত্রসহ ধাপে ধাপে নামাজ শিক্ষা",
    description: "পুরুষ ও মহিলাদের জন্য নামাজের সঠিক নিয়ম। রুকু, সেজদা, ওজু ও তাশাহহুদের চিত্রসহ বিস্তারিত গাইড।",
};

export default function NamajRulesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
