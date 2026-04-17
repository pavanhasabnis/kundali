"use client";

import { useLang } from "@/lib/astrology/language-context";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPageClient() {
  const { t } = useLang();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Create account first
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Signup failed");
          setLoading(false);
          return;
        }
      }

      // Sign in with credentials
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(mode === "signup" ? "Account created but login failed. Try signing in." : t("चुकीचा ईमेल किंवा पासवर्ड", "Invalid email or password", "ग़लत ईमेल या पासवर्ड"));
        setLoading(false);
        return;
      }

      // Check role and redirect accordingly
      const sess = await fetch("/api/auth/session").then((r) => r.json());
      const role = sess?.user?.role;
      window.location.href = role === "admin" ? "/admin" : "/account";
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  async function devLogin(role: "user" | "admin") {
    const res = await fetch("/api/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = role === "admin" ? "/admin" : "/account";
    }
  }

  const inp = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843] focus:border-[#d4a843] outline-none text-[#3d0c0c]";

  return (
    <div className="bg-[#FAFAF8] min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-xl border border-[#d4a843]/20 shadow-sm p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <span className="text-4xl">🪷</span>
            <h1 className="text-xl font-bold text-[#3d0c0c] mt-3">
              {mode === "login" ? t("लॉग इन करा", "Sign In", "लॉग इन करें") : t("खाते तयार करा", "Create Account", "खाता बनाएँ")}
            </h1>
            <p className="text-sm text-[#5c1a1a]/60 mt-2">
              {t(
                "तुमची कुंडली, रिपोर्ट्स व सेवा एकाच ठिकाणी पहा.",
                "Access your kundlis, reports & services in one place.",
                "अपनी कुंडली, रिपोर्ट्स और सेवाएँ एक ही जगह देखें."
              )}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition text-[#3d0c0c] font-medium shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("Google ने लॉग इन करा", "Sign in with Google", "Google से लॉग इन करें")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#5c1a1a]/40">{t("किंवा", "or", "या")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 text-left">
            {mode === "signup" && (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inp}
                placeholder={t("तुमचे नाव", "Your name", "आपका नाम")}
                required
              />
            )}
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inp}
              placeholder={t("ईमेल", "Email", "ईमेल")}
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={inp}
              placeholder={t("पासवर्ड", "Password", "पासवर्ड")}
              required
              minLength={6}
            />

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
            >
              {loading
                ? "..."
                : mode === "login"
                ? t("लॉग इन करा", "Sign In", "लॉग इन करें")
                : t("खाते तयार करा", "Create Account", "खाता बनाएँ")}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <p className="text-sm text-[#5c1a1a]/60 mt-4">
            {mode === "login" ? (
              <>
                {t("खाते नाही?", "No account?", "खाता नहीं?")}{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-[#d4a843] font-medium hover:underline">
                  {t("नवीन खाते बनवा", "Create one", "नया खाता बनाएँ")}
                </button>
              </>
            ) : (
              <>
                {t("आधीच खाते आहे?", "Already have an account?", "पहले से खाता है?")}{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-[#d4a843] font-medium hover:underline">
                  {t("लॉग इन करा", "Sign In", "लॉग इन करें")}
                </button>
              </>
            )}
          </p>

          {/* Dev Test Buttons — only visible in development */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-6 pt-4 border-t border-dashed border-orange-300">
              <p className="text-xs text-orange-500 font-medium mb-3">Dev Testing Only</p>
              <div className="flex gap-2">
                <button
                  onClick={() => devLogin("user")}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                >
                  {t("टेस्ट यूजर", "Test User", "टेस्ट यूज़र")}
                </button>
                <button
                  onClick={() => devLogin("admin")}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition"
                >
                  {t("टेस्ट अॅडमिन", "Test Admin", "टेस्ट एडमिन")}
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <p className="text-xs text-[#5c1a1a]/40 mt-6">
            {t(
              "लॉग इन केल्यावर तुम्हाला मोफत कुंडली, सेव केलेल्या पत्रिका आणि बरेच काही मिळेल.",
              "After signing in you get free kundlis, saved patrikas, and much more.",
              "लॉग इन करने पर आपको मुफ्त कुंडली, सहेजी गई पत्रिकाएँ और बहुत कुछ मिलेगा."
            )}
          </p>

          {/* Back */}
          <Link href="/" className="inline-block mt-4 text-sm text-[#d4a843] hover:text-[#3d0c0c] transition">
            {t("← मुख्यपृष्ठावर जा", "← Back to Home", "← मुख्य पृष्ठ पर जाएँ")}
          </Link>
        </div>
      </div>
    </div>
  );
}
