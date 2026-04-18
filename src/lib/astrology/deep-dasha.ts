/**
 * Pratyantar (Level 3) and Sookshma (Level 4) Vimshottari dasha.
 * Each antardasha has 9 pratyantars (9 planets in dasha order starting from antardasha lord).
 * Each pratyantar has 9 sookshmas (same pattern).
 * Computed only for CURRENT antardasha to keep output compact and relevant.
 */

import type { KundliResult, DashaPeriod } from "./calculator";
import { DASHA_ORDER, TOTAL_DASHA_YEARS } from "./constants";

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

function getDashaYears(lord: string): number {
  return DASHA_ORDER.find((d) => d.lord === lord)?.years ?? 0;
}

function getLordsFrom(startLord: string): string[] {
  const idx = DASHA_ORDER.findIndex((d) => d.lord === startLord);
  if (idx === -1) return [];
  return [...Array(9)].map((_, i) => DASHA_ORDER[(idx + i) % 9].lord);
}

export interface DeepDashaPeriod {
  lord: string;
  lordMr: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  isCurrent: boolean;
  sookshmas?: DeepDashaPeriod[];
}

export interface DeepDashaResult {
  currentMahadasha: {
    lord: string;
    lordMr: string;
    startDate: string;
    endDate: string;
  };
  currentAntardasha: {
    lord: string;
    lordMr: string;
    startDate: string;
    endDate: string;
  };
  currentPratyantar: DeepDashaPeriod | null;
  currentSookshma: DeepDashaPeriod | null;
  pratyantars: DeepDashaPeriod[];   // all pratyantars inside current antardasha
  nextMilestoneMr: string;
  nextMilestoneEn: string;
  nextMilestoneHi: string;
}

export function calculateDeepDasha(k: KundliResult): DeepDashaResult | null {
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const now = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());

  // Find current mahadasha
  const md = k.dashas.find((d) => now >= new Date(d.startDate) && now <= new Date(d.endDate));
  if (!md) return null;

  const ad = md.antardashas.find((a) => now >= new Date(a.startDate) && now <= new Date(a.endDate));
  if (!ad) return null;

  // Build pratyantars inside current antardasha
  const adStart = new Date(ad.startDate);
  const adEnd = new Date(ad.endDate);
  const adDurationMs = adEnd.getTime() - adStart.getTime();

  const pratLords = getLordsFrom(ad.lord);
  const pratyantars: DeepDashaPeriod[] = [];
  let cursor = adStart.getTime();
  for (const lord of pratLords) {
    const fraction = getDashaYears(lord) / TOTAL_DASHA_YEARS;
    const durMs = adDurationMs * fraction;
    const start = new Date(cursor);
    const end = new Date(cursor + durMs);
    const isCurrent = now >= start && now < end;

    // Build sookshmas
    const pratLordsSub = getLordsFrom(lord);
    const sookshmas: DeepDashaPeriod[] = [];
    let subCursor = start.getTime();
    for (const sLord of pratLordsSub) {
      const sFrac = getDashaYears(sLord) / TOTAL_DASHA_YEARS;
      const sDurMs = durMs * sFrac;
      const sStart = new Date(subCursor);
      const sEnd = new Date(subCursor + sDurMs);
      const sCurrent = now >= sStart && now < sEnd;
      sookshmas.push({
        lord: sLord,
        lordMr: PLANET_MR[sLord] ?? sLord,
        startDate: sStart.toISOString().slice(0, 10),
        endDate: sEnd.toISOString().slice(0, 10),
        durationDays: Math.round(sDurMs / (1000 * 60 * 60 * 24)),
        isCurrent: sCurrent,
      });
      subCursor += sDurMs;
    }

    pratyantars.push({
      lord,
      lordMr: PLANET_MR[lord] ?? lord,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      durationDays: Math.round(durMs / (1000 * 60 * 60 * 24)),
      isCurrent,
      sookshmas,
    });
    cursor += durMs;
  }

  const currentPrat = pratyantars.find((p) => p.isCurrent) ?? null;
  const currentSoo = currentPrat?.sookshmas?.find((s) => s.isCurrent) ?? null;

  let nextMilestoneMr = "";
  let nextMilestoneEn = "";
  let nextMilestoneHi = "";
  if (currentPrat) {
    const currIdx = pratyantars.findIndex((p) => p.isCurrent);
    const next = pratyantars[currIdx + 1];
    if (next) {
      const mdLordMr = PLANET_MR[md.lord] ?? md.lord;
      const adLordMr = PLANET_MR[ad.lord] ?? ad.lord;
      nextMilestoneMr = `पुढील प्रत्यंतर दशा: ${mdLordMr}-${adLordMr}-${next.lordMr}, ${next.startDate} पासून.`;
      nextMilestoneEn = `Next Pratyantar: ${md.lord}-${ad.lord}-${next.lord} starting ${next.startDate}.`;
      nextMilestoneHi = `अगला प्रत्यंतर: ${mdLordMr}-${adLordMr}-${next.lordMr} — ${next.startDate} से.`;
    }
  }

  return {
    currentMahadasha: {
      lord: md.lord,
      lordMr: PLANET_MR[md.lord] ?? md.lord,
      startDate: new Date(md.startDate).toISOString().slice(0, 10),
      endDate: new Date(md.endDate).toISOString().slice(0, 10),
    },
    currentAntardasha: {
      lord: ad.lord,
      lordMr: PLANET_MR[ad.lord] ?? ad.lord,
      startDate: adStart.toISOString().slice(0, 10),
      endDate: adEnd.toISOString().slice(0, 10),
    },
    currentPratyantar: currentPrat,
    currentSookshma: currentSoo,
    pratyantars,
    nextMilestoneMr, nextMilestoneEn, nextMilestoneHi,
  };
}
