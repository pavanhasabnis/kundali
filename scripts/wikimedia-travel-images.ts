import { db } from "../src/lib/db";
import { travelPackages } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const SEARCH_TERMS: Record<string, string> = {
  tp_jyotirlinga_1: "Somnath temple Gujarat",
  tp_jyotirlinga_2: "Bhimashankar temple Maharashtra",
  tp_chardham_1: "Badrinath temple Uttarakhand",
  tp_ashtavinayak_1: "Morgaon Ganpati temple Maharashtra",
  tp_shakti_1: "Kolhapur Mahalakshmi temple",
  tp_shakti_2: "Tuljapur Bhavani temple",
  tp_datta_1: "Gangapur Dattatreya temple Karnataka",
  tp_panchkedar_1: "Tungnath temple Uttarakhand",
  tp_varanasi_1: "Varanasi ghats Ganges",
  tp_rameshwaram_1: "Ramanathaswamy temple Rameshwaram",
  tp_dwarka_1: "Dwarkadhish temple Gujarat",
  tp_shirdi_1: "Shirdi Sai Baba temple",
  tp_tirupati_1: "Tirumala Venkateswara temple",
  tp_pandharpur_1: "Pandharpur Vitthal temple",
  tp_local_1: "Dagdusheth Ganpati Pune",
  tp_local_2: "Siddhivinayak temple Mumbai",
  tp_custom_1: "Indian pilgrimage temples",
};

// Simpler fallback search terms
const FALLBACK_TERMS: Record<string, string> = {
  tp_jyotirlinga_1: "Somnath temple",
  tp_jyotirlinga_2: "Bhimashankar temple",
  tp_chardham_1: "Badrinath temple",
  tp_ashtavinayak_1: "Morgaon temple",
  tp_shakti_1: "Mahalakshmi temple Kolhapur",
  tp_shakti_2: "Tuljapur temple",
  tp_datta_1: "Gangapur temple",
  tp_panchkedar_1: "Tungnath temple",
  tp_varanasi_1: "Varanasi ghat",
  tp_rameshwaram_1: "Rameshwaram temple",
  tp_dwarka_1: "Dwarka temple",
  tp_shirdi_1: "Shirdi temple",
  tp_tirupati_1: "Tirupati temple",
  tp_pandharpur_1: "Pandharpur temple",
  tp_local_1: "Dagdusheth Pune",
  tp_local_2: "Siddhivinayak Mumbai",
  tp_custom_1: "Hindu pilgrimage India",
};

async function searchWikimediaImage(searchTerm: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json`;

  const response = await fetch(url, {
    headers: { "User-Agent": "MyPatrika/1.0 (travel package images)" },
  });

  if (!response.ok) {
    console.error(`  API error: ${response.status} ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  const firstPage = Object.values(pages)[0] as any;
  const thumburl = firstPage?.imageinfo?.[0]?.thumburl;
  return thumburl || null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("Starting Wikimedia image update for travel packages...\n");

  let succeeded = 0;
  let failed = 0;
  const entries = Object.entries(SEARCH_TERMS);

  for (const [packageId, searchTerm] of entries) {
    console.log(`[${packageId}] Searching: "${searchTerm}"`);

    let thumburl = await searchWikimediaImage(searchTerm);

    if (!thumburl && FALLBACK_TERMS[packageId]) {
      const fallback = FALLBACK_TERMS[packageId];
      console.log(`  Primary search failed, trying fallback: "${fallback}"`);
      await sleep(1000);
      thumburl = await searchWikimediaImage(fallback);
    }

    if (thumburl) {
      await db
        .update(travelPackages)
        .set({ imageUrl: thumburl })
        .where(eq(travelPackages.id, packageId));
      console.log(`  OK: ${thumburl.substring(0, 80)}...`);
      succeeded++;
    } else {
      console.log(`  FAILED: No image found`);
      failed++;
    }

    // Be polite to the API
    await sleep(1000);
  }

  console.log(`\n--- Done ---`);
  console.log(`Succeeded: ${succeeded}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${entries.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
