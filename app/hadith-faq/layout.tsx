import { Metadata } from "next";

export const metadata: Metadata = {
    title: "হাদিস ও প্রশ্ন-উত্তর | নামাজ সম্পর্কিত মাসআলা — নামাজ শিক্ষা",
    description: "নামাজ, ওজু ও পবিত্রতা সম্পর্কে সহীহ হাদিস এবং সচরাচর জিজ্ঞাসিত প্রশ্নের (FAQ) উত্তর।",
};

export default function HadithFAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
