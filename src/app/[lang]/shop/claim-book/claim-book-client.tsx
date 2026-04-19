"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";

interface SavedKundli {
  id: string;
  name: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  createdAt: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  plan?: string;
}

interface OrderSummary {
  freeClaimAvailable: boolean;
  freeClaimsThisYear: number;
  plan: string;
}

export default function ClaimBookClient() {
  const { t, lang } = useLang();
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [kundlis, setKundlis] = useState<SavedKundli[]>([]);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [form, setForm] = useState({
    recipientName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Maharashtra",
    pin: "",
    phone: "",
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [uRes, kRes, oRes] = await Promise.all([
          fetch("/api/user").then(r => r.ok ? r.json() : null),
          fetch("/api/user/kundlis").then(r => r.ok ? r.json() : null),
          fetch("/api/book-order").then(r => r.ok ? r.json() : null),
        ]);
        if (cancelled) return;
        if (!uRes?.user) { router.push(`/${lang}/login?redirect=/${lang}/shop/claim-book`); return; }
        setUser(uRes.user);
        setKundlis(kRes?.kundlis ?? []);
        setSummary(oRes ? { freeClaimAvailable: oRes.freeClaimAvailable, freeClaimsThisYear: oRes.freeClaimsThisYear, plan: oRes.plan } : null);
        setForm(f => ({
          ...f,
          recipientName: uRes.user.name ?? "",
          phone: uRes.user.phone ?? "",
        }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [lang, router]);

  async function ensureRazorpay(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) return true;
    return new Promise(resolve => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  async function finalizeBookOrder(razorpayPaymentId?: string) {
    const res = await fetch("/api/book-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kundliId: selectedId,
        recipientName: form.recipientName,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pin: form.pin,
        phone: form.phone,
        razorpayPaymentId,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? t("अयशस्वी. पुन्हा प्रयत्न करा.", "Failed. Try again.", "विफल. पुनः प्रयास करें."));
      return;
    }
    const data = await res.json();
    setSuccess(t(
      `ऑर्डर नोंदवली! ऑर्डर ID: ${data.orderId.slice(0, 8)}`,
      `Order placed! Order ID: ${data.orderId.slice(0, 8)}`,
      `ऑर्डर दर्ज! ऑर्डर ID: ${data.orderId.slice(0, 8)}`
    ));
    setTimeout(() => router.push(`/${lang}/account?tab=orders`), 1800);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedId) { setError(t("कुंडली निवडा", "Select a kundli", "कुंडली चुनें")); return; }
    if (!/^[1-9]\d{5}$/.test(form.pin)) { setError(t("PIN ६ अंकी असावा", "PIN must be 6 digits", "PIN 6 अंकों का हो")); return; }
    if (!/^[0-9]{10,13}$/.test(form.phone.replace(/[^0-9]/g, ""))) { setError(t("फोन नंबर तपासा", "Check phone number", "फ़ोन नंबर जांचें")); return; }

    const plan = summary?.plan ?? "free";
    const isFreeClaim = plan === "plus" && summary?.freeClaimAvailable === true;

    setSubmitting(true);

    if (isFreeClaim) {
      await finalizeBookOrder();
      setSubmitting(false);
      return;
    }

    // Paid: create Razorpay order → checkout → verify → create book order
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "book" }),
      });
      const data = await res.json();
      if (!data.orderId) {
        setError(t("पेमेंट ऑर्डर तयार होऊ शकली नाही.", "Could not create payment order.", "भुगतान ऑर्डर नहीं बना."));
        setSubmitting(false);
        return;
      }
      const loaded = await ensureRazorpay();
      if (!loaded) {
        setError(t("Razorpay लोड होऊ शकले नाही.", "Razorpay failed to load.", "Razorpay लोड नहीं हुआ."));
        setSubmitting(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bhaagyavedh",
        description: data.description ?? "Bound Kundli Book",
        order_id: data.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (!verify.ok) {
            setError(t("पेमेंट व्हेरिफिकेशन अयशस्वी.", "Payment verification failed.", "भुगतान सत्यापन विफल."));
            setSubmitting(false);
            return;
          }
          await finalizeBookOrder(response.razorpay_payment_id);
          setSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError(t("पेमेंट रद्द केले.", "Payment cancelled.", "भुगतान रद्द."));
          },
        },
        prefill: { name: user?.name, email: user?.email, contact: form.phone },
        theme: { color: "#3d0c0c" },
      });
      rzp.open();
    } catch {
      setError(t("पेमेंट त्रुटी.", "Payment error.", "भुगतान त्रुटि."));
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b5b3e" }}>
        {t("लोड होत आहे…", "Loading…", "लोड हो रहा है…")}
      </div>
    );
  }

  const plan = summary?.plan ?? "free";
  const isPlus = plan === "plus";
  const isPremium = plan === "premium";
  const hasFreeClaim = summary?.freeClaimAvailable === true;
  const amount = isPlus && hasFreeClaim ? 0 : isPremium ? 649 : 799;
  const chargeLabel = amount === 0
    ? t("मोफत (Plus वार्षिक फायदा)", "FREE (Plus annual perk)", "मुफ्त (Plus वार्षिक लाभ)")
    : `₹${amount}`;

  return (
    <div style={{ minHeight: "100vh", background: "#fffaf0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 20px 60px" }}>
        <Link href={`/${lang}/shop`} style={{ fontSize: 13, color: "#5c1a1a", textDecoration: "none" }}>
          ← {t("दुकानावर परत", "Back to Shop", "शॉप पर वापस")}
        </Link>
        <h1 style={{ fontSize: 30, color: "#3d0c0c", marginTop: 16, marginBottom: 6, fontWeight: 700 }}>
          {t("छापील कुंडली पुस्तक मागवा", "Claim Printed Kundli Book", "मुद्रित कुंडली पुस्तक लें")}
        </h1>
        <p style={{ fontSize: 14, color: "#6b5b3e", marginTop: 0, marginBottom: 24 }}>
          {t(
            "तुमच्या सेव्ह केलेल्या कुंडलींमधून एक निवडा. बांधील पुस्तक महाराष्ट्रभर मोफत घरपोच.",
            "Select one of your saved kundlis. Bound book shipped free across Maharashtra.",
            "अपनी सहेजी कुंडलियों में से एक चुनें. बाउंड पुस्तक महाराष्ट्र भर में मुफ्त घर पर."
          )}
        </p>

        {/* Plan badge */}
        <div style={{
          padding: "12px 16px", background: isPlus ? "#d4f0d4" : isPremium ? "#fff3d6" : "#f5efe0",
          border: `1px solid ${isPlus ? "#2d6b2d" : "#d4a843"}`,
          borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ fontSize: 13, color: "#3d0c0c" }}>
            <strong>{t("तुमची योजना", "Your plan", "आपकी योजना")}: </strong>
            <span style={{ color: isPlus ? "#2d6b2d" : isPremium ? "#b88f38" : "#6b5b3e", fontWeight: 700 }}>
              {plan.toUpperCase()}
            </span>
            {isPlus && hasFreeClaim && (
              <span style={{ marginLeft: 10, color: "#2d6b2d", fontWeight: 600 }}>
                · {t("१ मोफत पुस्तक शिल्लक", "1 free book available", "1 मुफ्त पुस्तक उपलब्ध")}
              </span>
            )}
            {isPlus && !hasFreeClaim && (
              <span style={{ marginLeft: 10, color: "#9b8b6e" }}>
                · {t("या वर्षाचे मोफत पुस्तक वापरले", "Free book used this year", "इस वर्ष का मुफ्त पुस्तक उपयोग किया")}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#3d0c0c" }}>
            {t("एकूण", "Total", "कुल")}: {chargeLabel}
          </div>
        </div>

        {kundlis.length === 0 ? (
          <div style={{ background: "#fff", padding: 24, border: "1px solid #e5d5b5", borderRadius: 10, textAlign: "center" }}>
            <p style={{ color: "#5c1a1a", marginBottom: 16 }}>
              {t("तुमच्याकडे सेव्ह केलेली कुंडली नाही.", "You have no saved kundlis yet.", "आपके पास सहेजी कुंडली नहीं है.")}
            </p>
            <Link href={`/${lang}/kundli`} style={{
              display: "inline-block", padding: "10px 20px",
              background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843",
              borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none",
            }}>
              {t("कुंडली बनवा", "Create Kundli", "कुंडली बनाएं")}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Kundli selector */}
            <section style={{ background: "#fff", padding: 20, border: "1px solid #e5d5b5", borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, color: "#3d0c0c", marginTop: 0, marginBottom: 14, fontWeight: 700 }}>
                {t("१. कुंडली निवडा", "1. Choose Kundli", "1. कुंडली चुनें")}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {kundlis.map(k => {
                  const active = selectedId === k.id;
                  return (
                    <label key={k.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 8,
                      border: `1.5px solid ${active ? "#d4a843" : "#e5d5b5"}`,
                      background: active ? "#fff8e7" : "#fffdf6",
                      cursor: "pointer",
                    }}>
                      <input type="radio" name="kundli" value={k.id}
                        checked={active} onChange={() => setSelectedId(k.id)}
                        style={{ accentColor: "#d4a843" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#3d0c0c" }}>{k.name}</div>
                        <div style={{ fontSize: 12, color: "#6b5b3e", marginTop: 2 }}>
                          {k.dateOfBirth} · {k.birthTime} · {k.birthPlace}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Shipping address */}
            <section style={{ background: "#fff", padding: 20, border: "1px solid #e5d5b5", borderRadius: 10 }}>
              <h2 style={{ fontSize: 16, color: "#3d0c0c", marginTop: 0, marginBottom: 14, fontWeight: 700 }}>
                {t("२. शिपिंग पत्ता", "2. Shipping Address", "2. शिपिंग पता")}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label={t("प्राप्तकर्त्याचे नाव", "Recipient Name", "प्राप्तकर्ता का नाम")}
                  value={form.recipientName} onChange={v => setForm(f => ({ ...f, recipientName: v }))} required span={2} />
                <Field label={t("पत्ता (१)", "Address Line 1", "पता (1)")}
                  value={form.addressLine1} onChange={v => setForm(f => ({ ...f, addressLine1: v }))} required span={2} />
                <Field label={t("पत्ता (२) पर्यायी", "Address Line 2 (optional)", "पता (2) वैकल्पिक")}
                  value={form.addressLine2} onChange={v => setForm(f => ({ ...f, addressLine2: v }))} span={2} />
                <Field label={t("शहर", "City", "शहर")}
                  value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} required />
                <Field label={t("राज्य", "State", "राज्य")}
                  value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} required />
                <Field label={t("PIN कोड", "PIN Code", "PIN कोड")}
                  value={form.pin} onChange={v => setForm(f => ({ ...f, pin: v }))} required />
                <Field label={t("फोन नंबर", "Phone", "फ़ोन")}
                  value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} required />
              </div>
            </section>

            {error && (
              <div style={{ padding: "12px 16px", background: "#fef2f2", color: "#b91c1c", borderRadius: 8, border: "1px solid #fca5a5", fontSize: 13 }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: "12px 16px", background: "#d4f0d4", color: "#2d6b2d", borderRadius: 8, border: "1px solid #2d6b2d", fontSize: 13, fontWeight: 600 }}>
                ✓ {success}
              </div>
            )}

            <button type="submit" disabled={submitting || !selectedId}
              style={{
                padding: "14px 20px",
                background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843",
                border: "1.5px solid #d4a843", borderRadius: 8,
                fontWeight: 700, fontSize: 15, cursor: submitting ? "wait" : "pointer",
                opacity: !selectedId ? 0.5 : 1,
              }}>
              {submitting
                ? t("नोंदवत आहे…", "Placing order…", "ऑर्डर दर्ज…")
                : amount === 0
                ? t("मोफत मागवा", "Claim Free Book", "मुफ्त मंगवाएं")
                : t(`₹${amount} भरा आणि मागवा`, `Pay ₹${amount} and Order`, `₹${amount} भुगतान व ऑर्डर`)}
            </button>
            {amount > 0 && (
              <p style={{ fontSize: 12, color: "#9b8b6e", textAlign: "center", margin: 0 }}>
                {t("Razorpay सुरक्षित पेमेंट · UPI / कार्ड / नेट बँकिंग", "Razorpay secure payment · UPI / Card / Netbanking", "Razorpay सुरक्षित भुगतान · UPI / कार्ड / नेट बैंकिंग")}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, span = 1 }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; span?: 1 | 2 }) {
  return (
    <label style={{ gridColumn: span === 2 ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: "#6b5b3e", fontWeight: 600 }}>
        {label}{required && <span style={{ color: "#b91c1c", marginLeft: 2 }}>*</span>}
      </span>
      <input value={value} onChange={e => onChange(e.target.value)} required={required}
        style={{
          padding: "10px 12px", fontSize: 14, color: "#3d0c0c",
          border: "1px solid #e5d5b5", borderRadius: 6,
          background: "#fffdf6",
          outline: "none",
        }} />
    </label>
  );
}
