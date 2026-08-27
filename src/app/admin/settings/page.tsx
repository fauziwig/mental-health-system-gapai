"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2,
  RefreshCw,
} from "lucide-react";
import { useBrand } from "@/components/branding/BrandProvider";

const COLOR_PRESETS = [
  { name: "GAPAI Purple", hex: "#890DD3" },
  { name: "Emerald Green", hex: "#059669" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Sunset Orange", hex: "#ea580c" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Rose Crimson", hex: "#e11d48" },
];

export default function AdminSettingsPage() {
  const { brand, updateBrand } = useBrand();
  const [name, setName] = useState(brand.name);
  const [primaryColor, setPrimaryColor] = useState(brand.primaryColor);
  const [logoUrl, setLogoUrl] = useState(brand.logoUrl || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(brand.name);
    setPrimaryColor(brand.primaryColor);
    setLogoUrl(brand.logoUrl || "");
  }, [brand]);

  const handleColorChange = (newColor: string) => {
    setPrimaryColor(newColor);
    // Dynamic live preview in real time
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand-primary", newColor);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          primaryColor,
          logoUrl: logoUrl.trim() || null,
        }),
      });

      const json = await res.json();
      if (res.ok && json.status === "success") {
        updateBrand({
          name: name.trim(),
          primaryColor,
          logoUrl: logoUrl.trim() || null,
        });
        setSuccessMsg("Pengaturan dan tema warna perusahaan berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(json.message || "Gagal menyimpan pengaturan.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div
            className="text-xs uppercase tracking-wider font-bold"
            style={{ color: primaryColor || "var(--brand-primary)" }}
          >
            Kustomisasi & Dynamic Branding
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Pengaturan Identitas Perusahaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ubah nama dan warna tema perusahaan. Perubahan akan langsung diaplikasikan ke <strong>seluruh portal admin, dashboard, sidebar, dan halaman ujian kandidat</strong>.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2
                className="w-5 h-5"
                style={{ color: primaryColor || "var(--brand-primary)" }}
              />
              Identitas & Nama Perusahaan
            </h3>
            <p className="text-xs text-slate-500">
              Identitas ini akan tampil di seluruh header, formulir kandidat, dan laporan penilaian.
            </p>
          </div>

          <div className="space-y-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nama Perusahaan / Organisasi *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: PT GAPAI Kreasi Nusantara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                style={{ outlineColor: primaryColor }}
              />
            </div>

            {/* Brand Color Picker & Presets */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Warna Tema Utama (Primary Brand Color)</span>
              </label>

              {/* Color Presets */}
              <div className="flex flex-wrap gap-2 pt-1 pb-2">
                {COLOR_PRESETS.map((preset) => {
                  const isSelected = primaryColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => handleColorChange(preset.hex)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100 border-transparent text-white"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                      }`}
                      style={isSelected ? { backgroundColor: preset.hex } : {}}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 p-1"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-40 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
                />
                <span className="text-xs text-slate-400">Kode HEX Kustom</span>
              </div>
            </div>

            {/* Logo URL */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                <span>URL Logo Perusahaan (Opsional)</span>
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2"
                style={{ outlineColor: primaryColor }}
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Live Visual Preview:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Tombol Utama ({name || "Nama Perusahaan"})
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                  color: primaryColor,
                  borderColor: primaryColor,
                  backgroundColor: `${primaryColor}15`,
                }}
              >
                Status Badge Contoh
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan ke Supabase..." : "Simpan Perubahan Tema"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
