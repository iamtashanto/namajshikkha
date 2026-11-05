import { PrayerType } from "@/src/types/content";

export const prayers: PrayerType[] = [
  {
    "slug": "fajr",
    "nameBn": "ফজর",
    "nameAr": "الفَجْر",
    "nameEn": "Fajr",
    "category": "fard",
    "group": "daily-fard",
    "timeDescriptionBn": "সুবহে সাদিক (ভোরের আলো দিগন্তে উদ্ভাসিত হওয়া) থেকে শুরু করে সূর্যোদয়ের পূর্ব পর্যন্ত।",
    "totalRakats": 4,
    "simulatorConfigId": "fajr-main",
    "niyyat": {
      "id": "niyyat-fajr",
      "titleBn": "ফজরের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Fajr Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ الْفَجْرِ فَرْضَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিল ফাজরি ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatil-fajri fardullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির জন্য কিবলামুখী হয়ে ফজরের দুই রাকাত ফরজ নামাজ আদায় করার সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি ফজর ও আসরের নামাজ যত্নসহকারে সময়মতো আদায় করবে, সে জাহান্নামে যাবে না এবং জান্নাতে প্রবেশ করবে।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬৩৪",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত সুন্নাত (মুয়াক্কাদাহ)",
        "count": 2,
        "status": "sunnah",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত ফরজ",
        "count": 2,
        "status": "fard",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম রাকাত",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "তাকবীরে তাহরীমা, সানা, সূরা ফাতিহা ও অন্য সূরা",
        "descriptionBn": "কিবলামুখী হয়ে দাঁড়িয়ে দুই হাত তুলে 'আল্লাহু আকবার' বলে হাত বাঁধুন। নিচু স্বরে সানা পড়ুন। এরপর আউযুবিল্লাহ ও বিসমিল্লাহ পড়ে সূরা ফাতিহা পড়ুন এবং অন্য একটি সূরা মিলান।",
        "recitationId": "dua-1",
        "maleRule": "পুরুষরা হাত কানের লতি পর্যন্ত তুলবেন এবং নাভির নিচে হাত বাঁধবেন।",
        "femaleRule": "মহিলারা হাত বুক বা কাঁধ পর্যন্ত তুলবেন এবং বুকের উপর হাত বাঁধবেন।",
        "tips": "ফজরের ফরজ নামাজে কেরাত স্বাভাবিকের চেয়ে কিছুটা দীর্ঘ করা সুন্নাত।"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "১ম রাকাত",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "রুকু ও সেজদা",
        "descriptionBn": "'আল্লাহু আকবার' বলে রুকুতে যান এবং তিনবার রুকুর তাসবীহ পড়ুন। 'সামি'আল্লাহু লিমান হামিদাহ' বলে সোজা হয়ে দাঁড়িয়ে 'রাব্বানা লাকাল হামদ' বলুন। এরপর দুটি সেজদা সম্পন্ন করুন।",
        "recitationId": "dua-6",
        "maleRule": "রুকুতে পিঠ সোজা রাখুন, সেজদায় পেট উরু থেকে আলাদা রাখুন।",
        "femaleRule": "রুকুতে সামান্য ঝুঁকুন, সেজদায় জড়োসড়ো হয়ে বাহু ও পেট একসাথে রাখুন।"
      },
      {
        "stepNumber": 3,
        "rakatLabel": "২য় রাকাত",
        "rakatsApplicable": [
          2
        ],
        "titleBn": "ক্বিয়াম, ক্বিরাত ও বৈঠক",
        "descriptionBn": "সোজা হয়ে দাঁড়িয়ে বিসমিল্লাহ পড়ে সূরা ফাতিহা ও অন্য সূরা পড়ুন। রুকু ও দুটি সেজদা শেষ করে শেষ বৈঠকে বসুন।",
        "recitationId": "dua-2",
        "maleRule": "বাম পা বিছিয়ে তার উপর বসুন এবং ডান পা খাড়া রাখুন।",
        "femaleRule": "উভয় পা ডান দিক দিয়ে বের করে নিতম্বের উপর বসুন।"
      },
      {
        "stepNumber": 4,
        "rakatLabel": "শেষ বৈঠক ও সমাপ্তি",
        "rakatsApplicable": [
          2
        ],
        "titleBn": "তাশাহহুদ, দুরূদ, দোয়া মাসুরা ও সালাম",
        "descriptionBn": "শেষ বৈঠকে আত্তাহিয়্যাতু, দুরূদে ইব্রাহীম ও দোয়া মাসুরা পড়ে ডানে ও বামে সালাম ফিরিয়ে নামাজ সম্পন্ন করুন।",
        "recitationId": "dua-3"
      }
    ],
    "genderDifferences": {
      "male": [
        "তাকবীরে তাহরীমায় উভয় হাত কানের লতি পর্যন্ত তোলা।",
        "ডান হাত দিয়ে বাম হাতের কব্জি ধরে নাভির নিচে হাত বাঁধা।",
        "রুকুতে পিঠ অনুভূমিক সোজা রাখা এবং আঙুল ফাঁক করে হাঁটু শক্তভাবে ধরা।",
        "সেজদায় বাহু জমিন থেকে এবং পেট উরু থেকে পৃথক রাখা।",
        "বৈঠকে বাম পায়ের পাতার উপর বসা এবং ডান পা খাড়া রাখা।"
      ],
      "female": [
        "তাকবীরে হাত ওড়নার ভেতর থেকে কাঁধ বা বুক বরাবর তোলা।",
        "বুকের উপর ডান হাত বাম হাতের পিঠের উপর স্থাপন করে হাত বাঁধা।",
        "রুকুতে সামান্য ঝুঁকা যাতে হাত কেবল হাঁটু স্পর্শ করে, আঙুল মিলিয়ে রাখা।",
        "সেজদায় সম্পূর্ণ জড়োসড়ো হয়ে বাহু জমিনের সাথে এবং পেট উরুর সাথে মিলিয়ে রাখা।",
        "বৈঠকে উভয় পা ডান পাশে বের করে মাটির উপর বসা (তাওয়াররুক)।"
      ],
      "note": "হানাফি ফিকহে মহিলাদের সতর ও পর্দার অনুকূল অঙ্গভঙ্গির বিশেষ গুরুত্ব দেয়া হয়েছে।"
    },
    "commonMistakes": [
      "সূর্যোদয়ের ঠিক আগ মুহূর্তে ঘুম থেকে উঠে তড়িঘড়ি করে নামাজ পড়া।",
      "ফজরের সুন্নাত অত্যন্ত গুরুত্বপূর্ণ (মুয়াক্কাদা), অবহেলা করে ছেড়ে দেওয়া বড় ক্ষতি।",
      "রুকু ও সেজদায় ধীরস্থিরতা (তা'দিলে আরকান) না বজায় রাখা।",
      "সেজদা করার সময় উভয় পা জমিন থেকে পুরোপুরি তুলে রাখা।",
      "রুকু থেকে সোজা হয়ে না দাঁড়িয়েই সেজদায় চলে যাওয়া।"
    ],
    "faqs": [
      {
        "question": "ফজরের নামাজের সময় কখন শুরু ও শেষ হয়?",
        "answer": "সুবহে সাদিক বা ভোরের প্রথম শুভ্রতা থেকে ফজরের ওয়াক্ত শুরু হয় এবং সূর্যোদয়ের পূর্ব মুহূর্ত পর্যন্ত স্থায়ী থাকে। সূর্যোদয় শুরু হলে নামাজ মাকরূহে তাহরীমী।"
      },
      {
        "question": "ফজরের সুন্নাত পড়তে না পারলে পরে কি তা কাযা করতে হবে?",
        "answer": "যদি কারও ফজরের ফরজ ও সুন্নাত উভয়টি ছুটে যায়, তবে সূর্য ওঠার পর যোহরের পূর্বে সুন্নাতসহ কাযা করা উত্তম। তবে শুধু সুন্নাত ছুটে গেলে সূর্যোদয়ের পর যোহরের আগে পড়ে নেয়া ভালো।"
      },
      {
        "question": "ফজরের জামাত শুরু হয়ে গেলে কি সুন্নাত পড়া যাবে?",
        "answer": "হানাফি মাজহাব মতে, জামাত শুরু হলেও যদি অন্তত দ্বিতীয় রাকাতে ইমামের সাথে তাশাহহুদে শরীক হওয়ার প্রবল সম্ভাবনা থাকে, তবে মসজিদের একপাশে দ্রুত সুন্নাত পড়ে জামাতে যোগ দেয়া যায়।"
      },
      {
        "question": "মহিলারা কি ঘরে ফজরের নামাজ জামাতে পড়তে পারেন?",
        "answer": "মহিলারা একাকী ঘরে নামাজ পড়বেন। মহিলাদের জন্য আলাদা জামাত করা হানাফি ফিকহে মাকরূহে তানজিহী।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৭৭",
        "grade": "sahih"
      },
      {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬৫৭",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "dhuhr",
      "witr",
      "tahajjud"
    ],
    "relatedRulings": [
      "ruling-salah-ahkam",
      "ruling-salah-arkan",
      "ruling-gender-differences"
    ]
  },
  {
    "slug": "dhuhr",
    "nameBn": "যোহর",
    "nameAr": "الظُّهْر",
    "nameEn": "Dhuhr",
    "category": "fard",
    "group": "daily-fard",
    "timeDescriptionBn": "দুপুরে সূর্য মধ্যাকাশ থেকে পশ্চিমাকাশে ঢলে পড়ার পর থেকে কোনো বস্তুর ছায়া মূল ছায়া বাদে দ্বিগুণ হওয়া পর্যন্ত।",
    "totalRakats": 12,
    "simulatorConfigId": "dhuhr-main",
    "niyyat": {
      "id": "niyyat-dhuhr",
      "titleBn": "যোহরের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Dhuhr Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ رَكَعَاتِ صَلَاةِ الظُّهْرِ فَرْضَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ রাকা'আতি সালাতিজ জুহরি ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a raka'ati salatidh-dhuhri fardullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে যোহরের চার রাকাত ফরজ নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি যোহরের ফরজ নামাজের পূর্বে চার রাকাত এবং পরে চার রাকাত নিয়মিত আদায় করবে, আল্লাহ তার জন্য জাহান্নামের আগুন হারাম করে দেবেন।",
      "reference": {
        "type": "hadith",
        "source": "সুনানে তিরমিযী",
        "number": "৪২৭",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত সুন্নাত (মুয়াক্কাদাহ)",
        "count": 4,
        "status": "sunnah",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "৪ রাকাত ফরজ",
        "count": 4,
        "status": "fard",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত সুন্নাত (মুয়াক্কাদাহ)",
        "count": 2,
        "status": "sunnah",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম ও ২য় রাকাত",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "তাকবীর, কিরাত, রুকু ও প্রথম বৈঠক",
        "descriptionBn": "তাকবীরে তাহরীমা বেঁধে সানা, সূরা ফাতিহা ও অন্য সূরা পড়ুন। রুকু ও দুটি সেজদা সম্পন্ন করে দ্বিতীয় রাকাত পড়ুন। দ্বিতীয় রাকাত শেষে প্রথম বৈঠকে বসে শুধু তাশাহহুদ পড়ুন।",
        "recitationId": "dua-2"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "৩য় ও ৪র্থ রাকাত",
        "rakatsApplicable": [
          3,
          4
        ],
        "titleBn": "৩য় ও ৪র্থ রাকাত এবং শেষ বৈঠক",
        "descriptionBn": "আল্লাহু আকবার বলে উঠে দাঁড়ান। ফরজ নামাজের ৩য় ও ৪র্থ রাকাতে শুধু সূরা ফাতিহা পড়ুন (অন্য সূরা মিলানো লাগবে না)। এরপর রুকু, দুটি সেজদা এবং শেষ বৈঠকে তাশাহহুদ, দুরূদ ও দোয়া মাসুরা পড়ে সালাম ফেরান।",
        "recitationId": "dua-3",
        "tips": "সুন্নাত নামাজে কিন্তু চার রাকাতেই সূরা ফাতিহার সাথে অন্য সূরা মিলানো ওয়াজিব।"
      }
    ],
    "genderDifferences": {
      "male": [
        "হাত বাঁধার স্থান নাভির নিচে।",
        "রুকুতে পিঠ সোজা রাখা।"
      ],
      "female": [
        "হাত বাঁধার স্থান বুকের উপর।",
        "রুকু ও সেজদায় জড়োসড়ো হয়ে থাকা।"
      ]
    },
    "commonMistakes": [
      "ফরজ নামাজের ৩য় ও ৪র্থ রাকাতে সূরা ফাতিহার পর অতিরিক্ত সূরা মিলানো (ফরজে সুন্নাত হলো শুধু ফাতিহা পড়া)।",
      "প্রথম বৈঠকে তাশাহহুদের পর ভুল করে দুরূদ পড়ে ফেলা (এর জন্য সিজদায়ে সাহু ওয়াজিব হয় যদি 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ' পর্যন্ত পড়ে ফেলা হয়)।",
      "কাজের ব্যস্ততায় ওয়াক্তের শেষ সীমায় নামাজ ঠেলে দেওয়া।"
    ],
    "faqs": [
      {
        "question": "যোহরের ৪ রাকাত ফরজের ৩য় ও ৪র্থ রাকাতে কি সূরা মিলাতে হবে?",
        "answer": "না। হানাফি ফিকহ অনুযায়ী চার রাকাত বা তিন রাকাত বিশিষ্ট ফরজ নামাজের প্রথম দুই রাকাতে সূরা ফাতিহার সাথে অন্য সূরা মিলানো ওয়াজিব, কিন্তু শেষ রাকাতে শুধুমাত্র সূরা ফাতিহা পড়া সুন্নাত।"
      },
      {
        "question": "প্রথম বৈঠকে ভুল করে দুরূদ পড়ে ফেললে কী করণীয়?",
        "answer": "প্রথম বৈঠকে তাশাহহুদের পর যদি কেউ ভুলে 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ' বা তার বেশি পড়ে ফেলে, তবে নামাজের শেষে সিজদায়ে সাহু দেওয়া ওয়াজিব হবে।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬১২",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "fajr",
      "asr",
      "jumuah"
    ],
    "relatedRulings": [
      "ruling-salah-wajib",
      "ruling-sajda-sahu"
    ]
  },
  {
    "slug": "asr",
    "nameBn": "আসর",
    "nameAr": "العَصْر",
    "nameEn": "Asr",
    "category": "fard",
    "group": "daily-fard",
    "timeDescriptionBn": "যোহরের ওয়াক্ত শেষ হওয়ার পর থেকে সূর্যাস্তের পূর্ব পর্যন্ত। তবে রোদ হলুদ বর্ণ ধারণ করার পূর্বে আদায় করা জরুরি।",
    "totalRakats": 8,
    "simulatorConfigId": "asr-main",
    "niyyat": {
      "id": "niyyat-asr",
      "titleBn": "আসরের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Asr Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ رَكَعَاتِ صَلَاةِ الْعَصْرِ فَرْضَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ রাকা'আতি সালাতিল আসরি ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a raka'ati salatil-asri fardullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে আসরের চার রাকাত ফরজ নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "কুরআনে বিশেষ গুরুত্ব দিয়ে বলা হয়েছে: 'তোমরা সমস্ত সালাতের প্রতি যত্নবান হও, বিশেষ করে মধ্যবর্তী সালাত (আসর)-এর প্রতি।' (সূরা বাক্বারা ২:২৩৮)",
      "reference": {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৫৩",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত সুন্নাত (গাইরে মুয়াক্কাদাহ)",
        "count": 4,
        "status": "sunnah",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "৪ রাকাত ফরজ",
        "count": 4,
        "status": "fard",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম ও ২য় রাকাত",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "তাকবীর, কিরাত ও রুকু-সেজদা",
        "descriptionBn": "তাকবীরে তাহরীমা বেঁধে অনুচ্চ স্বরে সানা, সূরা ফাতিহা ও অন্য সূরা পড়ুন। রুকু ও সেজদা সম্পন্ন করে প্রথম বৈঠকে তাশাহহুদ পড়ুন।",
        "recitationId": "dua-2"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "৩য় ও ৪র্থ রাকাত",
        "rakatsApplicable": [
          3,
          4
        ],
        "titleBn": "৩য় ও ৪র্থ রাকাত এবং সালাম",
        "descriptionBn": "ফরজের ৩য় ও ৪র্থ রাকাতে শুধু সূরা ফাতিহা পড়ুন। রুকু-সেজদা শেষে শেষ বৈঠকে তাশাহহুদ, দুরূদ ও দোয়া মাসুরা পড়ে ডানে-বামে সালাম ফেরান।",
        "recitationId": "dua-3"
      }
    ],
    "commonMistakes": [
      "সূর্যাস্তের সময় পর্যন্ত নামাজ বিলম্বিত করা (সূর্য হলুদ হয়ে যাওয়ার পর নামাজ পড়া মাকরূহে তাহরীমী)।",
      "আসরের নামাজের পর মাগরিব পর্যন্ত কোনো নফল নামাজ পড়া নিষেধ (মাকরূহ ওয়াক্ত)।"
    ],
    "faqs": [
      {
        "question": "সূর্য ডোবার কিছুক্ষণ আগে কি আসরের নামাজ পড়া যাবে?",
        "answer": "যদি কোনো কারণে আসরের নামাজ আদায়ে দেরি হয়ে যায়, তবে সূর্য ডোবার পূর্বে হলেও ওই দিনের আসরের ফরজ নামাজ পড়ে নিতে হবে। তবে ইচ্ছাকৃতভাবে এতটা বিলম্ব করা অত্যন্ত গোনাহের কাজ।"
      },
      {
        "question": "আসরের পর নফল নামাজ পড়া যায় কি?",
        "answer": "না। আসরের ফরজ নামাজ আদায়ের পর থেকে মাগরিবের আজান পর্যন্ত যেকোনো ধরনের নফল নামাজ পড়া মাকরূহে তাহরীমী।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৫৪",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "dhuhr",
      "maghrib"
    ],
    "relatedRulings": [
      "ruling-salah-arkan",
      "ruling-salah-wajib"
    ]
  },
  {
    "slug": "maghrib",
    "nameBn": "মাগরিব",
    "nameAr": "المَغْرِب",
    "nameEn": "Maghrib",
    "category": "fard",
    "group": "daily-fard",
    "timeDescriptionBn": "সূর্যাস্তের পর থেকে পশ্চিমাকাশের লালিমা দূর হওয়া পর্যন্ত (প্রায় ১ ঘণ্টা ১৫ মিনিট)।",
    "totalRakats": 7,
    "simulatorConfigId": "maghrib-main",
    "niyyat": {
      "id": "niyyat-maghrib",
      "titleBn": "মাগরিবের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Maghrib Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ ثَلَاثَ رَكَعَاتِ صَلَاةِ الْمَغْرِبِ فَرْضَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা সালাসা রাকা'আতি সালাতিল মাগরিবি ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala thalatha raka'ati salatil-maghribi fardullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে মাগরিবের তিন রাকাত ফরজ নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "মাগরিবের পর যে ব্যক্তি ছয় রাকাত নফল (আউওয়াবীন) নামাজ আদায় করে, সে বারো বছর ইবাদতের সওয়াব লাভ করে।",
      "reference": {
        "type": "hadith",
        "source": "সুনানে তিরমিযী",
        "number": "৪৩৫",
        "grade": "hasan"
      }
    },
    "rakatUnits": [
      {
        "label": "৩ রাকাত ফরজ",
        "count": 3,
        "status": "fard",
        "config": {
          "rakats": 3,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত সুন্নাত (মুয়াক্কাদাহ)",
        "count": 2,
        "status": "sunnah",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম ও ২য় রাকাত",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "সশব্দে কিরাত ও প্রথম বৈঠক",
        "descriptionBn": "তাকবীরে তাহরীমা বেঁধে সূরা ফাতিহা ও অন্য সূরা পড়ুন (ইমামের জন্য সশব্দে)। রুকু-সেজদা শেষে দ্বিতীয় রাকাতে বৈঠক করে শুধু তাশাহহুদ পড়ুন।",
        "recitationId": "dua-2"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "৩য় রাকাত",
        "rakatsApplicable": [
          3
        ],
        "titleBn": "৩য় রাকাত ও শেষ বৈঠক",
        "descriptionBn": "উঠে দাঁড়িয়ে অনুচ্চ স্বরে শুধু সূরা ফাতিহা পড়ুন। রুকু ও দুটি সেজদা সম্পন্ন করে শেষ বৈঠকে তাশাহহুদ, দুরূদ ও দোয়া মাসুরা পড়ে সালাম ফেরান।",
        "recitationId": "dua-4"
      }
    ],
    "commonMistakes": [
      "মাগরিবের ওয়াক্ত সীমিত, তাই নামাজ শুরু করতে অতিরিক্ত দেরি করা।",
      "৩য় রাকাতে ভুল করে অন্য সূরা মিলিয়ে ফেলা।"
    ],
    "faqs": [
      {
        "question": "মাগরিবে কত রাকাত ফরজ ও কত রাকাত সুন্নাত?",
        "answer": "মাগরিবে প্রথমে ৩ রাকাত ফরজ, এরপর ২ রাকাত সুন্নাতে মুয়াক্কাদা এবং শেষে ২ রাকাত নফল (মোট ৭ রাকাত)।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬১২",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "asr",
      "isha"
    ],
    "relatedRulings": [
      "ruling-salah-arkan",
      "ruling-salah-wajib"
    ]
  },
  {
    "slug": "isha",
    "nameBn": "ইশা",
    "nameAr": "العِشَاء",
    "nameEn": "Isha",
    "category": "fard",
    "group": "daily-fard",
    "timeDescriptionBn": "মাগরিবের পর পশ্চিমাকাশের সাদা আভা মিলিয়ে যাওয়ার পর থেকে সুবহে সাদিকের পূর্ব পর্যন্ত (রাতের ১ম তৃতীয়াংশে উত্তম)।",
    "totalRakats": 17,
    "simulatorConfigId": "isha-main",
    "niyyat": {
      "id": "niyyat-isha",
      "titleBn": "ইশার নামাজের নিয়্যত",
      "titleEn": "Niyyah for Isha Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ رَكَعَاتِ صَلَاةِ الْعِشَاءِ فَرْضَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ রাকা'আতি সালাতিল ইশা-ই ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a raka'ati salatil-isha'i fardullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে ইশার চার রাকাত ফরজ নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি জামাতে এশার নামাজ আদায় করল, সে যেন অর্ধরাত জেগে নামাজ পড়ল। আর যে ফজরের নামাজও জামাতে পড়ল, সে যেন পূর্ণ রাত নামাজ পড়ল।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬৫৬",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত সুন্নাত (গাইরে মুয়াক্কাদাহ)",
        "count": 4,
        "status": "sunnah",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "৪ রাকাত ফরজ",
        "count": 4,
        "status": "fard",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত সুন্নাত (মুয়াক্কাদাহ)",
        "count": 2,
        "status": "sunnah",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "৩ রাকাত বিতর (ওয়াজিব)",
        "count": 3,
        "status": "wajib",
        "config": {
          "rakats": 3,
          "qiratRakats": [
            1,
            2,
            3
          ],
          "firstSittingAfter": 2,
          "hasQunut": {
            "enabled": true,
            "rakat": 3,
            "position": "before-ruku"
          },
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "৪ রাকাত ফরজ",
        "rakatsApplicable": [
          1,
          2,
          3,
          4
        ],
        "titleBn": "ইশার ফরজ নামাজ",
        "descriptionBn": "প্রথম দুই রাকাতে ইমাম সশব্দে কিরাত পড়বেন। দুই রাকাত শেষে প্রথম বৈঠকে তাশাহহুদ হবে। ৩য় ও ৪র্থ রাকাতে অনুচ্চ স্বরে সূরা ফাতিহা পড়ে শেষ বৈঠকে সালাম ফেরাবেন।",
        "recitationId": "dua-2"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "৩ রাকাত বিতর (ওয়াজিব)",
        "rakatsApplicable": [
          1,
          2,
          3
        ],
        "titleBn": "বিতর নামাজ ও দোয়া কুনূত",
        "descriptionBn": "বিতরের প্রতি রাকাতেই সূরা ফাতিহার সাথে অন্য সূরা পড়তে হয়। ৩য় রাকাতে কিরাত শেষে রুকুতে যাওয়ার আগে 'আল্লাহু আকবার' বলে কান পর্যন্ত হাত তুলে পুনরায় হাত বেঁধে দোয়া কুনূত পড়ুন। এরপর রুকু ও সেজদা করে সালাম ফেরান।",
        "recitationId": "dua-5",
        "tips": "বিতরে দোয়া কুনূত পড়া ওয়াজিব।"
      }
    ],
    "commonMistakes": [
      "বিতর নামাজে কুনূতের তাকবীর ভুলে সরাসরি রুকুতে চলে যাওয়া।",
      "মধ্যরাত পার হয়ে যাওয়ার পর অলসতায় ইশার নামাজ বিলম্বিত করা।"
    ],
    "faqs": [
      {
        "question": "বিতর নামাজে দোয়া কুনূত ভুলে গেলে কী করতে হবে?",
        "answer": "যদি ৩য় রাকাতে দোয়া কুনূত পড়তে ভুলে সরাসরি রুকুতে চলে যান, তবে রুকু থেকে ফিরে আসবেন না। নামাজ যথারীতি শেষ করে শেষ বৈঠকে সিজদায়ে সাহু দিলে নামাজ শুদ্ধ হয়ে যাবে।"
      },
      {
        "question": "বিতর নামাজ কি তাহাজ্জুদের সাথে পড়া যায়?",
        "answer": "হ্যাঁ। যিনি নিয়মিত তাহাজ্জুদ পড়তে অভ্যস্ত, তার জন্য বিতর নামাজ তাহাজ্জুদের শেষে রাতের সর্বশেষ নামাজ হিসেবে পড়া মুস্তাহাব।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৬৮",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "maghrib",
      "witr",
      "tahajjud"
    ],
    "relatedRulings": [
      "ruling-salah-wajib",
      "ruling-sajda-sahu"
    ]
  },
  {
    "slug": "witr",
    "nameBn": "বিতর নামাজ",
    "nameAr": "صَلَاةُ الوِتْر",
    "nameEn": "Witr",
    "category": "wajib",
    "group": "wajib",
    "timeDescriptionBn": "ইশার নামাজের পর থেকে সুবহে সাদিকের পূর্ব পর্যন্ত বিতরের সময়।",
    "totalRakats": 3,
    "simulatorConfigId": "witr-main",
    "niyyat": {
      "id": "niyyat-witr",
      "titleBn": "বিতর নামাজের নিয়্যত",
      "titleEn": "Niyyah for Witr Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ ثَلَاثَ رَكَعَاتِ صَلَاةِ الْوِتْرِ وَاجِبَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা সালাসা রাকা'আতি সালাতিল বিতরি ওয়াজিবুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala thalatha raka'ati salatil-witri wajibullahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে বিতরের তিন রাকাত ওয়াজিব নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "আল্লাহ তাআলা বেজোড়, তিনি বেজোড় নামাজ ভালোবাসেন। তাই তোমরা বিতর নামাজ পড়। (আবু দাউদ ১৪১৬)",
      "reference": {
        "type": "hadith",
        "source": "সুনানে আবু দাউদ",
        "number": "১৪১৬",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৩ রাকাত বিতর (ওয়াজিব)",
        "count": 3,
        "status": "wajib",
        "config": {
          "rakats": 3,
          "qiratRakats": [
            1,
            2,
            3
          ],
          "firstSittingAfter": 2,
          "hasQunut": {
            "enabled": true,
            "rakat": 3,
            "position": "before-ruku"
          },
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম ও ২য় রাকাত",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "প্রথম দুই রাকাত ও প্রথম বৈঠক",
        "descriptionBn": "প্রথম দুই রাকাতেই সূরা ফাতিহার পর অন্য সূরা মিলান। ২য় রাকাত শেষে তাশাহহুদ পড়ুন।",
        "recitationId": "dua-2"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "৩য় রাকাত ও দোয়া কুনূত",
        "rakatsApplicable": [
          3
        ],
        "titleBn": "কুনূতের তাকবীর ও দোয়া কুনূত",
        "descriptionBn": "৩য় রাকাতে সূরা ফাতিহা ও অন্য সূরা পড়ে রুকুতে না গিয়ে 'আল্লাহু আকবার' বলে কান পর্যন্ত হাত তুলে আবার হাত বাঁধুন এবং দোয়া কুনূত পাঠ করুন। এরপর রুকু-সেজদা করে সালাম ফেরান।",
        "recitationId": "dua-5",
        "tips": "দোয়া কুনূত মুখস্থ না থাকলে আপাতত 'রাব্বানা আতিনা ফিদ-দুনিয়া...' বা ৩ বার 'আল্লাহুম্মাগফিরলী' পড়া যায়।"
      }
    ],
    "commonMistakes": [
      "৩য় রাকাতে কিরাত শেষেই সরাসরি রুকুতে চলে যাওয়া।",
      "কুনূতের তাকবীরে হাত না তোলা।"
    ],
    "faqs": [
      {
        "question": "দোয়া কুনূত ভুলে গেলে করণীয় কী?",
        "answer": "দোয়া কুনূত না পড়ে রুকুতে চলে গেলে রুকু ছেড়ে ফিরে আসা যাবে না। নামাজ শেষে সিজদায়ে সাহু করলেই নামাজ শুদ্ধ হয়ে যাবে।"
      },
      {
        "question": "দোয়া কুনূত মুখস্থ না থাকলে কী পড়া যাবে?",
        "answer": "যতদিন দোয়া কুনূত মুখস্থ না হয়, ততদিন 'রাব্বানা আতিনা ফিদ দুনয়া...' অথবা 'আল্লাহুম্মাগফির লী' তিনবার পাঠ করা জায়েজ আছে। তবে দ্রুত দোয়া কুনূত মুখস্থ করে নেওয়া আবশ্যক।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সুনানে আবু দাউদ",
        "number": "১৪২৫",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "isha",
      "tahajjud"
    ],
    "relatedRulings": [
      "ruling-salah-wajib",
      "ruling-sajda-sahu"
    ]
  },
  {
    "slug": "jumuah",
    "nameBn": "জুমআ",
    "nameAr": "الجُمُعَة",
    "nameEn": "Jumuah",
    "category": "fard",
    "group": "jumuah-eid",
    "timeDescriptionBn": "শুক্রবার যোহরের ওয়াক্তে খুতবার পর দুই রাকাত ফরজ নামাজ।",
    "totalRakats": 14,
    "simulatorConfigId": "jumuah-main",
    "niyyat": {
      "id": "niyyat-jumuah",
      "titleBn": "জুমআর নামাজের নিয়্যত",
      "titleEn": "Niyyah for Jumuah Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ الْجُمُعَةِ فَرْضَ اللَّهِ تَعَالَىٰ مَعَ هَٰذَا الْإِمَامِ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিল জুমু'আতি ফারদুল্লাহি তা'আলা মা'আ হাজাল ইমামী মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatil-jumu'ati fardullahi ta'ala ma'a hadhal-imami mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি এই ইমামের পেছনে কিবলামুখী হয়ে আল্লাহর সন্তুষ্টির উদ্দেশ্যে জুমআর দুই রাকাত ফরজ নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি জুমার দিন উত্তমরূপে গোসল করে আগে আগে মসজিদে যাবে এবং মনোযোগ দিয়ে খুতবা শুনবে, তার প্রতি কদমে এক বছরের নফল নামাজ ও রোজার সওয়াব লাভ হবে।",
      "reference": {
        "type": "hadith",
        "source": "সুনানে তিরমিযী",
        "number": "৪৯৬",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত কাবলাল জুমআ (সুন্নাত)",
        "count": 4,
        "status": "sunnah",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত জুমআর ফরজ",
        "count": 2,
        "status": "fard",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "৪ রাকাত বা'দাল জুমআ (সুন্নাত)",
        "count": 4,
        "status": "sunnah",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত সুন্নাত",
        "count": 2,
        "status": "sunnah",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত ফরজ জামাতে",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "খুতবা শ্রবণ ও জামাতে নামাজ",
        "descriptionBn": "খুতবা চলাকালীন সম্পূর্ণ নীরব থাকুন। ইমামের পেছনে ২ রাকাত ফরজ নামাজ সশব্দ কিরাতে আদায় করুন।"
      }
    ],
    "specialRules": [
      {
        "title": "কার ওপর জুমআ ফরজ?",
        "description": "স্বাধীন, সুস্থ, প্রাপ্তবয়স্ক, মুক্বীম (অ-মুসাফির) মুসলিম পুরুষের ওপর জুমআ ফরজ। মহিলা, অসুস্থ ব্যক্তি ও মুসাফিরের ওপর জুমআ ফরজ নয় (তবে তারা পড়লে জুমআ আদায় হয়ে যাবে)।"
      },
      {
        "title": "খুতবার আদব",
        "description": "খুতবা চলাকালীন কথাবার্তা বলা, মোবাইল টেপা, নামাজ পড়া বা কোনো প্রকার আওয়াজ করা সম্পূর্ণ নিষেধ ও মাকরূহে তাহরীমী। এমনকি অপরকে 'চুপ কর' বলাও খুতবার সওয়াব নষ্ট করে দেয়।"
      },
      {
        "title": "দেরিতে এলে করণীয় (মাসবুক)",
        "description": "ইমামকে শেষ বৈঠকে পেলেও তাকবীর বলে নিয়্যত বেঁধে বসে যাবেন। ইমাম সালাম ফেরালে দাঁড়িয়ে ছুটে যাওয়া দুই রাকাত নিজে পড়ে নামাজ সম্পন্ন করবেন।"
      },
      {
        "title": "জুমআ ছুটে গেলে",
        "description": "কোনো কারণে জুমআর জামাত ছুটে গেলে তার বদলে ওই ওয়াক্তের চার রাকাত যোহরের ফরজ নামাজ পড়ে নিতে হবে।"
      }
    ],
    "commonMistakes": [
      "খুতবা চলাকালীন কথাবার্তা বলা বা মোবাইল দেখা।",
      "দেরিতে এসে মুসল্লিদের ঘাড় ডিঙিয়ে সামনের কাতারে যাওয়া।"
    ],
    "faqs": [
      {
        "question": "জুমআ না পড়তে পারলে কি জুমআর কাযা পড়া যাবে?",
        "answer": "না। জুমআ ছুটে গেলে কাযা হিসেবে ৪ রাকাত যোহরের নামাজ পড়তে হয়।"
      },
      {
        "question": "মহিলারা কি জুমআর নামাজ পড়তে পারেন?",
        "answer": "মহিলাদের ওপর জুমআ ফরজ নয়। তারা ঘরে সাধারণ যোহরের ৪ রাকাত নামাজ পড়বেন। তবে মসজিদে নিরাপত্তা ও পর্দার সাথে উপস্থিত হয়ে জুমআ পড়লে তাদের নামাজ আদায় হয়ে যাবে এবং পৃথক যোহর লাগবে না।"
      }
    ],
    "references": [
      {
        "type": "quran",
        "source": "সূরা আল-জুমুআহ",
        "number": "৬২:৯"
      },
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৮৭৭",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "dhuhr",
      "eid-ul-fitr"
    ],
    "relatedRulings": [
      "ruling-salah-fard"
    ]
  },
  {
    "slug": "eid-ul-fitr",
    "nameBn": "ঈদুল ফিতর",
    "nameAr": "عِيدُ الفِطْر",
    "nameEn": "Eid-ul-Fitr",
    "category": "wajib",
    "group": "jumuah-eid",
    "timeDescriptionBn": "ঈদের দিন সূর্য এক বর্শা পরিমাণ (আনুমানিক সূর্যোদয়ের ২০ মিনিট পর) ওঠার পর থেকে দ্বিপ্রহরের পূর্ব পর্যন্ত।",
    "totalRakats": 2,
    "simulatorConfigId": "eid-fitr-main",
    "niyyat": {
      "id": "niyyat-eid-fitr",
      "titleBn": "ঈদুল ফিতরের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Eid-ul-Fitr",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ عِيدِ الْفِطْرِ مَعَ سِتِّ تَكْبِيرَاتٍ وَاجِبِ اللَّهِ تَعَالَىٰ مَعَ هَٰذَا الْإِمَامِ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতি ঈদিল ফিতরি মা'আ সিত্তি তাকবীরাতিন ওয়াজিবুল্লাহি তা'আলা মা'আ হাজাল ইমামী মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salati eedil-fitri ma'a sitti takbeeratin wajibullahi ta'ala ma'a hadhal-imami mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি এই ইমামের পেছনে কিবলামুখী হয়ে অতিরিক্ত ৬ তাকবীরসহ ঈদুল ফিতরের দুই রাকাত ওয়াজিব নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "ঈদের দিন ফেরেশতারা পথের মোড়ে দাঁড়িয়ে ঘোষণা করেন: হে মুসলিমগণ! তোমরা দয়ালু রবের দিকে অগ্রসর হও, যিনি তোমাদের মহা প্রতিদান দান করেন।",
      "reference": {
        "type": "hadith",
        "source": "মু'জামুল কাবীর তাবারানী",
        "number": "৬১৭",
        "grade": "hasan"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত ওয়াজিব (৬ অতিরিক্ত তাকবীরসহ)",
        "count": 2,
        "status": "wajib",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "extraTakbirs": [
            {
              "count": 3,
              "position": "after-sana",
              "rakat": 1
            },
            {
              "count": 3,
              "position": "before-ruku",
              "rakat": 2
            }
          ],
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম রাকাত ও ৩ অতিরিক্ত তাকবীর",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "তাকবীরে তাহরীমা, সানা ও ৩ তাকবীর",
        "descriptionBn": "তাকবীরে তাহরীমা বেঁধে সানা পড়ুন। এরপর ইমামের সাথে ৩ বার কান পর্যন্ত হাত তুলে 'আল্লাহু আকবার' বলুন। ১ম ও ২য় তাকবীরে হাত ছেড়ে দিন, ৩য় তাকবীরে হাত বাঁধুন। এরপর সূরা ফাতিহা ও অন্য সূরা পড়ে রুকু-সেজদা সম্পন্ন করুন।"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "২য় রাকাত ও ৩ অতিরিক্ত তাকবীর",
        "rakatsApplicable": [
          2
        ],
        "titleBn": "কিরাত শেষে রুকুর আগে ৩ তাকবীর",
        "descriptionBn": "২য় রাকাতে প্রথমে সূরা ফাতিহা ও অন্য সূরা পড়া হবে। কিরাত শেষে রুকুতে যাওয়ার আগে ইমামের সাথে ৩ বার তাকবীর বলে হাত ছেড়ে দিন। ৪র্থ তাকবীরে হাত না তুলে সরাসরি রুকুতে চলে যান। এরপর সেজদা ও সালাম ফিরিয়ে নামাজ শেষ করুন।"
      }
    ],
    "specialRules": [
      {
        "title": "ঈদের নামাজের হুকুম",
        "description": "হানাফি মাজহাবে যাদের ওপর জুমআ ফরজ তাদের ওপর ঈদের নামাজ ওয়াজিব।"
      },
      {
        "title": "ঈদের দিনের সুন্নাতসমূহ",
        "description": "১. ভোরে গোসল করা, ২. মেসওয়াক করা, ৩. উত্তম পোশাক পরিধান করা, ৪. সুগন্ধি লাগানো, ৫. ঈদুল ফিতরে ঈদগাহে যাওয়ার আগে মিষ্টিজাতীয় খাবার (যেমন খেজুর) খাওয়া, ৬. পায়ে হেঁটে যাওয়া, ৭. যাওয়ার সময় নিচু স্বরে তাকবীর পাঠ করা, ৮. ভিন্ন পথ দিয়ে বাড়ি ফেরা।"
      },
      {
        "title": "ঈদের খুতবা",
        "description": "জুমআর খুতবা নামাজের আগে দেওয়া হয়, কিন্তু ঈদের খুতবা নামাজের পরে দেওয়া হয় এবং তা মনোযোগ দিয়ে শোনা সুন্নাত।"
      }
    ],
    "commonMistakes": [
      "অতিরিক্ত তাকবীরগুলো কখন হাত বাঁধতে হয় আর কখন ছাড়তে হয় তাতে গুলিয়ে ফেলা।",
      "নামাজ শেষ করেই খুতবা না শুনে উঠে চলে যাওয়া।"
    ],
    "faqs": [
      {
        "question": "ঈদের নামাজে অতিরিক্ত তাকবীর কয়টি ও কীভাবে দিতে হয়?",
        "answer": "হানাফি ফিকহে অতিরিক্ত তাকবীর মোট ৬টি। ১ম রাকাতে সানার পর ৩টি তাকবীর (প্রথম দুটিতে হাত ছেড়ে দেওয়া, ৩য়টিতে হাত বাঁধা)। ২য় রাকাতে কিরাত শেষে রুকুর পূর্বে ৩টি তাকবীর (সবগুলোতে হাত ছেড়ে দেওয়া এবং ৪র্থ তাকবীরে সরাসরি রুকুতে যাওয়া)।"
      },
      {
        "question": "ঈদের নামাজে আজান বা ইকামত আছে কি?",
        "answer": "না। ঈদের নামাজের জন্য কোনো আজান বা ইকামত নেই।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সুনানে আবু দাউদ",
        "number": "১১৫৩",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "jumuah",
      "eid-ul-adha"
    ],
    "relatedRulings": [
      "ruling-salah-wajib"
    ]
  },
  {
    "slug": "eid-ul-adha",
    "nameBn": "ঈদুল আজহা",
    "nameAr": "عِيدُ الأَضْحَى",
    "nameEn": "Eid-ul-Adha",
    "category": "wajib",
    "group": "jumuah-eid",
    "timeDescriptionBn": "১০ই জিলহজ সকালে সূর্য এক বর্শা পরিমাণ ওঠার পর থেকে দ্বিপ্রহরের পূর্ব পর্যন্ত।",
    "totalRakats": 2,
    "simulatorConfigId": "eid-adha-main",
    "niyyat": {
      "id": "niyyat-eid-adha",
      "titleBn": "ঈদুল আজহার নামাজের নিয়্যত",
      "titleEn": "Niyyah for Eid-ul-Adha",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ عِيدِ الْأَضْحَىٰ مَعَ سِتِّ تَكْبِيرَاتٍ وَاجِبِ اللَّهِ تَعَالَىٰ مَعَ هَٰذَا الْإِمَامِ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতি ঈদিল আদহা মা'আ সিত্তি তাকবীরাতিন ওয়াজিবুল্লাহি তা'আলা মা'আ হাজাল ইমামী মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salati eedil-adha ma'a sitti takbeeratin wajibullahi ta'ala ma'a hadhal-imami mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি এই ইমামের পেছনে কিবলামুখী হয়ে অতিরিক্ত ৬ তাকবীরসহ ঈদুল আজহার দুই রাকাত ওয়াজিব নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "ঈদুল আজহার দিনে কুরবানীর পশুর রক্ত মাটিতে পড়ার আগেই তা আল্লাহর দরবারে কবুল হয়ে যায়।",
      "reference": {
        "type": "hadith",
        "source": "সুনানে তিরমিযী",
        "number": "১৪৯৩",
        "grade": "hasan"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত ওয়াজিব (৬ অতিরিক্ত তাকবীরসহ)",
        "count": 2,
        "status": "wajib",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "extraTakbirs": [
            {
              "count": 3,
              "position": "after-sana",
              "rakat": 1
            },
            {
              "count": 3,
              "position": "before-ruku",
              "rakat": 2
            }
          ],
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত ওয়াজিব নামাজ",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "৬ অতিরিক্ত তাকবীরের সাথে নামাজ",
        "descriptionBn": "ঈদুল ফিতরের মতোই অবিকল নিয়মে ৬টি অতিরিক্ত তাকবীরসহ দুই রাকাত নামাজ সম্পন্ন করুন।"
      }
    ],
    "specialRules": [
      {
        "title": "তাকবীরে তাশরীক পাঠের বিধান (ওয়াজিব)",
        "description": "৯ই জিলহজ ফজর থেকে শুরু করে ১৩ই জিলহজ আসর পর্যন্ত মোট ২৩ ওয়াক্তের প্রত্যেক ফরজ নামাজের সালাম ফেরানোর পর একবার তাকবীরে তাশরীক পাঠ করা প্রত্যেক সুস্থ প্রাপ্তবয়স্ক মুসল্লির ওপর ওয়াজিব: 'আল্লাহু আকবার আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার, আল্লাহু আকবার ওয়া লিল্লাহিল হামদ'।"
      },
      {
        "title": "ঈদুল আজহায় ঈদগাহে যাওয়ার আগে না খাওয়া",
        "description": "ঈদুল ফিতরে যাওয়ার আগে মিষ্টি খাওয়া সুন্নাত, কিন্তু ঈদুল আজহায় কিছু না খেয়ে ঈদগাহে যাওয়া এবং নামাজের পর কুরবানীর গোশত দিয়ে প্রথম খাবার খাওয়া সুন্নাত।"
      }
    ],
    "commonMistakes": [
      "ফরজ নামাজের পর তাকবীরে তাশরীক বলতে ভুলে যাওয়া।",
      "ঈদের খুতবা চলাকালে কুরবানীর তাড়া দেখিয়ে ঈদগাহ ত্যাগ করা।"
    ],
    "faqs": [
      {
        "question": "তাকবীরে তাশরীক কখন পড়তে হয় এবং কার ওপর ওয়াজিব?",
        "answer": "৯ই জিলহজ ফজর থেকে ১৩ই জিলহজ আসর পর্যন্ত প্রত্যেক ফরজ নামাজের পর একবার তাকবীরে তাশরীক পড়া ওয়াজিব। পুরুষরা মাঝারি আওয়াজে এবং মহিলারা নিচু স্বরে পড়বেন।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "মুসান্নাফ ইবনে আবি শায়বাহ",
        "number": "৫৬৯৮",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "eid-ul-fitr",
      "jumuah"
    ],
    "relatedRulings": [
      "ruling-salah-wajib"
    ]
  },
  {
    "slug": "janaza",
    "nameBn": "জানাজার নামাজ",
    "nameAr": "صَلَاةُ الجَنَازَة",
    "nameEn": "Salatul Janazah",
    "category": "fard",
    "group": "janaza",
    "timeDescriptionBn": "মৃত ব্যক্তির গোসল ও কাফন সম্পন্ন হওয়ার পর যেকোনো সময় (নিষিদ্ধ ৩টি মাকরূহ সময় ব্যতীত)।",
    "totalRakats": 0,
    "simulatorConfigId": "janaza-main",
    "niyyat": {
      "id": "niyyat-janaza",
      "titleBn": "জানাজার নামাজের নিয়্যত",
      "titleEn": "Niyyah for Funeral Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ تَكْبِيرَاتِ صَلَاةِ الْجَنَازَةِ فَرْضَ الْكِفَايَةِ الدُّعَاءَ لِهَٰذَا الْمَيِّتِ مَعَ هَٰذَا الْإِمَامِ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ তাকবীরাতি সালাতিল জানাজাতি ফারদাল কিফায়াতিদ দু'আ-আ লিহাজাল মায়্যিতি মা'আ হাজাল ইমামী মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a takbeerati salatil-janazati fardal-kifayati ad-du'a-a lihadhal-mayyiti ma'a hadhal-imami mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে ফরযে কিফায়া হিসেবে এই ইমামের পেছনে কিবলামুখী হয়ে এই মৃতের জন্য দোয়ার উদ্দেশ্যে জানাজার চার তাকবীরের নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি কোনো জানাজায় অংশ নিয়ে নামাজ শেষ হওয়া পর্যন্ত থাকে, সে এক ক্বীরাত সওয়াব পায়। আর যে দাফন পর্যন্ত থাকে, সে দুই ক্বীরাত সওয়াব পায়। এক ক্বীরাত ওহুদ পাহাড়ের সমান।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "১৩২৫",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ তাকবীর (দাঁড়িয়ে সালাত, রুকু ও সেজদাবিহীন)",
        "count": 0,
        "status": "fard",
        "config": {
          "rakats": 0,
          "qiratRakats": [],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": true,
          "jahr": [],
          "sajdaCount": 0,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "১ম তাকবীর",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "তাকবীরে তাহরীমা ও সানা",
        "descriptionBn": "হাত কান পর্যন্ত তুলে 'আল্লাহু আকবার' বলে নাভির নিচে (মহিলারা বুকের ওপর) হাত বাঁধুন এবং জানাজার সানা পাঠ করুন।",
        "recitationId": "dua-sana-janaza"
      },
      {
        "stepNumber": 2,
        "rakatLabel": "২য় তাকবীর",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "হাত না তুলে ২য় তাকবীর ও দুরূদ শরীফ",
        "descriptionBn": "হাত না তুলে মুখে 'আল্লাহু আকবার' বলুন এবং দুরূদে ইব্রাহীম পাঠ করুন।",
        "recitationId": "dua-3"
      },
      {
        "stepNumber": 3,
        "rakatLabel": "৩য় তাকবীর",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "হাত না তুলে ৩য় তাকবীর ও জানাজার দোয়া",
        "descriptionBn": "হাত না তুলে 'আল্লাহু আকবার' বলুন এবং মৃত ব্যক্তির জন্য নির্ধারিত দোয়া পাঠ করুন (প্রাপ্তবয়স্কের জন্য প্রাপ্তবয়স্কের দোয়া, শিশু হলে শিশুর দোয়া)।",
        "recitationId": "dua-janaza"
      },
      {
        "stepNumber": 4,
        "rakatLabel": "৪র্থ তাকবীর ও সালাম",
        "rakatsApplicable": [
          1
        ],
        "titleBn": "৪র্থ তাকবীর ও উভয় দিকে সালাম",
        "descriptionBn": "হাত না তুলে ৪র্থ তাকবীর 'আল্লাহু আকবার' বলুন। এরপর ডানে ও বামে সালাম ফিরিয়ে নামাজ সমাপ্ত করে হাত ছাড়ুন।"
      }
    ],
    "specialRules": [
      {
        "title": "ফরযে কিফায়া",
        "description": "এলাকার কিছু মুসলমান জানাজা আদায় করলে সবার পক্ষ থেকে আদায় হয়ে যায়। কিন্তু কেউ আদায় না করলে সবাই গুনাহগার হবে।"
      },
      {
        "title": "ইমামের দাঁড়ানোর নিয়ম",
        "description": "মৃত ব্যক্তি পুরুষ বা মহিলা যাই হোক, হানাফি মাজহাব মতে ইমাম মৃতের বুকের বা সিনার সোজাসোজি দাঁড়াবেন।"
      },
      {
        "title": "দেরিতে এলে (মাসবুক)",
        "description": "যদি কোনো তাকবীর ছুটে যাওয়ার পর যোগ দেন, তবে ইমাম পরবর্তী তাকবীর বললে সেই তাকবীরের সাথে শরিক হবেন। ইমাম সালাম ফেরালে ছুটে যাওয়া তাকবীরগুলো দ্রুত বলে সালাম ফিরিয়ে নেবেন।"
      }
    ],
    "commonMistakes": [
      "জানাজায় প্রতি তাকবীরে হাত তোলা (হানাফি মতে শুধু ১ম তাকবীরে হাত তোলা সুন্নাত, বাকি তিন তাকবীরে হাত তোলা নিষেধ)।",
      "সালাম ফেরানোর আগেই হাত ছেড়ে দেওয়া (সালাম ফেরানোর পরেই হাত ছাড়া নিয়ম)।",
      "মৃত ব্যক্তির জন্য সঠিক দোয়া জানা না থাকা।"
    ],
    "faqs": [
      {
        "question": "জানাজার নামাজে কি রুকু বা সেজদা আছে?",
        "answer": "না। জানাজার নামাজে কোনো রুকু বা সেজদা নেই। এটি দাঁড়িয়ে চার তাকবীরের মাধ্যমে আদায় করতে হয়।"
      },
      {
        "question": "শিশু মারা গেলে কোন দোয়া পড়তে হয়?",
        "answer": "মৃত ব্যক্তি নাবালেগ ছেলে হলে 'আল্লাহুম্মাজ'আলহু লানা ফারাতাওঁ...' এবং নাবালেগ মেয়ে হলে 'আল্লাহুম্মাজ'আলহা লানা ফারাতাওঁ...' পড়তে হয়।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "১৩২৫",
        "grade": "sahih"
      },
      {
        "type": "fiqh",
        "source": "ফাতাওয়ায়ে হিন্দিয়া ও আল-হিদায়া",
        "number": "জানাজা পর্ব"
      }
    ],
    "relatedPrayers": [
      "fajr",
      "dhuhr",
      "asr",
      "maghrib",
      "isha"
    ],
    "relatedRulings": [
      "ruling-salah-fard"
    ]
  },
  {
    "slug": "tahajjud",
    "nameBn": "তাহাজ্জুদ",
    "nameAr": "التَّهَجُّد",
    "nameEn": "Tahajjud",
    "category": "nafl",
    "group": "sunnah-nafl",
    "timeDescriptionBn": "ইশার পর কিছুক্ষণ ঘুমিয়ে মধ্যরাতের পর থেকে সুবহে সাদিকের পূর্ব পর্যন্ত (রাতের শেষ তৃতীয়াংশে সর্বোত্তম)।",
    "totalRakats": 8,
    "simulatorConfigId": "tahajjud-main",
    "niyyat": {
      "id": "niyyat-tahajjud",
      "titleBn": "তাহাজ্জুদের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Tahajjud Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ التَّهَجُّدِ نَفْلَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিত তাহাজ্জুদি নাফলাল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatit-tahajjudi naflallahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে দুই রাকাত তাহাজ্জুদের নফল নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "ফরজ সালাতের পর সর্বোত্তম সালাত হলো রাতের সালাত (তাহাজ্জুদ)। রাতের শেষ ভাগে মহান আল্লাহ প্রথম আসমানে নেমে এসে বান্দার দোয়া কবুল করেন।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "১১৬৩",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত নফল (১ম জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল (২য় জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল (৩য় জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল (৪র্থ জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত করে নফল",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "ধীরস্থিরভাবে নামাজ আদায়",
        "descriptionBn": "দুই রাকাত করে সালাম ফিরিয়ে নামাজ পড়ুন। কিরাতে দীর্ঘ সূরা ও সেজদায় দোয়া করা উত্তম।"
      }
    ],
    "commonMistakes": [
      "তাহাজ্জুদের পর অলসতায় ফজরের ফরজ জামাত হারিয়ে ফেলা।",
      "তাহাজ্জুদের নিয়্যতে খুব দ্রুত নামাজ শেষ করা।"
    ],
    "faqs": [
      {
        "question": "তাহাজ্জুদ কত রাকাত পড়া যায়?",
        "answer": "তাহাজ্জুদ ন্যূনতম ২ রাকাত থেকে ৪, ৮ বা ১২ রাকাত পর্যন্ত পড়া যায়। রাসূলুল্লাহ (সা.) সাধারণত ৮ রাকাত তাহাজ্জুদ আদায় করতেন।"
      }
    ],
    "references": [
      {
        "type": "quran",
        "source": "সূরা আল-ইসরা",
        "number": "১৭:৭৯"
      },
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "১১২০",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "witr",
      "fajr",
      "isha"
    ],
    "relatedRulings": [
      "ruling-salah-arkan"
    ]
  },
  {
    "slug": "tarawih",
    "nameBn": "তারাবীহ",
    "nameAr": "التَّرَاوِيح",
    "nameEn": "Tarawih",
    "category": "sunnah-muakkadah",
    "group": "sunnah-nafl",
    "timeDescriptionBn": "পবিত্র রমজান মাসে ইশার ফরজ ও সুন্নাতের পর থেকে সুবহে সাদিকের পূর্ব পর্যন্ত।",
    "totalRakats": 20,
    "simulatorConfigId": "tarawih-main",
    "niyyat": {
      "id": "niyyat-tarawih",
      "titleBn": "তারাবীহ নামাজের নিয়্যত",
      "titleEn": "Niyyah for Tarawih Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ التَّرَاوِيحِ سُنَّةَ رَسُولِ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিত তারাবীহি সুন্নাতা রাসূলিল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatit-taraweehi sunnata rasoolillahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে দুই রাকাত তারাবীহর সুন্নাত নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "যে ব্যক্তি রমজানের রাতে ঈমান ও সওয়াবের আশায় তারাবীহর নামাজ আদায় করবে, তার অতীতের সমস্ত গুনাহ ক্ষমা করে দেওয়া হবে।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৩৭",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২০ রাকাত সুন্নাতে মুয়াক্কাদাহ (২ রাকাত করে ১০ সালামে)",
        "count": 20,
        "status": "sunnah",
        "config": {
          "rakats": 20,
          "qiratRakats": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [
            1,
            2
          ],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত করে ১০ সালাম",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "প্রতি চার রাকাত পর বিশ্রাম ও দোয়া",
        "descriptionBn": "দুই রাকাত করে সালাম ফিরিয়ে মোট ২০ রাকাত আদায় করা হানাফি ফিকহের সুন্নাত। প্রতি ৪ রাকাত পর সামান্য সময় বিশ্রাম নেওয়া বা তাসবীহ পড়া মুস্তাহাব।"
      }
    ],
    "commonMistakes": [
      "অতিরিক্ত দ্রুত কিরাত পড়ে হরফ অস্পষ্ট করে ফেলা।",
      "রুকু-সেজদায় তাড়াহুড়ো করে ওয়াজিব লঙ্ঘন করা।"
    ],
    "faqs": [
      {
        "question": "তারাবীহ নামাজ কত রাকাত?",
        "answer": "হযরত উমর (রা.)-এর খেলাফতকাল থেকে শুরু করে চার মাজহাবের অধিকাংশ ওলামাদের মতে তারাবীহর নামাজ ২০ রাকাত এবং এটি সুন্নাতে মুয়াক্কাদা।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "২০০১",
        "grade": "sahih"
      },
      {
        "type": "hadith",
        "source": "মুআত্তা ইমাম মালিক",
        "number": "৩৮০",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "isha",
      "witr",
      "tahajjud"
    ],
    "relatedRulings": [
      "ruling-salah-sunnah"
    ]
  },
  {
    "slug": "chasht",
    "nameBn": "চাশত ও ইশরাক",
    "nameAr": "صَلَاةُ الضُّحَى",
    "nameEn": "Salatud Duha / Chasht",
    "category": "nafl",
    "group": "sunnah-nafl",
    "timeDescriptionBn": "সূর্যোদয়ের আনুমানিক ২০ মিনিট পর (ইশরাক) থেকে শুরু করে দ্বিপ্রহরের পূর্ব পর্যন্ত (চাশত)।",
    "totalRakats": 4,
    "simulatorConfigId": "chasht-main",
    "niyyat": {
      "id": "niyyat-chasht",
      "titleBn": "চাশতের নামাজের নিয়্যত",
      "titleEn": "Niyyah for Duha / Chasht",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ الضُّحَىٰ نَفْلَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিদ দুহা নাফলাল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatid-duha naflallahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে দুই রাকাত চাশতের নফল নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "মানুষের শরীরের প্রতিটি জোড়ার জন্য প্রতিদিন সদকা দেওয়া আবশ্যক। আর দুই রাকাত চাশতের নামাজ এই সমস্ত সদকার জন্য যথেষ্ট হয়ে যায়।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৭২০",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত নফল (১ম জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      },
      {
        "label": "২ রাকাত নফল (২য় জোড়া)",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত করে নফল",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "সাধারণ নফল নামাজের নিয়ম",
        "descriptionBn": "সাধারণ দুই রাকাত নফল নামাজের মতোই সূরা ফাতিহা ও অন্য সূরা মিলিয়ে দুই রাকাত করে নামাজ সম্পন্ন করুন।"
      }
    ],
    "commonMistakes": [
      "সূর্যোদয়ের সাথে সাথেই নামাজ শুরু করে দেওয়া (সূর্যোদয়ের সময় নামাজ পড়া হারাম)।"
    ],
    "faqs": [
      {
        "question": "ইশরাক ও চাশতের মধ্যে পার্থক্য কী?",
        "answer": "সূর্য ওঠার আনুমানিক ১৫-২০ মিনিট পর যে নামাজ পড়া হয় তাকে সালাতুল ইশরাক বলে। আর রোদ উজ্জ্বল ও কিছুটা উত্তপ্ত হলে (সকাল ৯টা-১১টার দিকে) যে নামাজ পড়া হয় তাকে চাশত বা সালাতুদ দুহা বলা হয়।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৭২০",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "fajr",
      "dhuhr"
    ],
    "relatedRulings": [
      "ruling-salah-sunnah"
    ]
  },
  {
    "slug": "istikhara",
    "nameBn": "ইস্তিখারা",
    "nameAr": "صَلَاةُ الإِسْتِخَارَة",
    "nameEn": "Salatul Istikhara",
    "category": "nafl",
    "group": "special",
    "timeDescriptionBn": "যেকোনো বৈধ কাজের সিদ্ধান্ত নেওয়ার পূর্বে দিন বা রাতের যেকোনো মাকরূহবিহীন সময়ে।",
    "totalRakats": 2,
    "simulatorConfigId": "istikhara-main",
    "niyyat": {
      "id": "niyyat-istikhara",
      "titleBn": "ইস্তিখারার নামাজের নিয়্যত",
      "titleEn": "Niyyah for Istikhara Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ الْإِسْتِخَارَةِ نَفْلَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই সালাতিল ইসতিখারাতি নাফলাল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay salatil-istikharati naflallahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে দুই রাকাত ইস্তিখারার নফল নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "রাসূলুল্লাহ (সা.) সাহাবিদের কুরআনের সূরার মতো গুরুত্ব দিয়ে প্রতিটি গুরুত্বপূর্ণ কাজে ইস্তিখারা শিক্ষা দিতেন। (বুখারী ১১৬২)",
      "reference": {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "১১৬২",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত নফল",
        "count": 2,
        "status": "mustahab",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত নফল ও দোয়া",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "নামাজ শেষে ইস্তিখারার দোয়া",
        "descriptionBn": "দুই রাকাত নফল নামাজ পড়ে আল্লাহর প্রশংসা ও দুরূদ শরীফ পাঠ করার পর হাদিসে বর্ণিত বিশেষ ইস্তিখারার দোয়া পড়ুন এবং যে বিষয়ে সিদ্ধান্ত নিতে চান মনে মনে তা উল্লেখ করুন।"
      }
    ],
    "commonMistakes": [
      "ইস্তিখারা করে স্বপ্নে কোনো সংকেত দেখার অপেক্ষা করা (স্বপ্নে দেখা জরুরি নয়, বরং মনে যে সিদ্ধান্তের প্রতি আস্থা তৈরি হয় তা-ই ফায়সালা)।",
      "হারাম বা সুস্পষ্ট ফরজের বিষয়ে ইস্তিখারা করা (ইস্তিখারা কেবল বৈধ ও সিদ্ধান্তহীন বিষয়ের জন্য)।"
    ],
    "faqs": [
      {
        "question": "ইস্তিখারা কীভাবে কাজ করে?",
        "answer": "ইস্তিখারার পর মন যে সিদ্ধান্তের প্রতি স্বাচ্ছন্দ্যবোধ করে সেই অনুযায়ী কাজ শুরু করতে হয়। আল্লাহ তাতে কল্যাণ থাকলে পথ সহজ করে দেন, আর অকল্যাণ থাকলে বাধা সৃষ্টি করে ফিরিয়ে দেন।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "১১৬২",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "tahajjud",
      "chasht"
    ],
    "relatedRulings": [
      "ruling-salah-sunnah"
    ]
  },
  {
    "slug": "salatut-tasbih",
    "nameBn": "সালাতুত তাসবীহ",
    "nameAr": "صَلَاةُ التَّسْبِيح",
    "nameEn": "Salatut Tasbih",
    "category": "nafl",
    "group": "special",
    "timeDescriptionBn": "দিন বা রাতের যেকোনো মাকরূহবিহীন সময়ে চার রাকাত বিশিষ্ট এই নামাজ পড়া যায়।",
    "totalRakats": 4,
    "simulatorConfigId": "tasbih-main",
    "niyyat": {
      "id": "niyyat-salatut-tasbih",
      "titleBn": "সালাতুত তাসবীহের নিয়্যত",
      "titleEn": "Niyyah for Salatut Tasbih",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ رَكَعَاتِ صَلَاةِ التَّسْبِيحِ نَفْلَ اللَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ রাকা'আতি সালাতিত তাসবীহি নাফলাল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a raka'ati salatit-tasbeehi naflallahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে চার রাকাত সালাতুত তাসবীহের নফল নামাজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "রাসূলুল্লাহ (সা.) তাঁর চাচা আব্বাস (রা.)-কে বলেছিলেন: এই নামাজ পড়লে আল্লাহ আপনার পূর্বাপর, ছোট-বড়, প্রকাশ্য-গোপন সমস্ত গুনাহ ক্ষমা করে দেবেন। সম্ভব হলে প্রতিদিন, না হলে সপ্তাহে, মাসে, বছরে বা জীবনে অন্তত একবার পড়ুন।",
      "reference": {
        "type": "hadith",
        "source": "সুনানে আবু দাউদ",
        "number": "১২৯৭",
        "grade": "hasan"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত নফল (প্রতি রাকাতে ৭৫ বার করে মোট ৩০০ বার তাসবীহ)",
        "count": 4,
        "status": "mustahab",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2,
            3,
            4
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "প্রতি রাকাতে ৭৫ বার তাসবীহ",
        "rakatsApplicable": [
          1,
          2,
          3,
          4
        ],
        "titleBn": "তাসবীহ পাঠের নিয়ম",
        "descriptionBn": "তাসবীহ: 'সুবহানাল্লাহি ওয়ালহামদু লিল্লাহি ওয়া লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার'। ১ম রাকাতে সানার পর ১৫ বার, কিরাতের পর ১০ বার, রুকুতে ১০ বার, রুকু থেকে সোজা হয়ে ১০ বার, ১ম সেজদায় ১০ বার, দুই সেজদার মাঝে ১০ বার, ২য় সেজদায় ১০ বার = মোট ৭৫ বার। এভাবে চার রাকাতে মোট ৩০০ বার পাঠ করতে হয়।"
      }
    ],
    "commonMistakes": [
      "আঙুলের কড়ে গুনতে গিয়ে মন বিভ্রান্ত করা (আঙুল শক্ত করে চেপে রেখে মনে মনে হিসাব রাখা উত্তম)।"
    ],
    "faqs": [
      {
        "question": "সালাতুত তাসবীহের তাসবীহ কোনটি?",
        "answer": "'সুবহানাল্লাহি ওয়ালহামদুলিল্লাহি ওয়া লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার' — এই পবিত্র তাসবীহটি প্রতি রাকাতে ৭৫ বার পড়তে হয়।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সুনানে আবু দাউদ",
        "number": "১২৯৭",
        "grade": "hasan"
      }
    ],
    "relatedPrayers": [
      "tahajjud",
      "istikhara"
    ],
    "relatedRulings": [
      "ruling-salah-sunnah"
    ]
  },
  {
    "slug": "kaza",
    "nameBn": "কাযা নামাজ",
    "nameAr": "قَضَاءُ الصَّلَاة",
    "nameEn": "Qaza (Missed Prayer)",
    "category": "fard",
    "group": "special",
    "timeDescriptionBn": "যেকোনো নিষিদ্ধ মাকরূহ সময় ব্যতীত রাত-দিনের যেকোনো সুবিধাজনক সময়ে কাযা নামাজ আদায় করা যায়।",
    "totalRakats": 4,
    "simulatorConfigId": "kaza-main",
    "niyyat": {
      "id": "niyyat-kaza",
      "titleBn": "কাযা নামাজের নিয়্যত",
      "titleEn": "Niyyah for Missed Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ أَرْبَعَ رَكَعَاتِ فَرْضِ الظُّهْرِ الْمَقْضِيَّةِ عَنِّي لِلَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা আরবা'আ রাকা'আতি ফারদিজ জুহরিল মাকদিয়্যাতি আন্নী লিল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala arba'a raka'ati fardidh-dhuhri al-maqdiyyati annee lillahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে আমার ছুটে যাওয়া যোহরের চার রাকাত ফরজ কাযা নামাজ কিবলামুখী হয়ে আদায় করার সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "কেউ যদি ঘুমিয়ে পড়ার কারণে বা ভুলে যাওয়ার কারণে নামাজ আদায় করতে না পারে, তবে স্মরণের সাথে সাথেই তা আদায় করে নেওয়া তার কাফফারা।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৯৭",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "৪ রাকাত ফরজ কাযা",
        "count": 4,
        "status": "fard",
        "config": {
          "rakats": 4,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": 2,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "কাযা নামাজের নিয়ম",
        "rakatsApplicable": [
          1,
          2,
          3,
          4
        ],
        "titleBn": "মূল নামাজের মতোই নিয়ম",
        "descriptionBn": "যে ওয়াক্তের কাযা পড়া হচ্ছে (যেমন যোহর), তা মূল ওয়াক্তের নামাজের মতোই হুবহু ৪ রাকাত ফরজের নিয়ম অনুযায়ী আদায় করতে হবে।"
      }
    ],
    "specialRules": [
      {
        "title": "কোন কোন নামাজের কাযা করতে হয়?",
        "description": "৫ ওয়াক্তের ফরজ নামাজ এবং বিতরের ওয়াজিব নামাজ ছুটে গেলে কাযা আদায় করা ফরজ/ওয়াজিব। সুন্নাত বা নফল নামাজের কাযা পড়তে হয় না (তবে ফজরের সুন্নাত ছুটে গেলে সূর্য ওঠার পর যোহরের আগে পড়ে নেওয়া ভালো)।"
      },
      {
        "title": "অনেক দিনের কাযা থাকলে হিসাবের নিয়ম",
        "description": "যদি বহু নামাজ ছুটে গিয়ে থাকে, তবে আনুমানিক হিসাব করে একটি খাতা বা ট্র্যাকার তৈরি করুন। প্রতি ওয়াক্তের সাথে একটি করে ছুটে যাওয়া কাযা (যেমন 'আমার জীবনের ছুটে যাওয়া প্রথম ফজর/যোহর') নিয়্যত করে আদায় করতে থাকুন।"
      }
    ],
    "commonMistakes": [
      "কাযা নামাজকে সূর্যোদয়, দ্বিপ্রহর বা সূর্যাস্তের নিষিদ্ধ সময়ে পড়া।",
      "কাযা জমে গেছে বলে হতাশ হয়ে নতুন করে নামাজ শুরু না করা।"
    ],
    "faqs": [
      {
        "question": "কাযা নামাজ কখন পড়া যায়?",
        "answer": "তিনটি নিষিদ্ধ সময় ছাড়া (সূর্যোদয়ের সময়, ঠিক দুপুর ১২টার দিকে সূর্য মাথার উপর থাকলে, এবং সূর্যাস্তের ঠিক আগে) দিন বা রাতের যেকোনো সময় কাযা নামাজ পড়া জায়েজ।"
      }
    ],
    "references": [
      {
        "type": "hadith",
        "source": "সহীহ বুখারী",
        "number": "৫৯৭",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "fajr",
      "dhuhr",
      "asr",
      "maghrib",
      "isha",
      "witr"
    ],
    "relatedRulings": [
      "ruling-salah-fard",
      "ruling-salah-wajib"
    ]
  },
  {
    "slug": "musafir",
    "nameBn": "মুসাফিরের নামাজ (কসর)",
    "nameAr": "صَلَاةُ المُسَافِر",
    "nameEn": "Musafir / Qasr Prayer",
    "category": "fard",
    "group": "special",
    "timeDescriptionBn": "নিজ বাসস্থান থেকে ৪৮ মাইল (প্রায় ৭৮ কিলোমিটার) দূরবর্তী কোনো স্থানে সফরের নিয়্যতে বের হলে এবং সেখানে ১৫ দিনের কম অবস্থানের নিয়্যত থাকলে।",
    "totalRakats": 2,
    "simulatorConfigId": "musafir-main",
    "niyyat": {
      "id": "niyyat-musafir",
      "titleBn": "কসর নামাজের নিয়্যত",
      "titleEn": "Niyyah for Qasr Prayer",
      "arabic": "نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ فَرْضِ الظُّهْرِ قَصْرًا لِلَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ",
      "uccharonBn": "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাক'আতাই ফারদিজ জুহরি কাসরান লিল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাহ।",
      "banglish": "Nawaytu an usalliya lillahi ta'ala rak'atay fardidh-dhuhri qasran lillahi ta'ala mutawajjihan ila jihatil-ka'batish-shareefah.",
      "meaningBn": "আমি আল্লাহর সন্তুষ্টির উদ্দেশ্যে কিবলামুখী হয়ে যোহরের চার রাকাত ফরজকে কসর করে দুই রাকাত ফরজ আদায়ের সংকল্প করছি।"
    },
    "fazilat": {
      "textBn": "কসর হলো আল্লাহর পক্ষ থেকে দেওয়া একটি উপহার বা সদকা। সুতরাং আল্লাহর সেই উপহার তোমরা সাদরে গ্রহণ কর।",
      "reference": {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬৮৬",
        "grade": "sahih"
      }
    },
    "rakatUnits": [
      {
        "label": "২ রাকাত ফরজ (৪ রাকাত ফরজের কসর)",
        "count": 2,
        "status": "fard",
        "config": {
          "rakats": 2,
          "qiratRakats": [
            1,
            2
          ],
          "firstSittingAfter": null,
          "hasQunut": false,
          "isJanaza": false,
          "jahr": [],
          "sajdaCount": 2,
          "endsWithSalam": true
        }
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "rakatLabel": "২ রাকাত ফরজ",
        "rakatsApplicable": [
          1,
          2
        ],
        "titleBn": "৪ রাকাত ফরজকে ২ রাকাত করা",
        "descriptionBn": "যোহর, আসর ও ইশার চার রাকাত ফরজকে কমিয়ে দুই রাকাত আদায় করা হানাফি ফিকহে ওয়াজিব। ফজর (২ রাকাত), মাগরিব (৩ রাকাত) এবং বিতরে কোনো কসর হয় না।"
      }
    ],
    "specialRules": [
      {
        "title": "কসর কখন কার্যকর হয়?",
        "description": "নিজ এলাকার সীমানা (শহর বা গ্রামের শেষ বাড়ি) অতিক্রম করার পর থেকেই কসর কার্যকর হয়। গন্তব্যে ১৫ দিনের কম থাকার সংকল্প থাকলে কসর চালু থাকবে।"
      },
      {
        "title": "মুসাফির অবস্থায় সুন্নাত নামাজের হুকুম",
        "description": "সফরের ব্যস্ততায় সুন্নাতে মুয়াক্কাদা ছেড়ে দেওয়া জায়েজ, তবে ফজর ও মাগরিবের সুন্নাত পড়া উত্তম। শান্ত পরিবেশে অবস্থানকালে সম্ভব হলে সুন্নাতগুলো পড়ে নেওয়া ভালো।"
      }
    ],
    "commonMistakes": [
      "মুসাফির হওয়া সত্ত্বেও হানাফি ফিকহের ওয়াজিব বিধান অমান্য করে ইচ্ছাকৃত ৪ রাকাত পড়া।",
      "মাগরিবের ৩ রাকাতকে ভুল করে ২ রাকাত বানানো (মাগরিবে কসর নেই)।"
    ],
    "faqs": [
      {
        "question": "কত দূরত্ব অতিক্রম করলে মুসাফির হয়?",
        "answer": "নিজ লোকালয় অতিক্রম করে কমপক্ষে ৪৮ মাইল বা প্রায় ৭৮ কিলোমিটার দূরবর্তী স্থানে সফরের নিয়্যত নিয়ে যাত্রা শুরু করলে ব্যক্তি শরীয়তের দৃষ্টিতে মুসাফির হয়।"
      },
      {
        "question": "মুসাফির কি স্থানীয় মুক্বীম ইমামের পেছনে নামাজ পড়তে পারে?",
        "answer": "হ্যাঁ। স্থানীয় মুক্বীম ইমামের পেছনে একতেদা করলে মুসাফির ব্যক্তিও ইমামের মতো পূর্ণ চার রাকাত পড়বে।"
      }
    ],
    "references": [
      {
        "type": "quran",
        "source": "সূরা আন-নিসা",
        "number": "৪:১০১"
      },
      {
        "type": "hadith",
        "source": "সহীহ মুসলিম",
        "number": "৬৮৬",
        "grade": "sahih"
      }
    ],
    "relatedPrayers": [
      "dhuhr",
      "asr",
      "isha"
    ],
    "relatedRulings": [
      "ruling-salah-fard"
    ]
  }
];
