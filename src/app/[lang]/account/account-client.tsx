"use client";

import { useLang } from "@/lib/astrology/language-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  dateOfBirth?: string;
  birthTime?: string;
  birthPlace?: string;
  language?: string;
  role?: string;
  plan?: string;
  planExpiresAt?: string;
  billingCycle?: "monthly" | "yearly" | "onetime" | null;
  trialEndsAt?: string | null;
  familyOwnerId?: string | null;
  provider?: string;
  createdAt: string;
  updatedAt?: string;
}

type PaidPlan = "starter" | "premium" | "plus" | "family";
type Cycle = "monthly" | "yearly" | "onetime";

interface SavedKundli {
  id: string;
  name: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
}

type Tab = "overview" | "kundlis" | "payments" | "orders" | "profile";

interface BookOrder {
  id: string;
  kundliName: string;
  recipientName: string;
  addressLine1: string;
  city: string;
  state: string;
  pin: string;
  status: string;
  trackingNumber?: string | null;
  courier?: string | null;
  amountPaid: number;
  planAtOrder: string;
  createdAt: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

export default function AccountPageClient() {
  const { t, lang } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMr = lang === "mr";
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kundlis, setKundlis] = useState<SavedKundli[]>([]);
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const qpTab = searchParams.get("tab") as Tab | null;
  const validTab = (t: string | null): t is Tab => t === "overview" || t === "kundlis" || t === "payments" || t === "orders" || t === "profile";
  const [activeTab, setActiveTab] = useState<Tab>(validTab(qpTab) ? qpTab : "overview");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile form
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formBirthTime, setFormBirthTime] = useState("");
  const [formBirthPlace, setFormBirthPlace] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.user) {
          if (data.user.role === "admin") { router.replace("/admin"); return; }
          setUser(data.user);
          setFormName(data.user.name || "");
          setFormPhone(data.user.phone || "");
          setFormDob(data.user.dateOfBirth || "");
          setFormBirthTime(data.user.birthTime || "");
          setFormBirthPlace(data.user.birthPlace || "");
        }
      } catch { /* not logged in */ }

      try {
        const res = await fetch("/api/user/kundlis");
        const data = await res.json();
        if (data.kundlis) setKundlis(data.kundlis);
      } catch { /* ignore */ }

      try {
        const res = await fetch("/api/book-order");
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch { /* ignore */ }

      setLoading(false);
    }
    load();
  }, []);

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formName,
        phone: formPhone,
        dateOfBirth: formDob,
        birthTime: formBirthTime,
        birthPlace: formBirthPlace,
      }),
    });
    setSaving(false);
    setToast(isMr ? "सेव केले" : "Saved");
    setTimeout(() => setToast(""), 3000);
  }

  async function handlePayment(plan: PaidPlan, cycle?: Cycle) {
    // Resolve default cycle per plan if caller didn't specify.
    const resolvedCycle: Cycle =
      cycle ?? (plan === "starter" ? "onetime" : "monthly");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, cycle: resolvedCycle }),
      });
      const data = await res.json();
      if (!data.orderId) {
        setToast(data.error || "Payment error");
        setTimeout(() => setToast(""), 3000);
        return;
      }

      // Load Razorpay script if not loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.head.appendChild(script);
        await new Promise((r) => { script.onload = r; });
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bhaagyavedh",
        description: data.description ?? `${plan} ${resolvedCycle}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setToast(isMr ? "पेमेंट यशस्वी!" : "Payment successful!");
            setUser((prev) =>
              prev
                ? { ...prev, plan: verifyData.plan, billingCycle: verifyData.cycle ?? resolvedCycle }
                : prev,
            );
          } else {
            setToast(isMr ? "पेमेंट अयशस्वी" : "Payment failed");
          }
          setTimeout(() => setToast(""), 3000);
        },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone || "" },
        theme: { color: "#3d0c0c" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setToast(isMr ? "पेमेंट त्रुटी" : "Payment error");
      setTimeout(() => setToast(""), 3000);
    }
  }

  /* Auto-open Razorpay when redirected from /pricing with ?plan=X&cycle=Y.
   * We consume the params once (clearing them from the URL) so refresh
   * doesn't re-open the modal and 'Back' doesn't fire another order. */
  useEffect(() => {
    if (loading || !user) return;
    const qpPlan = searchParams.get("plan") as PaidPlan | null;
    const qpCycle = searchParams.get("cycle") as Cycle | null;
    if (!qpPlan) return;
    const validPlans: PaidPlan[] = ["starter", "premium", "plus", "family"];
    if (!validPlans.includes(qpPlan)) return;

    // Clear the query so refresh/back doesn't re-trigger, then fire.
    const url = new URL(window.location.href);
    url.searchParams.delete("plan");
    url.searchParams.delete("cycle");
    window.history.replaceState({}, "", url.toString());

    handlePayment(qpPlan, qpCycle ?? undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id]);

  if (loading) {
    return <div className="bg-[#f5f4f1] min-h-screen flex items-center justify-center"><p className="text-[#5c1a1a]/60">{t("लोड होत आहे...", "Loading...")}</p></div>;
  }

  if (!user) {
    return (
      <div className="bg-[#f5f4f1] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#5c1a1a]/70 text-lg">{t("कृपया लॉग इन करा.", "Please sign in first.")}</p>
          <Link href="/login" className="mt-4 inline-block px-6 py-2 rounded-lg bg-[#d4a843] text-[#3d0c0c] font-medium hover:bg-[#e5bc5a] transition">
            {t("लॉग इन करा", "Sign In")}
          </Link>
        </div>
      </div>
    );
  }

  const planLabels: Record<string, { mr: string; en: string }> = {
    free: { mr: "मोफत", en: "Free" },
    starter: { mr: "स्टार्टर", en: "Starter" },
    premium: { mr: "प्रीमियम", en: "Premium" },
    plus: { mr: "प्रीमियम प्लस", en: "Premium Plus" },
    family: { mr: "फॅमिली", en: "Family" },
  };

  const cycleLabel = user.billingCycle === "yearly"
    ? t("वार्षिक", "Yearly")
    : user.billingCycle === "monthly"
      ? t("मासिक", "Monthly")
      : user.billingCycle === "onetime"
        ? t("एकरकमी", "One-time")
        : null;

  const trialDaysLeft = user.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const navItems: { key: Tab; labelMr: string; labelEn: string }[] = [
    { key: "overview", labelMr: "माझे खाते", labelEn: "Overview" },
    { key: "kundlis", labelMr: "माझ्या कुंडल्या", labelEn: "My Kundlis" },
    { key: "payments", labelMr: "पेमेंट्स", labelEn: "Payments" },
    { key: "orders", labelMr: "माझ्या ऑर्डर्स", labelEn: "My Orders" },
    { key: "profile", labelMr: "प्रोफाइल सेटिंग्ज", labelEn: "Profile Settings" },
  ];

  function handleNavClick(key: Tab) {
    setActiveTab(key);
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-[#f5f4f1]">
      {/* Toast */}
      {toast && <div className="fixed top-4 right-4 z-[60] px-4 py-2 bg-[#3d0c0c] text-[#d4a843] rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      {/* Mobile sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-3 z-[55] md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#3d0c0c] text-white/80 shadow-md">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Left Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen w-56 flex-shrink-0 bg-[#3d0c0c] text-white/80 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img src={user.image} alt="" className="w-9 h-9 rounded-full border border-[#d4a843]/40" />
            ) : (
              <span className="w-9 h-9 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#d4a843] text-sm font-bold">
                {user.name[0].toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#d4a843] truncate">{user.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full text-left px-5 py-2.5 text-[13px] font-medium transition-colors ${
                activeTab === item.key
                  ? "bg-white/10 text-[#d4a843] border-r-2 border-[#d4a843]"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              {t(item.labelMr, item.labelEn)}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          {user.role === "admin" && (
            <Link href="/admin" className="block text-xs text-[#d4a843] font-medium hover:text-[#d4a843]/80 transition">
              {t("अॅडमिन पॅनल →", "Admin Panel →")}
            </Link>
          )}
          <button
            onClick={() => {
              document.cookie = "dev-session=; path=/; max-age=0";
              window.location.href = "/api/auth/signout?callbackUrl=/";
            }}
            className="text-xs text-red-400/70 hover:text-red-400 transition"
          >
            {t("लॉग आउट", "Sign Out")}
          </button>
          <Link href="/" className="block text-xs text-white/40 hover:text-white/70 transition">
            {t("मुख्यपृष्ठावर जा", "Back to Site")}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 py-6 px-4 sm:px-8">
        <div className="mb-6 md:ml-0 ml-10">
          <h1 className="text-xl font-bold text-[#3d0c0c]">
            {t(navItems.find((n) => n.key === activeTab)?.labelMr || "", navItems.find((n) => n.key === activeTab)?.labelEn || "")}
          </h1>
        </div>

        {/* ════════ OVERVIEW ════════ */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Account Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-4">{t("खाते माहिती", "Account Information")}</h3>
                <dl className="space-y-3">
                  {([
                    [t("नाव", "Name"), user.name],
                    [t("ईमेल", "Email"), user.email],
                    [t("फोन", "Phone"), user.phone || "—"],
                    [t("भाषा", "Language"), user.language === "mr" ? t("मराठी", "Marathi") : t("इंग्रजी", "English")],
                    [t("प्रदाता", "Provider"), user.provider || "—"],
                    [t("सदस्यता दिनांक", "Member Since"), new Date(user.createdAt).toLocaleDateString(isMr ? "mr-IN" : "en-IN")],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-start justify-between">
                      <dt className="text-xs text-[#5c1a1a]/50">{label}</dt>
                      <dd className="text-sm text-[#3d0c0c] font-medium text-right max-w-[60%] break-all">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-4">{t("जन्म माहिती", "Birth Details")}</h3>
                <dl className="space-y-3">
                  {([
                    [t("जन्म तारीख", "Date of Birth"), user.dateOfBirth || "—"],
                    [t("जन्म वेळ", "Birth Time"), user.birthTime || "—"],
                    [t("जन्म ठिकाण", "Birth Place"), user.birthPlace || "—"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-start justify-between">
                      <dt className="text-xs text-[#5c1a1a]/50">{label}</dt>
                      <dd className="text-sm text-[#3d0c0c] font-medium text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
                {(!user.dateOfBirth || !user.birthTime || !user.birthPlace) && (
                  <button onClick={() => setActiveTab("profile")} className="mt-4 text-xs text-[#d4a843] hover:text-[#3d0c0c] font-medium">
                    {t("माहिती भरा →", "Complete Details →")}
                  </button>
                )}
              </div>
            </div>

            {/* Family plan banner — shown to owners of family plans.
                 Seat invite UI ships in Phase 3; for now just confirm ownership. */}
            {user.plan === "family" && !user.familyOwnerId && (
              <div className="bg-gradient-to-br from-[#3d0c0c] to-[#5c1a1a] text-white rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[#d4a843] text-xs uppercase tracking-wider font-semibold">
                    {t("फॅमिली योजना — तुम्ही मालक", "Family plan — owner")}
                  </p>
                  <p className="text-sm mt-1 text-white/80">
                    {t(
                      "तुमच्या कुटुंबातील ४ सदस्यांसाठी Premium. सदस्य जोडण्याचा पर्याय लवकरच.",
                      "Premium for up to 4 family members. Seat invitations coming soon.",
                    )}
                  </p>
                </div>
                <span className="inline-block px-3 py-1.5 rounded-lg bg-[#d4a843] text-[#3d0c0c] text-xs font-bold whitespace-nowrap">
                  4 {t("जागा", "seats")}
                </span>
              </div>
            )}

            {/* Plan & Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-[#5c1a1a]/50 uppercase tracking-wide">{t("सध्याची योजना", "Current Plan")}</p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <p className="text-xl font-bold text-[#3d0c0c]">
                    {isMr ? planLabels[user.plan || "free"].mr : planLabels[user.plan || "free"].en}
                  </p>
                  {cycleLabel && (
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d4a843]/15 text-[#8c6a1d]">
                      {cycleLabel}
                    </span>
                  )}
                  {user.familyOwnerId && (
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {t("सदस्य", "Seat")}
                    </span>
                  )}
                </div>
                {trialDaysLeft !== null && trialDaysLeft > 0 && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ⏳ {t(`${trialDaysLeft} दिवस ट्रायल`, `${trialDaysLeft}-day trial left`)}
                  </p>
                )}
                {user.planExpiresAt && (
                  <p className="text-[10px] text-[#5c1a1a]/40 mt-1">
                    {t("समाप्ती:", "Expires:")} {new Date(user.planExpiresAt).toLocaleDateString()}
                  </p>
                )}
                {user.plan === "free" && (
                  <button onClick={() => setActiveTab("payments")} className="mt-3 text-xs text-[#d4a843] hover:text-[#3d0c0c] font-medium">{t("अपग्रेड करा →", "Upgrade →")}</button>
                )}
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-[#5c1a1a]/50 uppercase tracking-wide">{t("सेव केलेल्या कुंडल्या", "Saved Kundlis")}</p>
                <p className="text-xl font-bold text-[#3d0c0c] mt-1">{kundlis.length}</p>
                {kundlis.length > 0 && (
                  <button onClick={() => setActiveTab("kundlis")} className="mt-3 text-xs text-[#d4a843] hover:text-[#3d0c0c] font-medium">{t("पहा →", "View →")}</button>
                )}
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <p className="text-xs text-[#5c1a1a]/50 uppercase tracking-wide">{t("खाते स्थिती", "Account Status")}</p>
                <p className="text-xl font-bold text-green-700 mt-1">{t("सक्रिय", "Active")}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { labelMr: "नवीन कुंडली तयार करा", labelEn: "Generate New Kundli", href: "/kundli" },
                { labelMr: "गुण मिलान करा", labelEn: "Match Kundlis", href: "/matching" },
                { labelMr: "आजचे पंचांग", labelEn: "Today's Panchang", href: "/panchang" },
              ].map((q) => (
                <Link key={q.href} href={q.href} className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-[#d4a843]/40 transition">
                  <p className="text-sm font-medium text-[#3d0c0c]">{t(q.labelMr, q.labelEn)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ════════ KUNDLIS ════════ */}
        {activeTab === "kundlis" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium text-[#3d0c0c]">{kundlis.length} {t("कुंडल्या", "kundlis")}</p>
              <Link href="/kundli" className="px-4 py-1.5 rounded bg-[#3d0c0c] text-[#d4a843] text-xs font-medium hover:bg-[#5c1a1a] transition">
                {t("+ नवीन कुंडली", "+ New Kundli")}
              </Link>
            </div>
            {kundlis.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5c1a1a]/50 text-sm">{t("अजून कुंडली सेव केलेली नाही.", "No kundlis saved yet.")}</p>
                <Link href="/kundli" className="mt-3 inline-block text-xs text-[#d4a843] hover:text-[#3d0c0c] font-medium">
                  {t("कुंडली तयार करा →", "Generate Kundli →")}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {kundlis.map((k) => {
                  const [y, mo, d] = (k.dateOfBirth || "").split("-");
                  const [h, mi] = (k.birthTime || "").split(":");
                  const params = new URLSearchParams({
                    view: k.id,
                    name: k.name,
                    year: y || "", month: mo || "", day: d || "",
                    hour: h || "", minute: mi || "",
                    lat: k.latitude != null ? String(k.latitude) : "",
                    lng: k.longitude != null ? String(k.longitude) : "",
                    tz: "5.5",
                    place: k.birthPlace || "",
                  });
                  return (
                    <Link key={k.id} href={`/${lang}/kundli/result?${params.toString()}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-[#3d0c0c] text-sm">{k.name}</p>
                        <p className="text-xs text-[#5c1a1a]/40 mt-0.5">
                          {k.dateOfBirth} &middot; {k.birthTime} &middot; {k.birthPlace}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-[#5c1a1a]/40">{new Date(k.createdAt).toLocaleDateString(isMr ? "mr-IN" : "en-IN")}</p>
                        <span className="text-[#d4a843] text-sm">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════ PAYMENTS ════════ */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4 items-stretch">
              {/* Free */}
              <div className={`bg-white rounded-lg border p-5 flex flex-col ${user.plan === "free" ? "border-[#d4a843] border-2" : "border-gray-200"}`}>
                <p className="font-bold text-[#3d0c0c]">{t("मोफत", "Free")}</p>
                <p className="text-2xl font-bold text-[#3d0c0c] mt-1">₹0<span className="text-xs font-normal text-[#5c1a1a]/50">&nbsp;·&nbsp;{t("कायम", "forever")}</span></p>
                <ul className="mt-4 space-y-2 text-xs text-[#5c1a1a]/70 flex-1">
                  <li>✓ {t("१ मोफत कुंडली", "1 Free Kundli")}</li>
                  <li>✓ {t("मूळ कुंडली विश्लेषण", "Basic Kundli Analysis")}</li>
                  <li>✓ {t("राशीफल, पंचांग, कॅलेंडर", "Rashifal, Panchang, Calendar")}</li>
                  <li>✓ {t("गुण मिलान", "Gun Milaan")}</li>
                  <li>✓ {t("मुहूर्त शोधक", "Muhurat Finder")}</li>
                </ul>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  {user.plan === "free" ? (
                    <div className="py-2.5 rounded-lg text-center text-xs font-semibold bg-[#d4a843]/15 text-[#d4a843]">
                      ✓ {t("सध्याची योजना", "Current Plan")}
                    </div>
                  ) : (
                    <div className="py-2.5 text-center text-xs text-[#5c1a1a]/40">
                      {t("सुरुवातीची योजना", "Starter plan")}
                    </div>
                  )}
                </div>
              </div>

              {/* Premium */}
              <div className={`bg-white rounded-lg border p-5 flex flex-col relative ${user.plan === "premium" ? "border-[#d4a843] border-2" : "border-gray-200"}`}>
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap" style={{ background: "#d4a843", color: "#1a0505" }}>
                  ⭐ {t("शिफारस", "Recommended")}
                </span>
                <p className="font-bold text-[#3d0c0c]">{t("प्रीमियम", "Premium")}</p>
                <p className="text-2xl font-bold text-[#3d0c0c] mt-1">₹599<span className="text-xs font-normal text-[#5c1a1a]/50">/{t("महिना", "month")}</span></p>
                <ul className="mt-4 space-y-2 text-xs text-[#5c1a1a]/70 flex-1">
                  <li>✓ {t("अमर्यादित कुंडली PDF", "Unlimited Kundli PDFs")}</li>
                  <li>✓ {t("दशा विश्लेषण व उपाय", "Dasha Analysis & Remedies")}</li>
                  <li>✓ {t("छापील दिनदर्शिका घरपोच", "Printed Calendar Shipped")}</li>
                  <li>✓ {t("कुंडली पुस्तकावर २०% सवलत", "20% off Kundli Book")}</li>
                  <li>✓ {t("प्राधान्य समर्थन", "Priority Support")}</li>
                </ul>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  {user.plan !== "premium" ? (
                    <button onClick={() => handlePayment("premium")} className="w-full py-2.5 text-xs font-semibold rounded-lg text-[#d4a843] transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                      {t("प्रीमियम घ्या", "Get Premium")}
                    </button>
                  ) : (
                    <div className="py-2.5 rounded-lg text-center text-xs font-semibold bg-[#d4a843]/15 text-[#d4a843]">
                      ✓ {t("सध्याची योजना", "Current Plan")}
                    </div>
                  )}
                </div>
              </div>

              {/* Plus */}
              <div className={`bg-white rounded-lg border p-5 flex flex-col ${user.plan === "plus" ? "border-[#2d6b2d] border-2" : "border-gray-200"}`}>
                <p className="font-bold text-[#3d0c0c]">{t("प्रीमियम प्लस", "Premium Plus")}</p>
                <p className="text-2xl font-bold text-[#3d0c0c] mt-1">₹1499<span className="text-xs font-normal text-[#5c1a1a]/50">/{t("महिना", "month")}</span></p>
                <ul className="mt-4 space-y-2 text-xs text-[#5c1a1a]/70 flex-1">
                  <li>✓ {t("सर्व Premium फायदे", "Everything in Premium")}</li>
                  <li>✓ {t("वर्षी १ मोफत बांधील कुंडली पुस्तक", "1 FREE bound kundli book/year")}</li>
                  <li>✓ {t("दरमहा १ ज्योतिषी सल्लामसलत", "1 astrologer consultation/month")}</li>
                  <li>✓ {t("पूजा बुकिंग सवलत", "Pooja booking discount")}</li>
                  <li>✓ {t("प्राधान्य समर्थन", "Priority Support")}</li>
                </ul>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  {user.plan !== "plus" ? (
                    <button onClick={() => handlePayment("plus")} className="w-full py-2.5 text-xs font-semibold rounded-lg text-white transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #2d6b2d, #1f4d1f)" }}>
                      {t("Plus घ्या", "Get Plus")}
                    </button>
                  ) : (
                    <div className="py-2.5 rounded-lg text-center text-xs font-semibold bg-[#2d6b2d]/15 text-[#2d6b2d]">
                      ✓ {t("सध्याची योजना", "Current Plan")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-3">{t("पेमेंट इतिहास", "Payment History")}</h3>
              <p className="text-sm text-[#5c1a1a]/40">{t("अजून कोणतेही पेमेंट नाही.", "No payments yet.")}</p>
            </div>
          </div>
        )}

        {/* ════════ ORDERS (printed book shipments) ════════ */}
        {activeTab === "orders" && (
          <div className="space-y-5 max-w-4xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-bold text-[#3d0c0c]">{t("माझ्या ऑर्डर्स", "My Orders")}</h2>
              <Link href={`/${lang}/shop/claim-book`} className="px-4 py-2 rounded-lg text-sm font-semibold text-[#d4a843]" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                {t("+ नवीन ऑर्डर", "+ New Order")}
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-sm text-[#5c1a1a]/60 mb-4">
                  {t("तुम्ही अजून छापील पुस्तक मागवले नाही.", "You haven't ordered a printed book yet.")}
                </p>
                <Link href={`/${lang}/shop`} className="inline-block px-5 py-2 rounded-lg bg-[#d4a843] text-[#3d0c0c] text-sm font-semibold">
                  {t("शॉप पहा", "Visit Shop")}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(o => {
                  const statusColor: Record<string, string> = {
                    pending: "#9b8b6e", printing: "#d4a843", shipped: "#3b82f6",
                    delivered: "#2d6b2d", cancelled: "#b91c1c",
                  };
                  const statusLabelMr: Record<string, string> = {
                    pending: "प्रलंबित", printing: "छापणीत", shipped: "पाठवले",
                    delivered: "पोहोचले", cancelled: "रद्द",
                  };
                  const dateStr = new Date(o.createdAt).toLocaleDateString(isMr ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={o.id} className="bg-white rounded-lg border border-gray-200 p-4 text-sm">
                      <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                        <div>
                          <div className="font-bold text-[#3d0c0c]">{o.kundliName}</div>
                          <div className="text-xs text-[#5c1a1a]/50 mt-0.5">
                            {t("ऑर्डर", "Order")} #{o.id.slice(0, 8)} · {dateStr}
                          </div>
                        </div>
                        <span style={{ background: statusColor[o.status] + "22", color: statusColor[o.status], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                          {t(statusLabelMr[o.status] ?? o.status, o.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-[#5c1a1a]/50 mb-0.5">{t("शिपिंग पत्ता", "Ship to")}</div>
                          <div className="text-[#3d0c0c]">{o.recipientName}, {o.addressLine1}, {o.city}, {o.state} — {o.pin}</div>
                        </div>
                        <div>
                          <div className="text-[#5c1a1a]/50 mb-0.5">{t("रक्कम", "Amount")}</div>
                          <div className="text-[#3d0c0c] font-semibold">
                            {o.amountPaid === 0 ? t("मोफत (Plus वार्षिक)", "FREE (Plus annual)") : `₹${o.amountPaid / 100}`}
                          </div>
                        </div>
                        {o.trackingNumber && (
                          <div className="sm:col-span-2">
                            <div className="text-[#5c1a1a]/50 mb-0.5">{t("ट्रॅकिंग", "Tracking")}</div>
                            <div className="text-[#3d0c0c] font-mono text-xs">{o.courier ? `${o.courier} · ` : ""}{o.trackingNumber}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════ PROFILE SETTINGS ════════ */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg">
            <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-5">{t("प्रोफाइल अपडेट करा", "Update Profile")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("नाव", "Name")}</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#3d0c0c] focus:outline-none focus:ring-1 focus:ring-[#d4a843]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("ईमेल", "Email")}</label>
                <input type="email" value={user.email} disabled
                  className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#5c1a1a]/50 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("फोन नंबर", "Phone")}</label>
                <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#3d0c0c] focus:outline-none focus:ring-1 focus:ring-[#d4a843]"
                  placeholder="+91 9146189837" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("जन्म तारीख", "Date of Birth")}</label>
                  <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#3d0c0c] focus:outline-none focus:ring-1 focus:ring-[#d4a843]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("जन्म वेळ", "Birth Time")}</label>
                  <input type="time" value={formBirthTime} onChange={(e) => setFormBirthTime(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#3d0c0c] focus:outline-none focus:ring-1 focus:ring-[#d4a843]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{t("जन्म ठिकाण", "Birth Place")}</label>
                <input type="text" value={formBirthPlace} onChange={(e) => setFormBirthPlace(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200 text-sm text-[#3d0c0c] focus:outline-none focus:ring-1 focus:ring-[#d4a843]"
                  placeholder={t("उदा. पुणे", "e.g. Pune")} />
              </div>
              <button onClick={saveProfile} disabled={saving}
                className="px-6 py-2 rounded bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition disabled:opacity-50 text-sm">
                {saving ? t("सेव होत आहे...", "Saving...") : t("सेव करा", "Save")}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
