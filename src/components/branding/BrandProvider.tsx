"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BrandSettings {
  name: string;
  primaryColor: string;
  logoUrl: string | null;
}

interface BrandContextType {
  brand: BrandSettings;
  updateBrand: (newBrand: Partial<BrandSettings>) => void;
  refreshBrand: () => Promise<void>;
  loading: boolean;
}

const defaultBrand: BrandSettings = {
  name: "PT Gapai Cita Raharjo",
  primaryColor: "#890DD3",
  logoUrl: null,
};

const BrandContext = createContext<BrandContextType>({
  brand: defaultBrand,
  updateBrand: () => {},
  refreshBrand: async () => {},
  loading: true,
});

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);
  const [loading, setLoading] = useState(true);

  const applyColor = (color: string) => {
    if (typeof document !== "undefined" && color) {
      document.documentElement.style.setProperty("--brand-primary", color);
    }
  };

  const fetchBrand = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const fetchedBrand = {
          name: json.data.name || defaultBrand.name,
          primaryColor: json.data.primaryColor || defaultBrand.primaryColor,
          logoUrl: json.data.logoUrl || null,
        };
        setBrand(fetchedBrand);
        applyColor(fetchedBrand.primaryColor);
      }
    } catch (err) {
      console.warn("Failed to load global brand settings:", err);
      applyColor(defaultBrand.primaryColor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  const updateBrand = (newBrand: Partial<BrandSettings>) => {
    setBrand((prev) => {
      const updated = { ...prev, ...newBrand };
      if (updated.primaryColor) {
        applyColor(updated.primaryColor);
      }
      return updated;
    });
  };

  return (
    <BrandContext.Provider
      value={{
        brand,
        updateBrand,
        refreshBrand: fetchBrand,
        loading,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
