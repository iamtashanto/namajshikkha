import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-emerald-100 bg-emerald-950 text-emerald-100 dark:border-dark-border dark:bg-dark-card">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    {/* Islamic Greeting */}
                    <p className="arabic-text text-2xl text-gold-300 dark:text-gold-400">
                        بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                    </p>

                    {/* Bangla tagline */}
                    <p className="bangla-text text-sm text-emerald-300 dark:text-emerald-400/80">
                        সঠিকভাবে নামাজ শিখুন, আল্লাহর নৈকট্য লাভ করুন
                    </p>

                    {/* Divider */}
                    <div className=" h-px w-24 bg-gradient-to-r from-transparent via-emerald-600 to-transparent dark:via-emerald-500" />

                    {/* Copyright */}
                    <p className="flex items-center gap-1.5 text-xs text-emerald-400 dark:text-emerald-500/80">
                        <p className="bangla-text text-sm text-emerald-300/80 dark:text-emerald-400/60">
                            Developed by <span className="font-semibold text-gold-400">Md Tanvir Ahamed Shanto</span>
                        </p>{" "}
                        নামাজ শিক্ষা © {new Date().getFullYear()}
                    </p>

                    <p className="text-xs text-emerald-500 dark:text-emerald-600 ">
                        সকল তথ্য সহীহ হাদিস ও কুরআন থেকে সংগৃহীত
                    </p>
                </div>
            </div>
        </footer>
    );
}
