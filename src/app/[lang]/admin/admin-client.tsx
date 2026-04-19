"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLACES, type Place } from "@/lib/astrology/places";

// ── Types ──────────────────────────────────────────────────────────
interface User { id: string; name: string; email: string; image?: string; phone?: string; dateOfBirth?: string; birthTime?: string; birthPlace?: string; language?: string; plan: string; planExpiresAt?: string; role: string; provider?: string; providerAccountId?: string; createdAt: string; updatedAt?: string; }
interface BlogPost { slug: string; title: string; titleEn: string; category: string; categoryEn: string; date: string; summary?: string; summaryEn?: string; content?: string; contentEn?: string; }
interface Stats { totalUsers: number; premiumUsers: number; totalKundlis: number; totalPayments: number; revenue: number; }
interface KundliRecord { id: string; userId: string; userName: string; name: string; dateOfBirth: string; birthTime: string; birthPlace: string; createdAt: string; }
interface PaymentRecord { id: string; userId: string; userName: string; userEmail: string; amount: number; plan: string; status: string; razorpayPaymentId?: string; createdAt: string; }
interface Enquiry { id: string; name: string; email: string; phone?: string; subject?: string; message: string; status: string; createdAt: string; }
interface TravelPkg { id: string; titleMr: string; titleEn: string; descriptionMr?: string; descriptionEn?: string; category: string; duration?: string; priceFrom?: number; priceTo?: number; inclusions?: string; itineraryMr?: string; itineraryEn?: string; highlights?: string; imageUrl?: string; locationMr?: string; locationEn?: string; active: boolean; featured: boolean; createdAt: string; }
interface TravelEnq { id: string; packageId?: string; packageTitle?: string; name: string; email: string; phone: string; travelDate?: string; travelers?: number; message?: string; status: string; createdAt: string; }

type Tab = "dashboard" | "users" | "blog" | "temples" | "kundlis" | "payments" | "enquiries" | "travel" | "settings";

