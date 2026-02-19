import { Metadata } from "next";

export const metadata: Metadata = {
    title: "সূরা ও দোয়া | অর্থ ও অডিও সহ — নামাজ শিক্ষা",
    description: "নামাজে ব্যবহৃত সকল সূরা ও দোয়া। আরবি টেক্সট, বাংলা উচ্চারণ ও অর্থ সহ শিখুন এবং অডিও শুনুন।",
};

export default function SurahDuaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
