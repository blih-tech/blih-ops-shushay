import prisma from "../../config/prisma";

// Use an in-memory cache to prevent heavy DB querying on every payment
const settingsCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  const cached = settingsCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.value;
  }

  const record = await prisma.systemSetting.findUnique({ where: { key } });
  
  if (record) {
    settingsCache.set(key, { value: record.value, expiresAt: Date.now() + CACHE_TTL });
    return record.value;
  }
  
  return defaultValue;
}

export async function updateSettings(settings: Record<string, string>) {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    settingsCache.delete(key);
  }
  
  return { success: true };
}
