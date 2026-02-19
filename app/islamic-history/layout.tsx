import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ইসলামের ইতিহাস | প্রাক-ইসলাম থেকে আধুনিক যুগ — নামাজ শিক্ষা",
    description: "ইসলামের ইতিহাসের কালপর্বসমূহ: জাহিলিয়্যাত, মাক্কী ও মাদানী জীবন, খিলাফতে রাশেদা, উমাইয়া, আব্বাসীয় ও অটোমান সাম্রাজ্যের ইতিহাস।",
};

export default function HistoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