function BlogGenerator({ onGenerated, onToast }: { onGenerated: () => void; onToast: (msg: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  async function generate() {
    if (!prompt.trim()) { onToast("Please enter a topic"); return; }
    setGenerating(true);
    onToast("Generating article... this may take 30-60 seconds");
    try {
      const res = await fetch("/api/admin/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`Article created: ${data.title}`);
        onGenerated();
        setPrompt("");
      } else {
        onToast(data.error || "Failed to generate");
      }
    } catch {
      onToast("Network error. Try again.");
    }
    setGenerating(false);
  }

  return (
    <div className="space-y-3">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Write your article topic here... e.g.&#10;&#10;शनि साडेसाती 2026 मध्ये कोणत्या राशींवर प्रभाव&#10;&#10;or&#10;&#10;Benefits of wearing Pukhraj gemstone for Jupiter&#10;&#10;or&#10;&#10;गुरुपुष्यामृत योग — महत्व आणि खरेदीसाठी शुभ वेळ"
        rows={4}
        className="w-full px-4 py-3 rounded border border-gray-200 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/30 focus:outline-none focus:ring-1 focus:ring-[#d4a843] resize-none"
        disabled={generating}
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#5c1a1a]/40">AI will generate a 500-700 word article in both Marathi &amp; English</p>
        <button onClick={generate} disabled={generating || !prompt.trim()}
          className="px-5 py-2 rounded bg-[#3d0c0c] text-[#d4a843] text-sm font-medium hover:bg-[#5c1a1a] transition disabled:opacity-50">
          {generating ? "Generating..." : "Generate Article"}
        </button>
      </div>
    </div>
  );
}

function AdminKundliGenerator() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", day: "", month: "", year: "", hour: "", minute: "", ampm: "AM", city: "", latitude: "", longitude: "" });
  const [placeSearch, setPlaceSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = placeSearch.length >= 1
    ? PLACES.filter((p) => { const q = placeSearch.toLowerCase(); return p.name.toLowerCase().includes(q) || p.nameMr.includes(placeSearch) || (p.district?.toLowerCase().includes(q) ?? false); }).slice(0, 20)
    : [];

  const handlePlace = (p: Place) => {
    setSelectedPlace(p);
    setPlaceSearch("");
    setShowDrop(false);
    setForm((f) => ({ ...f, city: p.name, latitude: String(p.lat), longitude: String(p.lng) }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    let hour = parseInt(form.hour);
    if (form.ampm === "PM" && hour !== 12) hour += 12;
    if (form.ampm === "AM" && hour === 12) hour = 0;
    const params = new URLSearchParams({
      name: form.name, year: form.year, month: form.month, day: form.day,
      hour: String(hour), minute: form.minute, lat: form.latitude, lng: form.longitude, tz: "5.5", place: form.city,
      admin: "1",
    });
    window.open(`/kundli/result?${params.toString()}`, "_blank");
  };

  const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#d4a843] focus:border-[#d4a843] outline-none";

  return (
    <form onSubmit={handleGenerate} className="bg-[#FFF8E7]/50 rounded-lg border border-[#d4a843]/20 p-5 mb-4">
      <h3 className="text-sm font-bold text-[#3d0c0c] mb-3">Generate Kundli (Admin — Unlimited)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inp} placeholder="Name" required />
        <div ref={dropRef} className="relative">
          {selectedPlace && !showDrop ? (
            <div onClick={() => setShowDrop(true)} className={`${inp} cursor-pointer flex items-center justify-between`}>
              <span className="truncate">{selectedPlace.name}{selectedPlace.district ? ` — ${selectedPlace.district}` : ""}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#5c1a1a] shrink-0 ml-1">{selectedPlace.type}</span>
            </div>
          ) : (
            <input value={placeSearch} onChange={(e) => { setPlaceSearch(e.target.value); setShowDrop(true); }} onFocus={() => setShowDrop(true)} className={inp} placeholder="Birth Place" />
          )}
          {showDrop && filtered.length > 0 && (
            <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
              {filtered.map((p) => (
                <button key={`${p.name}-${p.lat}`} type="button" onClick={() => handlePlace(p)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#FFF8E7] border-b border-gray-50 last:border-0">
                  {p.name}{p.district ? <span className="text-gray-400 text-xs ml-1">— {p.district}</span> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
        <input type="number" min="1" max="31" value={form.day} onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))} className={inp} placeholder="Day" required />
        <select value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))} className={inp} required>
          <option value="">Month</option>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <input type="number" min="1900" max="2030" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className={inp} placeholder="Year" required />
        <input type="number" min="1" max="12" value={form.hour} onChange={(e) => setForm((f) => ({ ...f, hour: e.target.value }))} className={inp} placeholder="Hour" required />
        <input type="number" min="0" max="59" value={form.minute} onChange={(e) => setForm((f) => ({ ...f, minute: e.target.value }))} className={inp} placeholder="Min" required />
        <select value={form.ampm} onChange={(e) => setForm((f) => ({ ...f, ampm: e.target.value }))} className={inp}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="px-5 py-2 rounded-lg bg-[#3d0c0c] text-[#d4a843] text-sm font-medium hover:bg-[#5c1a1a] transition">
          Generate Kundli
        </button>
        <span className="text-[10px] text-[#5c1a1a]/40">Opens result in new tab — no login or limit checks</span>
      </div>
    </form>
  );
}

export default function AdminPageClient() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [kundlisList, setKundlisList] = useState<KundliRecord[]>([]);
  const [selectedKundlis, setSelectedKundlis] = useState<Set<string>>(new Set());
  const [deletingKundlis, setDeletingKundlis] = useState(false);
  const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [travelPkgs, setTravelPkgs] = useState<TravelPkg[]>([]);
  const [travelEnqs, setTravelEnqs] = useState<TravelEnq[]>([]);
  const [showTravelForm, setShowTravelForm] = useState(false);
  const [editingPkg, setEditingPkg] = useState<TravelPkg | null>(null);
  const [travelView, setTravelView] = useState<"packages" | "enquiries">("packages");
  const [travelForm, setTravelForm] = useState({ id: "", titleMr: "", titleEn: "", descriptionMr: "", descriptionEn: "", category: "jyotirlinga", duration: "", priceFrom: "", priceTo: "", inclusions: "", itineraryMr: "", itineraryEn: "", highlights: "", imageUrl: "", locationMr: "", locationEn: "", active: true, featured: false });
  const [generatingImage, setGeneratingImage] = useState(false);

  // Blog editor
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogForm, setBlogForm] = useState({ slug: "", title: "", titleEn: "", summary: "", summaryEn: "", date: "", category: "", categoryEn: "", content: "", contentEn: "" });

  // Settings
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (data.authorized) {
          setAuthorized(true);
          const statsRes = await fetch("/api/admin/stats");
          setStats(await statsRes.json());
        }
      } catch { /* not admin */ }
      setLoading(false);
    }
    init();
  }, []);

  const loadUsers = useCallback(async () => { const r = await fetch("/api/admin/users"); const d = await r.json(); setUsersList(d.users || []); }, []);
  const loadBlog = useCallback(async () => { const r = await fetch("/api/admin/blog"); const d = await r.json(); setBlogPosts(d.posts || []); }, []);
  const loadKundlis = useCallback(async () => { const r = await fetch("/api/admin/kundlis"); const d = await r.json(); setKundlisList(d.kundlis || []); setSelectedKundlis(new Set()); }, []);
  const deleteSelectedKundlis = async () => {
    if (selectedKundlis.size === 0) return;
    if (!confirm(`Delete ${selectedKundlis.size} kundli(s)? This cannot be undone.`)) return;
    setDeletingKundlis(true);
    try {
      const res = await fetch("/api/admin/kundlis", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: Array.from(selectedKundlis) }) });
      const data = await res.json();
      if (data.success) { showToast(`Deleted ${data.deleted} kundli(s)`); loadKundlis(); }
      else showToast(data.error || "Delete failed");
    } catch { showToast("Delete failed"); }
    setDeletingKundlis(false);
  };
  const toggleKundli = (id: string) => setSelectedKundlis((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const toggleAllKundlis = () => setSelectedKundlis((prev) => prev.size === kundlisList.length ? new Set() : new Set(kundlisList.map((k) => k.id)));
  const loadPayments = useCallback(async () => { const r = await fetch("/api/admin/payments"); const d = await r.json(); setPaymentsList(d.payments || []); }, []);
  const loadEnquiries = useCallback(async () => { const r = await fetch("/api/admin/enquiries"); const d = await r.json(); setEnquiries(d.enquiries || []); }, []);
  const loadSettings = useCallback(async () => { const r = await fetch("/api/admin/settings"); const d = await r.json(); setSettings(d.settings || {}); }, []);
  const loadTravel = useCallback(async () => { const r = await fetch("/api/admin/travel"); const d = await r.json(); setTravelPkgs(d.packages || []); }, []);
  const loadTravelEnqs = useCallback(async () => { const r = await fetch("/api/admin/travel-enquiries"); const d = await r.json(); setTravelEnqs(d.enquiries || []); }, []);

  useEffect(() => {
    if (!authorized) return;
    if (activeTab === "users") loadUsers();
    if (activeTab === "blog") loadBlog();
    if (activeTab === "kundlis") loadKundlis();
    if (activeTab === "payments") loadPayments();
    if (activeTab === "enquiries") loadEnquiries();
    if (activeTab === "travel") { loadTravel(); loadTravelEnqs(); }
    if (activeTab === "settings") loadSettings();
  }, [activeTab, authorized, loadUsers, loadBlog, loadKundlis, loadPayments, loadEnquiries, loadTravel, loadTravelEnqs, loadSettings]);

  // ── Actions ──────────────────────────────────────────────────────
  async function updateUser(id: string, field: string, value: string) {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
    showToast("User updated");
    loadUsers();
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Delete user "${name}" and all their data?`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    showToast("User deleted");
    loadUsers();
  }

  function openNewPost() {
    setEditingPost(null);
    setBlogForm({ slug: "", title: "", titleEn: "", summary: "", summaryEn: "", date: new Date().toISOString().slice(0, 10), category: "", categoryEn: "", content: "", contentEn: "" });
    setShowBlogForm(true);
  }

  async function openEditPost(slug: string) {
    const res = await fetch(`/api/blog?slug=${slug}`);
    const post = await res.json();
    setEditingPost(post);
    setBlogForm({ slug: post.slug, title: post.title || "", titleEn: post.titleEn || "", summary: post.summary || "", summaryEn: post.summaryEn || "", date: post.date || "", category: post.category || "", categoryEn: post.categoryEn || "", content: post.content || "", contentEn: post.contentEn || "" });
    setShowBlogForm(true);
  }

  async function saveBlogPost() {
    const method = editingPost ? "PUT" : "POST";
    const res = await fetch("/api/admin/blog", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogForm) });
    const data = await res.json();
    if (data.success) { showToast(editingPost ? "Post updated" : "Post created"); setShowBlogForm(false); loadBlog(); }
    else showToast(data.error || "Error");
  }

  async function deleteBlogPost(slug: string, title: string) {
    if (!confirm(`Delete post "${title}"?`)) return;
    await fetch("/api/admin/blog", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    showToast("Post deleted");
    loadBlog();
  }

  async function updateEnquiryStatus(id: string, status: string) {
    await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    loadEnquiries();
  }

  async function deleteEnquiry(id: string) {
    await fetch("/api/admin/enquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadEnquiries();
  }

  async function saveSettings() {
    setSettingsSaving(true);
    await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings }) });
    setSettingsSaving(false);
    showToast("Settings saved");
  }

  function setSetting(key: string, value: string) { setSettings((prev) => ({ ...prev, [key]: value })); }

  // ── Travel actions ──────────────────────────────────────────────
  const travelCategories = [
    { value: "jyotirlinga", label: "Jyotirlinga Yatra" },
    { value: "char_dham", label: "Char Dham Yatra" },
    { value: "ashtavinayak", label: "Ashtavinayak Tour" },
    { value: "shakti_peeth", label: "Shakti Peeth Tour" },
    { value: "datta", label: "Datta Yatra" },
    { value: "panch_kedar", label: "Panch Kedar Yatra" },
    { value: "varanasi", label: "Varanasi-Prayagraj Yatra" },
    { value: "rameshwaram", label: "Rameshwaram-Madurai Tour" },
    { value: "dwarka", label: "Dwarka-Somnath Yatra" },
    { value: "shirdi", label: "Shirdi-Shani Shingnapur Tour" },
    { value: "tirupati", label: "Tirupati Darshan" },
    { value: "pandharpur", label: "Pandharpur Wari" },
    { value: "local", label: "Local Tours" },
    { value: "custom", label: "Custom Pilgrimage" },
  ];

  function openNewTravel() {
    setEditingPkg(null);
    setTravelForm({ id: "", titleMr: "", titleEn: "", descriptionMr: "", descriptionEn: "", category: "jyotirlinga", duration: "", priceFrom: "", priceTo: "", inclusions: "", itineraryMr: "", itineraryEn: "", highlights: "", imageUrl: "", locationMr: "", locationEn: "", active: true, featured: false });
    setShowTravelForm(true);
  }

  function openEditTravel(pkg: TravelPkg) {
    setEditingPkg(pkg);
    setTravelForm({
      id: pkg.id, titleMr: pkg.titleMr, titleEn: pkg.titleEn,
      descriptionMr: pkg.descriptionMr || "", descriptionEn: pkg.descriptionEn || "",
      category: pkg.category, duration: pkg.duration || "",
      priceFrom: pkg.priceFrom?.toString() || "", priceTo: pkg.priceTo?.toString() || "",
      inclusions: pkg.inclusions || "", itineraryMr: pkg.itineraryMr || "",
      itineraryEn: pkg.itineraryEn || "", highlights: pkg.highlights || "",
      imageUrl: pkg.imageUrl || "", locationMr: pkg.locationMr || "",
      locationEn: pkg.locationEn || "", active: pkg.active, featured: pkg.featured,
    });
    setShowTravelForm(true);
  }

  async function saveTravelPkg() {
    const method = editingPkg ? "PUT" : "POST";
    const res = await fetch("/api/admin/travel", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(travelForm) });
    const data = await res.json();
    if (data.success || data.id) { showToast(editingPkg ? "Package updated" : "Package created"); setShowTravelForm(false); loadTravel(); }
    else showToast(data.error || "Error");
  }

  async function deleteTravelPkg(id: string, title: string) {
    if (!confirm(`Delete package "${title}"?`)) return;
    await fetch("/api/admin/travel", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    showToast("Package deleted");
    loadTravel();
  }

  async function toggleTravelActive(pkg: TravelPkg) {
    await fetch("/api/admin/travel", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...pkg, active: !pkg.active }) });
    loadTravel();
  }

  async function updateTravelEnqStatus(id: string, status: string) {
    await fetch("/api/admin/travel-enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    loadTravelEnqs();
  }

  async function deleteTravelEnq(id: string) {
    await fetch("/api/admin/travel-enquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadTravelEnqs();
  }

  async function generateTravelImage() {
    if (!travelForm.titleEn) { showToast("Enter English title first"); return; }
    setGeneratingImage(true);
    showToast("Generating image...");
    try {
      const res = await fetch("/api/admin/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `${travelForm.titleEn}, Indian temple pilgrimage, sacred holy place, spiritual travel destination` }) });
      const data = await res.json();
      if (data.imageUrl) { setTravelForm((f) => ({ ...f, imageUrl: data.imageUrl })); showToast("Image generated"); }
      else showToast(data.error || "Failed");
    } catch { showToast("Image generation failed"); }
    setGeneratingImage(false);
  }

  // ── Loading / Auth ───────────────────────────────────────────────
  if (loading) return <div className="bg-[#FAFAF8] min-h-screen flex items-center justify-center"><p className="text-[#5c1a1a]/60">Loading...</p></div>;

  if (!authorized) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#5c1a1a]/70 mt-4 text-lg">Admin access required.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-[#d4a843] hover:text-[#3d0c0c]">Back to Home</Link>
        </div>
      </div>
    );
  }

  const unreadCount = enquiries.filter((e) => e.status === "unread").length;

  const navItems: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "blog", label: "Blog Posts" },
    { key: "temples", label: "Temple Content" },
    { key: "travel", label: "Travel Packages" },
    { key: "kundlis", label: "Kundli Reports" },
    { key: "payments", label: "Payments" },
    { key: "enquiries", label: "Enquiries" },
    { key: "settings", label: "Settings" },
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
        className="fixed top-[70px] left-3 z-[55] md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#3d0c0c] text-white/80 shadow-md">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Left Sidebar ── */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-auto h-screen w-56 flex-shrink-0 bg-[#3d0c0c] text-white/80 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-sm font-bold text-[#d4a843] tracking-wider uppercase">Admin</p>
          <p className="text-[10px] text-white/30 mt-0.5">Bhaagyavedh</p>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full text-left px-5 py-2.5 text-[13px] font-medium transition-colors flex items-center justify-between ${
                activeTab === item.key
                  ? "bg-white/10 text-[#d4a843] border-r-2 border-[#d4a843]"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              {item.label}
              {item.key === "enquiries" && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full leading-none">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition">Back to Site</Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 py-6 px-4 sm:px-8">
        {/* Page header */}
        <div className="mb-6 md:ml-0 ml-10">
          <h1 className="text-xl font-bold text-[#3d0c0c]">
            {navItems.find((n) => n.key === activeTab)?.label}
          </h1>
        </div>

        {/* ════════ DASHBOARD ════════ */}
        {activeTab === "dashboard" && stats && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers },
                { label: "Premium Users", value: stats.premiumUsers },
                { label: "Kundlis Generated", value: stats.totalKundlis },
                { label: "Revenue", value: `₹${(stats.revenue / 100).toLocaleString()}` },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5">
                  <p className="text-xs text-[#5c1a1a]/50 uppercase tracking-wide">{card.label}</p>
                  <p className="text-2xl font-bold text-[#3d0c0c] mt-1">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "New Blog Post", tab: "blog" as Tab },
                { label: "View Enquiries", tab: "enquiries" as Tab },
                { label: "Manage Users", tab: "users" as Tab },
              ].map((q) => (
                <button key={q.label} onClick={() => setActiveTab(q.tab)} className="bg-white rounded-lg border border-gray-200 p-4 text-left hover:border-[#d4a843]/40 transition">
                  <p className="text-sm font-medium text-[#3d0c0c]">{q.label}</p>
                  <p className="text-xs text-[#5c1a1a]/40 mt-1">Go to {q.label.toLowerCase()}</p>
                </button>
              ))}
            </div>

            {/* Blog Generator */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-3">Generate Article</h3>
              <BlogGenerator onGenerated={() => loadBlog()} onToast={showToast} />
            </div>
          </div>
        )}

        {/* ════════ USERS ════════ */}
        {activeTab === "users" && !selectedUser && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium text-[#3d0c0c]">{usersList.length} users</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-[#5c1a1a]/50 tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Joined</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-[#3d0c0c] font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-[#5c1a1a]/60 text-xs">{u.email}</td>
                      <td className="px-5 py-3">
                        <select value={u.plan} onChange={(e) => updateUser(u.id, "plan", e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-gray-200 bg-white cursor-pointer">
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <select value={u.role} onChange={(e) => updateUser(u.id, "role", e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-gray-200 bg-white cursor-pointer">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#5c1a1a]/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 flex items-center gap-3">
                        <button onClick={() => setSelectedUser(u)} className="text-xs text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">View</button>
                        <button onClick={() => deleteUser(u.id, u.name)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-[#5c1a1a]/40 text-sm">No users yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════ USER DETAIL ════════ */}
        {activeTab === "users" && selectedUser && (
          <div className="space-y-4">
            <button onClick={() => setSelectedUser(null)} className="text-sm text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">&larr; Back to Users</button>

            {/* User header */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                {selectedUser.image ? (
                  <img src={selectedUser.image} alt="" className="w-14 h-14 rounded-full border-2 border-[#d4a843]/40" />
                ) : (
                  <span className="w-14 h-14 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#d4a843] text-2xl font-bold">
                    {selectedUser.name[0].toUpperCase()}
                  </span>
                )}
                <div>
                  <h2 className="text-lg font-bold text-[#d4a843]">{selectedUser.name}</h2>
                  <p className="text-white/50 text-sm">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Account Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-4">Account Information</h3>
                <dl className="space-y-3">
                  {([
                    ["User ID", selectedUser.id],
                    ["Email", selectedUser.email],
                    ["Phone", selectedUser.phone || "—"],
                    ["Role", selectedUser.role],
                    ["Plan", selectedUser.plan],
                    ["Plan Expires", selectedUser.planExpiresAt ? new Date(selectedUser.planExpiresAt).toLocaleDateString() : "—"],
                    ["Provider", selectedUser.provider || "—"],
                    ["Language", selectedUser.language === "mr" ? "Marathi" : "English"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-start justify-between">
                      <dt className="text-xs text-[#5c1a1a]/50">{label}</dt>
                      <dd className="text-sm text-[#3d0c0c] font-medium text-right max-w-[60%] break-all">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Birth / Personal Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-4">Personal Details</h3>
                <dl className="space-y-3">
                  {([
                    ["Name", selectedUser.name],
                    ["Date of Birth", selectedUser.dateOfBirth || "—"],
                    ["Birth Time", selectedUser.birthTime || "—"],
                    ["Birth Place", selectedUser.birthPlace || "—"],
                    ["Joined", new Date(selectedUser.createdAt).toLocaleString()],
                    ["Last Updated", selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleString() : "—"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-start justify-between">
                      <dt className="text-xs text-[#5c1a1a]/50">{label}</dt>
                      <dd className="text-sm text-[#3d0c0c] font-medium text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-xs font-bold text-[#3d0c0c] uppercase tracking-wide mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5c1a1a]/50">Plan:</span>
                  <select value={selectedUser.plan}
                    onChange={(e) => { updateUser(selectedUser.id, "plan", e.target.value); setSelectedUser({ ...selectedUser, plan: e.target.value }); }}
                    className="text-xs px-2 py-1.5 rounded border border-gray-200 bg-white cursor-pointer">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5c1a1a]/50">Role:</span>
                  <select value={selectedUser.role}
                    onChange={(e) => { updateUser(selectedUser.id, "role", e.target.value); setSelectedUser({ ...selectedUser, role: e.target.value }); }}
                    className="text-xs px-2 py-1.5 rounded border border-gray-200 bg-white cursor-pointer">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button onClick={() => { deleteUser(selectedUser.id, selectedUser.name); setSelectedUser(null); }}
                  className="text-xs px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 font-medium transition">
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════ BLOG ════════ */}
        {activeTab === "blog" && (
          <div className="space-y-4">
            {showBlogForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-[#3d0c0c]">{editingPost ? "Edit Post" : "New Post"}</h2>
                  <button onClick={() => setShowBlogForm(false)} className="text-[#5c1a1a]/40 hover:text-[#3d0c0c] text-lg leading-none">&times;</button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Slug (URL ID)</label>
                      <input value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} disabled={!!editingPost}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm disabled:bg-gray-50" placeholder="my-blog-post" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Date</label>
                      <input type="date" value={blogForm.date} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Title (Marathi)</label>
                      <input value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Title (English)</label>
                      <input value={blogForm.titleEn} onChange={(e) => setBlogForm({ ...blogForm, titleEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Category (Marathi)</label>
                      <input value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Category (English)</label>
                      <input value={blogForm.categoryEn} onChange={(e) => setBlogForm({ ...blogForm, categoryEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Summary (Marathi)</label>
                      <textarea rows={2} value={blogForm.summary} onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Summary (English)</label>
                      <textarea rows={2} value={blogForm.summaryEn} onChange={(e) => setBlogForm({ ...blogForm, summaryEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Content (Marathi)</label>
                    <textarea rows={6} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-200 text-sm font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Content (English)</label>
                    <textarea rows={6} value={blogForm.contentEn} onChange={(e) => setBlogForm({ ...blogForm, contentEn: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-200 text-sm font-mono" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveBlogPost} className="px-5 py-2 rounded bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm">
                      {editingPost ? "Update Post" : "Create Post"}
                    </button>
                    <button onClick={() => setShowBlogForm(false)} className="px-4 py-2 rounded border border-gray-200 text-sm text-[#5c1a1a]/60 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-medium text-[#3d0c0c]">{blogPosts.filter((p) => p.categoryEn !== "Temple Guide").length} posts</p>
                <button onClick={openNewPost} className="px-4 py-1.5 rounded bg-[#3d0c0c] text-[#d4a843] text-xs font-medium hover:bg-[#5c1a1a] transition">+ New Post</button>
              </div>
              <div className="divide-y divide-gray-100">
                {blogPosts.filter((p) => p.categoryEn !== "Temple Guide").map((p) => (
                  <div key={p.slug} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#3d0c0c] text-sm truncate">{p.title}</p>
                      <p className="text-xs text-[#5c1a1a]/40 mt-0.5">{p.categoryEn || "—"} &middot; {p.date}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <button onClick={() => openEditPost(p.slug)} className="text-xs text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">Edit</button>
                      <button onClick={() => deleteBlogPost(p.slug, p.title)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                      <Link href={`/blog/${p.slug}`} target="_blank" className="text-xs text-[#5c1a1a]/40 hover:text-[#5c1a1a]">View</Link>
                    </div>
                  </div>
                ))}
                {blogPosts.filter((p) => p.categoryEn !== "Temple Guide").length === 0 && <p className="text-center py-10 text-[#5c1a1a]/40 text-sm">No blog posts yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ════════ TEMPLES ════════ */}
        {activeTab === "temples" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-medium text-[#3d0c0c]">{blogPosts.filter((p) => p.categoryEn === "Temple Guide").length} temple guides</p>
            </div>
            <div className="divide-y divide-gray-100">
              {blogPosts.filter((p) => p.categoryEn === "Temple Guide").map((p) => (
                <div key={p.slug} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3d0c0c] text-sm truncate">{p.title}</p>
                    <p className="text-xs text-[#5c1a1a]/40 mt-0.5">{p.date}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <button onClick={() => openEditPost(p.slug)} className="text-xs text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">Edit</button>
                    <button onClick={() => deleteBlogPost(p.slug, p.title)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    <Link href={`/temples`} target="_blank" className="text-xs text-[#5c1a1a]/40 hover:text-[#5c1a1a]">View</Link>
                  </div>
                </div>
              ))}
              {blogPosts.filter((p) => p.categoryEn === "Temple Guide").length === 0 && <p className="text-center py-10 text-[#5c1a1a]/40 text-sm">No temple content yet</p>}
            </div>
          </div>
        )}

        {/* ════════ TRAVEL ════════ */}
        {activeTab === "travel" && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              <button onClick={() => setTravelView("packages")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition ${travelView === "packages" ? "bg-[#3d0c0c] text-[#d4a843]" : "bg-white border border-gray-200 text-[#5c1a1a]/60 hover:bg-gray-50"}`}>
                Packages ({travelPkgs.length})
              </button>
              <button onClick={() => setTravelView("enquiries")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition ${travelView === "enquiries" ? "bg-[#3d0c0c] text-[#d4a843]" : "bg-white border border-gray-200 text-[#5c1a1a]/60 hover:bg-gray-50"}`}>
                Enquiries ({travelEnqs.length})
              </button>
            </div>

            {/* Travel Form */}
            {travelView === "packages" && showTravelForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-[#3d0c0c]">{editingPkg ? "Edit Package" : "New Package"}</h2>
                  <button onClick={() => setShowTravelForm(false)} className="text-[#5c1a1a]/40 hover:text-[#3d0c0c] text-lg leading-none">&times;</button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Title (Marathi)</label>
                      <input value={travelForm.titleMr} onChange={(e) => setTravelForm({ ...travelForm, titleMr: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Title (English)</label>
                      <input value={travelForm.titleEn} onChange={(e) => setTravelForm({ ...travelForm, titleEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Category</label>
                      <select value={travelForm.category} onChange={(e) => setTravelForm({ ...travelForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm">
                        {travelCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Duration</label>
                      <input value={travelForm.duration} onChange={(e) => setTravelForm({ ...travelForm, duration: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="3 Days / 2 Nights" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Price From</label>
                        <input type="number" value={travelForm.priceFrom} onChange={(e) => setTravelForm({ ...travelForm, priceFrom: e.target.value })}
                          className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="5999" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Price To</label>
                        <input type="number" value={travelForm.priceTo} onChange={(e) => setTravelForm({ ...travelForm, priceTo: e.target.value })}
                          className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="12999" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Location (Marathi)</label>
                      <input value={travelForm.locationMr} onChange={(e) => setTravelForm({ ...travelForm, locationMr: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Location (English)</label>
                      <input value={travelForm.locationEn} onChange={(e) => setTravelForm({ ...travelForm, locationEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Description (Marathi)</label>
                      <textarea rows={3} value={travelForm.descriptionMr} onChange={(e) => setTravelForm({ ...travelForm, descriptionMr: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Description (English)</label>
                      <textarea rows={3} value={travelForm.descriptionEn} onChange={(e) => setTravelForm({ ...travelForm, descriptionEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Itinerary (Marathi)</label>
                      <textarea rows={4} value={travelForm.itineraryMr} onChange={(e) => setTravelForm({ ...travelForm, itineraryMr: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm font-mono" placeholder="Day 1: ..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Itinerary (English)</label>
                      <textarea rows={4} value={travelForm.itineraryEn} onChange={(e) => setTravelForm({ ...travelForm, itineraryEn: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm font-mono" placeholder="Day 1: ..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Highlights (comma-separated)</label>
                      <input value={travelForm.highlights} onChange={(e) => setTravelForm({ ...travelForm, highlights: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="AC Bus, Meals, Guide" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Inclusions (comma-separated)</label>
                      <input value={travelForm.inclusions} onChange={(e) => setTravelForm({ ...travelForm, inclusions: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="Transport, Hotel, Breakfast" />
                    </div>
                  </div>
                  {/* Image */}
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Package Image</label>
                    <div className="flex gap-2 items-end">
                      <input value={travelForm.imageUrl} onChange={(e) => setTravelForm({ ...travelForm, imageUrl: e.target.value })}
                        className="flex-1 px-3 py-2 rounded border border-gray-200 text-sm" placeholder="Image URL or generate with AI" />
                      <button onClick={generateTravelImage} disabled={generatingImage}
                        className="px-4 py-2 rounded bg-[#3d0c0c] text-[#d4a843] text-xs font-medium hover:bg-[#5c1a1a] transition disabled:opacity-50 whitespace-nowrap">
                        {generatingImage ? "Generating..." : "AI Generate"}
                      </button>
                    </div>
                    {travelForm.imageUrl && (
                      <img src={travelForm.imageUrl} alt="Preview" className="mt-2 w-full max-w-md rounded border border-gray-200 object-cover h-40" />
                    )}
                  </div>
                  {/* Toggles */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-[#5c1a1a]/60">
                      <input type="checkbox" checked={travelForm.active} onChange={(e) => setTravelForm({ ...travelForm, active: e.target.checked })} />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-sm text-[#5c1a1a]/60">
                      <input type="checkbox" checked={travelForm.featured} onChange={(e) => setTravelForm({ ...travelForm, featured: e.target.checked })} />
                      Featured
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={saveTravelPkg} className="px-5 py-2 rounded bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition text-sm">
                      {editingPkg ? "Update Package" : "Create Package"}
                    </button>
                    <button onClick={() => setShowTravelForm(false)} className="px-4 py-2 rounded border border-gray-200 text-sm text-[#5c1a1a]/60 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {/* Packages list */}
            {travelView === "packages" && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-[#3d0c0c]">{travelPkgs.length} packages</p>
                  <button onClick={openNewTravel} className="px-4 py-1.5 rounded bg-[#3d0c0c] text-[#d4a843] text-xs font-medium hover:bg-[#5c1a1a] transition">+ New Package</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {travelPkgs.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {pkg.imageUrl && <img src={pkg.imageUrl} alt="" className="w-12 h-12 rounded object-cover shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-[#3d0c0c] text-sm truncate">{pkg.titleEn}</p>
                          <p className="text-xs text-[#5c1a1a]/40 mt-0.5">
                            {travelCategories.find((c) => c.value === pkg.category)?.label || pkg.category}
                            {pkg.duration ? ` · ${pkg.duration}` : ""}
                            {pkg.priceFrom ? ` · From ₹${pkg.priceFrom.toLocaleString()}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button onClick={() => toggleTravelActive(pkg)} className={`text-[11px] font-medium ${pkg.active ? "text-green-600" : "text-gray-400"}`}>
                          {pkg.active ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => openEditTravel(pkg)} className="text-xs text-[#3d0c0c]/60 hover:text-[#3d0c0c] font-medium">Edit</button>
                        <button onClick={() => deleteTravelPkg(pkg.id, pkg.titleEn)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </div>
                    </div>
                  ))}
                  {travelPkgs.length === 0 && <p className="text-center py-10 text-[#5c1a1a]/40 text-sm">No travel packages yet</p>}
                </div>
              </div>
            )}

            {/* Travel Enquiries */}
            {travelView === "enquiries" && (
              <div className="space-y-3">
                {travelEnqs.map((e) => (
                  <div key={e.id} className={`bg-white rounded-lg border p-5 ${e.status === "new" ? "border-[#d4a843]/40" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-[#3d0c0c] text-sm">{e.name}</p>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            e.status === "new" ? "bg-red-50 text-red-600" :
                            e.status === "contacted" ? "bg-blue-50 text-blue-600" :
                            e.status === "confirmed" ? "bg-green-50 text-green-600" :
                            "bg-gray-50 text-gray-600"
                          }`}>{e.status}</span>
                        </div>
                        <p className="text-xs text-[#5c1a1a]/50">{e.email} · {e.phone}</p>
                        {e.packageTitle && <p className="text-xs font-medium text-[#d4a843] mt-1">{e.packageTitle}</p>}
                        <div className="flex gap-4 mt-1 text-xs text-[#5c1a1a]/50">
                          {e.travelDate && <span>Travel: {e.travelDate}</span>}
                          {e.travelers && <span>Travelers: {e.travelers}</span>}
                        </div>
                        {e.message && <p className="text-sm text-[#5c1a1a]/70 mt-2">{e.message}</p>}
                        <p className="text-[10px] text-[#5c1a1a]/30 mt-2">{new Date(e.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 ml-4">
                        {e.status === "new" && <button onClick={() => updateTravelEnqStatus(e.id, "contacted")} className="text-[11px] text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Mark Contacted</button>}
                        {e.status !== "confirmed" && <button onClick={() => updateTravelEnqStatus(e.id, "confirmed")} className="text-[11px] text-green-600 hover:text-green-800 font-medium whitespace-nowrap">Confirmed</button>}
                        {e.status !== "cancelled" && <button onClick={() => updateTravelEnqStatus(e.id, "cancelled")} className="text-[11px] text-orange-600 hover:text-orange-800 font-medium whitespace-nowrap">Cancel</button>}
                        <button onClick={() => deleteTravelEnq(e.id)} className="text-[11px] text-red-400 hover:text-red-600 font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {travelEnqs.length === 0 && <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-[#5c1a1a]/40 text-sm">No travel enquiries yet</div>}
              </div>
            )}
          </div>
        )}

        {/* ════════ KUNDLIS ════════ */}
        {activeTab === "kundlis" && (
          <>
          <AdminKundliGenerator />
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium text-[#3d0c0c]">{kundlisList.length} kundlis generated{selectedKundlis.size > 0 && <span className="text-[#d4a843] ml-2">({selectedKundlis.size} selected)</span>}</p>
              {selectedKundlis.size > 0 && (
                <button onClick={deleteSelectedKundlis} disabled={deletingKundlis}
                  className="px-4 py-1.5 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition disabled:opacity-50">
                  {deletingKundlis ? "Deleting..." : `Delete ${selectedKundlis.size} Selected`}
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-[#5c1a1a]/50 tracking-wide">
                  <tr>
                    <th className="px-5 py-3 w-10">
                      <input type="checkbox" checked={kundlisList.length > 0 && selectedKundlis.size === kundlisList.length} onChange={toggleAllKundlis}
                        className="rounded border-gray-300 text-[#d4a843] focus:ring-[#d4a843]" />
                    </th>
                    <th className="text-left px-5 py-3">Kundli Name</th>
                    <th className="text-left px-5 py-3">Created By</th>
                    <th className="text-left px-5 py-3">DOB</th>
                    <th className="text-left px-5 py-3">Time</th>
                    <th className="text-left px-5 py-3">Place</th>
                    <th className="text-left px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {kundlisList.map((k) => (
                    <tr key={k.id} className={`border-t border-gray-100 hover:bg-gray-50/50 ${selectedKundlis.has(k.id) ? "bg-red-50/50" : ""}`}>
                      <td className="px-5 py-3">
                        <input type="checkbox" checked={selectedKundlis.has(k.id)} onChange={() => toggleKundli(k.id)}
                          className="rounded border-gray-300 text-[#d4a843] focus:ring-[#d4a843]" />
                      </td>
                      <td className="px-5 py-3 text-[#3d0c0c] font-medium">{k.name}</td>
                      <td className="px-5 py-3 text-[#5c1a1a]/60 text-xs">{k.userName}</td>
                      <td className="px-5 py-3 text-xs">{k.dateOfBirth}</td>
                      <td className="px-5 py-3 text-xs">{k.birthTime}</td>
                      <td className="px-5 py-3 text-xs">{k.birthPlace}</td>
                      <td className="px-5 py-3 text-xs text-[#5c1a1a]/40">{new Date(k.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {kundlisList.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-[#5c1a1a]/40 text-sm">No kundlis generated yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}

        {/* ════════ PAYMENTS ════════ */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-[#3d0c0c]">{paymentsList.length} transactions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-[#5c1a1a]/50 tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">User</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Amount</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Payment ID</th>
                    <th className="text-left px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <p className="text-[#3d0c0c] font-medium text-xs">{p.userName}</p>
                        <p className="text-[10px] text-[#5c1a1a]/40">{p.userEmail}</p>
                      </td>
                      <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-[#3d0c0c]">{p.plan}</span></td>
                      <td className="px-5 py-3 font-medium text-[#3d0c0c]">₹{(p.amount / 100).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === "paid" ? "bg-green-50 text-green-700" : p.status === "failed" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#5c1a1a]/40 font-mono">{p.razorpayPaymentId || "—"}</td>
                      <td className="px-5 py-3 text-xs text-[#5c1a1a]/40">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {paymentsList.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-[#5c1a1a]/40 text-sm">No payments yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════ ENQUIRIES ════════ */}
        {activeTab === "enquiries" && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3 flex items-center justify-between">
              <p className="text-sm font-medium text-[#3d0c0c]">{enquiries.length} enquiries</p>
              {unreadCount > 0 && <span className="text-xs text-red-600 font-medium">{unreadCount} unread</span>}
            </div>
            {enquiries.map((e) => (
              <div key={e.id} className={`bg-white rounded-lg border p-5 ${e.status === "unread" ? "border-[#d4a843]/40" : "border-gray-200"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[#3d0c0c] text-sm">{e.name}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${e.status === "unread" ? "bg-red-50 text-red-600" : e.status === "read" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                        {e.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c1a1a]/50">{e.email}{e.phone ? ` · ${e.phone}` : ""}</p>
                    {e.subject && <p className="text-xs font-medium text-[#3d0c0c] mt-2">{e.subject}</p>}
                    <p className="text-sm text-[#5c1a1a]/70 mt-2 leading-relaxed">{e.message}</p>
                    <p className="text-[10px] text-[#5c1a1a]/30 mt-3">{new Date(e.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 ml-4">
                    {e.status === "unread" && <button onClick={() => updateEnquiryStatus(e.id, "read")} className="text-[11px] text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Mark Read</button>}
                    {e.status !== "replied" && <button onClick={() => updateEnquiryStatus(e.id, "replied")} className="text-[11px] text-green-600 hover:text-green-800 font-medium whitespace-nowrap">Mark Replied</button>}
                    <button onClick={() => deleteEnquiry(e.id)} className="text-[11px] text-red-400 hover:text-red-600 font-medium">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {enquiries.length === 0 && <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-[#5c1a1a]/40 text-sm">No enquiries yet</div>}
          </div>
        )}

        {/* ════════ SETTINGS ════════ */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            {/* Banner */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-[#3d0c0c] mb-4 uppercase tracking-wide">Site Banner</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-[#5c1a1a]/60 w-24">Active</label>
                  <select value={settings.banner_active || "false"} onChange={(e) => setSetting("banner_active", e.target.value)}
                    className="px-3 py-1.5 rounded border border-gray-200 text-sm">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Text (Marathi)</label>
                  <input value={settings.banner_text_mr || ""} onChange={(e) => setSetting("banner_text_mr", e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Text (English)</label>
                  <input value={settings.banner_text_en || ""} onChange={(e) => setSetting("banner_text_en", e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Link (optional)</label>
                    <input value={settings.banner_link || ""} onChange={(e) => setSetting("banner_link", e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-200 text-sm" placeholder="/kundli" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">Color</label>
                    <select value={settings.banner_color || "gold"} onChange={(e) => setSetting("banner_color", e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-gray-200 text-sm">
                      <option value="gold">Gold</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-[#3d0c0c] mb-4 uppercase tracking-wide">SEO</h2>
              <div className="space-y-3">
                {[
                  { key: "seo_home_title", label: "Home — Title" },
                  { key: "seo_home_desc", label: "Home — Description" },
                  { key: "seo_kundli_title", label: "Kundli — Title" },
                  { key: "seo_kundli_desc", label: "Kundli — Description" },
                  { key: "seo_matching_title", label: "Matching — Title" },
                  { key: "seo_matching_desc", label: "Matching — Description" },
                ].map((s) => (
                  <div key={s.key}>
                    <label className="block text-xs font-medium text-[#5c1a1a]/60 mb-1">{s.label}</label>
                    <input value={settings[s.key] || ""} onChange={(e) => setSetting(s.key, e.target.value)}
                      className="w-full px-3 py-2 rounded border border-gray-200 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveSettings} disabled={settingsSaving}
              className="px-6 py-2 rounded bg-[#3d0c0c] text-[#d4a843] font-medium hover:bg-[#5c1a1a] transition disabled:opacity-50 text-sm">
              {settingsSaving ? "Saving..." : "Save All Settings"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
