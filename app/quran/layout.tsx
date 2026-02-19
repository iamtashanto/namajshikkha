import { Metadata } from "next";

export const metadata: Metadata = {
    title: "আল-কুরআন | ১১৪টি সূরা — নামাজ শিক্ষা",
    description: "পবিত্র আল-কুরআনের ১১৪টি সূরার তালিকা। অর্থসহ পড়ুন এবং তিলাওয়াত শুনুন।",
};

export default function QuranLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
