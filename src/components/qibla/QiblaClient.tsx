"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Navigation,
  MapPin,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Info,
  Search,
  X,
} from "lucide-react";
import {
  ALL_LOCATIONS,
  BANGLADESH_DISTRICTS,
  CityLocation,
  DEFAULT_LOCATION,
} from "@/src/data/locations";
import {
  getQiblaBearing,
  getQiblaDirectionDescription,
} from "@/src/lib/prayer-times/calculator";
import { toBengaliNumber } from "@/src/lib/bengali";

const STORAGE_LOCATION_KEY = "namajshikkha_location_choice";

export function QiblaClient() {
  const [selectedLocation, setSelectedLocation] = useState<CityLocation>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCATION;
    try {
      const raw = localStorage.getItem(STORAGE_LOCATION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CityLocation;
        if (parsed.lat && parsed.lng) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_LOCATION;
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Compass heading state (0 - 360)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasOrientationSensor, setHasOrientationSensor] =
    useState<boolean>(false);
  const [needsIosPermission, setNeedsIosPermission] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DeviceOrientation = (window as any).DeviceOrientationEvent;
    return (
      DeviceOrientation &&
      typeof DeviceOrientation.requestPermission === "function"
    );
  });
  const [orientationError, setOrientationError] = useState<string | null>(null);

  const saveLocationChoice = (loc: CityLocation) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(false);
    try {
      localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(loc));
    } catch {
      // Ignore
    }
  };

  // Qibla Bearing from North (0-360)
  const qiblaBearing = useMemo(
    () => getQiblaBearing(selectedLocation.lat, selectedLocation.lng),
    [selectedLocation.lat, selectedLocation.lng]
  );

  const directionDescription = useMemo(
    () => getQiblaDirectionDescription(qiblaBearing),
    [qiblaBearing]
  );

  // Setup DeviceOrientation listener
  const setupOrientationListener = useCallback(() => {
    if (typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // iOS webkitCompassHeading is already 0-360 degrees from magnetic north
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webkitHeading = (e as any).webkitCompassHeading;

      if (typeof webkitHeading === "number" && !isNaN(webkitHeading)) {
        setHasOrientationSensor(true);
        setDeviceHeading(webkitHeading);
        setOrientationError(null);
      } else if (e.alpha !== null && !isNaN(e.alpha)) {
        // Android / non-iOS standard: e.alpha is 0-360
        // When absolute is true, 360 - alpha is roughly compass heading
        setHasOrientationSensor(true);
        const heading = (360 - e.alpha) % 360;
        setDeviceHeading(heading);
        setOrientationError(null);
      }
    };

    // Try absolute event first, then standard event
    window.addEventListener(
      "deviceorientationabsolute" as unknown as "deviceorientation",
      handleOrientation,
      true
    );
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute" as unknown as "deviceorientation",
        handleOrientation,
        true
      );
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  useEffect(() => {
    if (!needsIosPermission) {
      const cleanup = setupOrientationListener();
      return cleanup;
    }
  }, [needsIosPermission, setupOrientationListener]);

  const requestIosPermission = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DeviceOrientation = window.DeviceOrientationEvent as any;
      if (
        DeviceOrientation &&
        typeof DeviceOrientation.requestPermission === "function"
      ) {
        const response = await DeviceOrientation.requestPermission();
        if (response === "granted") {
          setNeedsIosPermission(false);
          setupOrientationListener();
        } else {
          setOrientationError(
            "কম্পাস সেন্সরের অনুমতি দেওয়া হয়নি। ম্যানুয়াল ডিগ্রি দেখে কিবলামুখী হোন।"
          );
        }
      }
    } catch {
      setOrientationError("ডিভাইস কম্পাস সেন্সর সক্রিয় করা যায়নি।");
    }
  };

  // Get current device GPS location
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("আপনার ব্রাউজারে জিপিএস সুবিধা পাওয়া যায়নি।");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const customLoc: CityLocation = {
          id: "gps-current",
          nameBn: "আপনার বর্তমান অবস্থান (GPS)",
          nameEn: "Current GPS Location",
          countryBn: "বাংলাদেশ",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timezone: "Asia/Dhaka",
        };
        saveLocationChoice(customLoc);
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          "জিপিএস লোকেশন পাওয়া যায়নি। নিচে থেকে আপনার জেলা বা শহর বেছে নিন।"
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Calculate relative angle to Qibla
  // If deviceHeading is available, needle angle = (qiblaBearing - deviceHeading)
  const relativeAngle =
    deviceHeading !== null
      ? (qiblaBearing - deviceHeading + 360) % 360
      : qiblaBearing;

  // Is device pointing directly at Qibla within +/- 4 degrees?
  const isAligned =
    deviceHeading !== null &&
    (relativeAngle <= 4 || relativeAngle >= 356);

  // Trigger light haptic vibration when aligned
  useEffect(() => {
    if (isAligned && typeof window !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {
        // Ignore
      }
    }
  }, [isAligned]);

  // Filter locations for modal
  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return BANGLADESH_DISTRICTS;
    return ALL_LOCATIONS.filter(
      (loc) =>
        loc.nameBn.toLowerCase().includes(q) ||
        loc.nameEn.toLowerCase().includes(q) ||
        loc.countryBn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-text-muted">
          <Link href="/" className="hover:text-emerald-600">
            হোম
          </Link>
          <span>/</span>
          <Link href="/prayer-times" className="hover:text-emerald-600">
            নামাজের সময়সূচী
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800 dark:text-white">
            কিবলা কম্পাস
          </span>
        </div>

        <Link
          href="/prayer-times"
          className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>আজকের নামাজের সময়সূচী</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-950/40">
          <Compass className="h-7 w-7" />
        </div>

        <h1 className="bangla-text text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          সরাসরি কিবলা কম্পাস (Qibla Direction)
        </h1>
        <p className="bangla-text mx-auto mt-2 max-w-lg text-sm text-gray-600 dark:text-dark-text-secondary sm:text-base">
          পবিত্র কাবা শরীফের সঠিক দিকনির্ণয়। অফলাইনে সম্পূর্ণ নিরাপদ ও নিখুঁত।
        </p>

        {/* Selected location pill */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-100 dark:border-dark-border dark:bg-emerald-950/50 dark:text-emerald-200"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>অবস্থান: {selectedLocation.nameBn}</span>
            <span className="rounded-md bg-emerald-200/70 px-1.5 py-0.5 text-[10px] text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
              পরিবর্তন
            </span>
          </button>
        </div>
      </div>

      {/* iOS Permission Prompt Banner */}
      {needsIosPermission && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900/40 dark:bg-amber-950/30">
          <AlertCircle className="mx-auto mb-2 h-6 w-6 text-amber-600" />
          <h3 className="bangla-text text-sm font-bold text-amber-900 dark:text-amber-200">
            আইফোনে কম্পাস সেন্সর সক্রিয় করতে অনুমতি প্রয়োজন
          </h3>
          <p className="bangla-text mt-1 text-xs text-amber-800 dark:text-amber-300">
            আইওএস ব্রাউজারে কম্পাস ঘোরার জন্য নিচে বোতামে চাপ দিয়ে &apos;Allow&apos; নির্বাচন করুন।
          </p>
          <button
            type="button"
            onClick={requestIosPermission}
            className="bangla-text mt-3 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
          >
            কম্পাস অনুমতি দিন (Enable Compass)
          </button>
        </div>
      )}

      {orientationError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-center dark:border-rose-900/40 dark:bg-rose-950/30">
          <p className="bangla-text text-xs text-rose-700 dark:text-rose-300">
            {orientationError}
          </p>
        </div>
      )}

      {/* Main Compass Card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 sm:p-10 shadow-lg dark:border-dark-border dark:bg-dark-card">
        {/* Alignment Glow */}
        {isAligned && (
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
        )}

        <div className="flex flex-col items-center text-center">
          {/* Compass Dial Display */}
          <div className="relative flex h-72 w-72 sm:h-84 sm:w-84 items-center justify-center">
            {/* Outer Compass Rim */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-colors duration-300 ${
                isAligned
                  ? "border-emerald-500 shadow-xl shadow-emerald-200 dark:shadow-emerald-950/60"
                  : "border-gray-200 dark:border-dark-border"
              }`}
            >
              {/* Dial tick marks (0, 90, 180, 270) */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-extrabold text-rose-500">
                N
              </span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-gray-400">
                E
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-extrabold text-gray-400">
                S
              </span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-gray-400">
                W
              </span>
            </div>

            {/* Inner Rotating Needle / Dial */}
            <div
              className="relative flex h-full w-full items-center justify-center transition-transform duration-200 ease-out"
              style={{
                transform: `rotate(${relativeAngle}deg)`,
              }}
            >
              {/* Direction Indicator to Kaaba */}
              <div className="absolute top-7 flex flex-col items-center">
                {/* Kaaba Icon Representation */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-lg transition-transform ${
                    isAligned
                      ? "bg-emerald-600 scale-110 ring-4 ring-emerald-300"
                      : "bg-gray-900 text-gold-400 border border-gold-500/50"
                  }`}
                >
                  <span className="text-base font-bold text-white">🕋</span>
                </div>
                <div
                  className={`mt-1.5 h-0 w-0 border-x-8 border-x-transparent border-t-[14px] ${
                    isAligned ? "border-t-emerald-600" : "border-t-emerald-700"
                  }`}
                />
              </div>

              {/* Center Pivot Point */}
              <div className="h-6 w-6 rounded-full border-4 border-white bg-emerald-600 shadow-md dark:border-dark-card" />

              {/* South pointer line */}
              <div className="absolute bottom-8 h-10 w-1 bg-gray-300 dark:bg-gray-600" />
            </div>
          </div>

          {/* Alignment status alert */}
          <div className="mt-6">
            {isAligned ? (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 dark:shadow-emerald-950/50">
                <CheckCircle2 className="h-5 w-5" />
                <span className="bangla-text">
                  মাশাআল্লাহ! আপনি সরাসরি কিবলামুখী আছেন
                </span>
              </div>
            ) : hasOrientationSensor ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary">
                <Navigation
                  className="h-4 w-4 text-emerald-600"
                  style={{
                    transform: `rotate(${relativeAngle}deg)`,
                  }}
                />
                <span className="bangla-text">
                  তীরচিহ্নটি সোজা উপরের দিকে আসা পর্যন্ত ফোনটি ঘোরান
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs sm:text-sm font-semibold text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-200">
                <Info className="h-4 w-4 text-sky-600" />
                <span className="bangla-text">
                  ম্যানুয়াল কিবলা কোণ নির্দেশিকা (কোনো সেন্সর ছাড়া)
                </span>
              </div>
            )}
          </div>

          {/* Degree & Coordinate Details */}
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-sm w-full">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 dark:border-dark-border dark:bg-dark-bg">
              <span className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
                কিবলার সুনির্দিষ্ট কোণ
              </span>
              <div className="bangla-text text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                {toBengaliNumber(Math.round(qiblaBearing))}°
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-3 dark:border-dark-border dark:bg-dark-bg">
              <span className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
                {hasOrientationSensor ? "ফোনের বর্তমান দিক" : "দিকনির্দেশনা"}
              </span>
              <div className="bangla-text text-lg sm:text-xl font-bold text-gray-800 dark:text-dark-text">
                {hasOrientationSensor && deviceHeading !== null
                  ? `${toBengaliNumber(Math.round(deviceHeading))}°`
                  : "পশ্চিম-উত্তর-পশ্চিম"}
              </div>
            </div>
          </div>

          {/* Text Instruction */}
          <p className="bangla-text mt-4 max-w-md text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-dark-text-secondary">
            {selectedLocation.nameBn} থেকে কিবলা:{" "}
            <strong className="text-emerald-800 dark:text-emerald-300">
              {directionDescription}
            </strong>
          </p>

          {/* Calibration guide hint */}
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 text-left max-w-md dark:border-dark-border dark:bg-dark-bg">
            <RotateCcw className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 dark:text-dark-text-secondary">
              <strong className="bangla-text text-gray-900 dark:text-white">
                নির্ভুলতার টিপস:{" "}
              </strong>
              <span className="bangla-text">
                কম্পাসের সঠিকতার জন্য ফোনটিকে সমতল রাখুন এবং বাতাসে ৮ (অষ্টাশ)
                আকারে ২-৩ বার ঘুরিয়ে নিন। কোনো লোহা বা ইলেকট্রনিক ডিভাইসের খুব
                কাছে না রাখাই উত্তম।
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic Fiqh Note on Qibla */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/60 p-5 dark:border-dark-border dark:bg-dark-card/50">
        <h3 className="bangla-text text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-emerald-600" />
          <span>কিবলামুখী হওয়ার শরয়ী বিধান (হানাফি ফিকহ)</span>
        </h3>
        <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
          নামাজ শুদ্ধ হওয়ার জন্য কিবলামুখী (সরাসরি কাবার দিকে) হওয়া অন্যতম
          প্রধান শর্ত (ফরজ)। যারা মক্কা শরীফের বাইরে অবস্থান করেন, তাদের জন্য
          কাবার মূল কাঠামোর হুবহু লাইন বরাবর হওয়া আবশ্যক নয়; বরং কাবার সামগ্রিক
          দিক (জিহাতুল কিবলা — বাংলাদেশের ক্ষেত্রে আনুমানিক ৪৫ ডিগ্রি ডানে-বায়ে
          পশ্চিম দিক) বজায় থাকলেই নামাজ শুদ্ধ হয়ে যাবে।
        </p>
      </div>

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white p-5 shadow-2xl dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-dark-border">
              <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                জেলা বা শহর নির্বাচন করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* GPS current location button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGetGPSLocation}
                disabled={geoLoading}
                className="bangla-text flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60"
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {geoLoading
                    ? "জিপিএস অবস্থান নির্ধারণ হচ্ছে..."
                    : "বর্তমান জিপিএস অবস্থান ব্যবহার করুন"}
                </span>
              </button>

              {geoError && (
                <p className="bangla-text mt-2 text-xs text-rose-600">
                  {geoError}
                </p>
              )}
            </div>

            {/* Search Box */}
            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="জেলার নাম বা শহর লিখুন (যেমন: চট্টগ্রাম, সিলেট)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bangla-text w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
              />
            </div>

            {/* District list */}
            <div className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
              <div className="bangla-text text-[11px] font-bold uppercase text-gray-400 mb-1">
                বাংলাদেশের ৬৪ জেলা ও গুরুত্বপূর্ণ শহর:
              </div>

              {filteredDistricts.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => saveLocationChoice(loc)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors ${
                    selectedLocation.id === loc.id
                      ? "bg-emerald-50 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
                  }`}
                >
                  <span className="bangla-text">
                    {loc.nameBn} ({loc.nameEn})
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {loc.divisionBn ? `${loc.divisionBn} বিভাগ` : loc.countryBn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QiblaClient;
