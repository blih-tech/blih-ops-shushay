"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Input, Alert } from "@blih/ui";
import { apiFetch } from "@/lib/api";
import { Settings } from "lucide-react";

export function PricingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [prices, setPrices] = useState({
    PRICE_SKILLS_ACCESS: "1000",
    PRICE_SUBSCRIPTION_MONTHLY: "2000",
    PRICE_SUBSCRIPTION_YEARLY: "10000",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await apiFetch<any>("/admin/settings/pricing");
      setPrices({
        PRICE_SKILLS_ACCESS: data.PRICE_SKILLS_ACCESS,
        PRICE_SUBSCRIPTION_MONTHLY: data.PRICE_SUBSCRIPTION_MONTHLY,
        PRICE_SUBSCRIPTION_YEARLY: data.PRICE_SUBSCRIPTION_YEARLY,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load pricing settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await apiFetch("/admin/settings/pricing", {
        method: "PUT",
        body: JSON.stringify(prices),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save pricing settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-32 bg-secondary/20 animate-pulse rounded-lg mb-8" />;

  return (
    <Card className="p-6 mb-8 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Platform Pricing</h2>
          <p className="text-sm text-muted-foreground">Manage global prices for Skills and Company Subscriptions (in ETB).</p>
        </div>
      </div>
      
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">Settings saved successfully!</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Skills Permanent Access (ETB)</label>
          <Input 
            type="number" 
            value={prices.PRICE_SKILLS_ACCESS}
            onChange={(e) => setPrices(p => ({ ...p, PRICE_SKILLS_ACCESS: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Company Monthly (ETB)</label>
          <Input 
            type="number" 
            value={prices.PRICE_SUBSCRIPTION_MONTHLY}
            onChange={(e) => setPrices(p => ({ ...p, PRICE_SUBSCRIPTION_MONTHLY: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Company Yearly (ETB)</label>
          <Input 
            type="number" 
            value={prices.PRICE_SUBSCRIPTION_YEARLY}
            onChange={(e) => setPrices(p => ({ ...p, PRICE_SUBSCRIPTION_YEARLY: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving} size="md">Save Prices</Button>
      </div>
    </Card>
  );
}
