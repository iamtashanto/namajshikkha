import { Metadata } from "next";

export const metadata: Metadata = {
    title: "নামাজের বিবরণ | রাকাত, ওয়াক্ত ও নিয়মাবলী — নামাজ শিক্ষা",
    description: "ফজর, জোহর, আসর, মাগরিব ও এশা — পাঁচ ওয়াক্ত নামাজের রাকাত সংখ্যা, সুন্নাত, ফরজ ও বিতরের বিস্তারিত বিবরণ।",
};

export default function NamajDetailsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
