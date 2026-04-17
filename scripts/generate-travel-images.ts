import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { travelPackages } from "../src/lib/db/schema";
import { fal } from "@fal-ai/client";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load env
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("FAL_KEY not found in .env.local");
  process.exit(1);
}

fal.config({ credentials: FAL_KEY });

// Setup DB
const DB_PATH = path.join(process.cwd(), "data", "app.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema: { travelPackages } });

// Prompt map
const promptMap: Record<string, string> = {
  tp_jyotirlinga_1: "Ancient Hindu Shiva temples across India, Jyotirlinga shrines, sacred architecture, temple spires against dramatic sky",
  tp_jyotirlinga_2: "Maharashtra Jyotirlinga temples, Bhimashankar and Trimbakeshwar, misty Sahyadri mountains, ancient stone temples",
  tp_chardham_1: "Char Dham Uttarakhand, snow-capped Himalayan peaks, Badrinath temple with mountains, sacred river Ganges",
  tp_ashtavinayak_1: "Ashtavinayak Ganpati temples Maharashtra, traditional Indian temple architecture, lush green Sahyadri hills, devotional atmosphere",
  tp_shakti_1: "Shakti Peeth temples India, goddess Durga temple, ornate Hindu temple architecture, red and gold decorations",
  tp_shakti_2: "Kolhapur Mahalakshmi temple, ancient Devi temple Maharashtra, traditional temple gopuram, devotional atmosphere",
  tp_datta_1: "Dattatreya temple Gangapur Karnataka, serene river bank temple, peaceful ashram, spiritual atmosphere",
  tp_panchkedar_1: "Panch Kedar temples Uttarakhand, ancient stone Shiva temple in Himalayas, snow peaks, alpine meadows, trekking path",
  tp_varanasi_1: "Varanasi ghats at sunrise, Ganga aarti ceremony, ancient temples along river Ganges, boats on holy river, golden light",
  tp_rameshwaram_1: "Rameshwaram temple corridor, long pillared hallway, sea bridge, Tamil Nadu temple architecture, ocean view",
  tp_dwarka_1: "Dwarkadhish temple Gujarat, ancient Krishna temple by the sea, ornate temple architecture, Arabian sea coast",
  tp_shirdi_1: "Shirdi Sai Baba temple, white marble temple architecture, peaceful courtyard, devotional atmosphere, flowers",
  tp_tirupati_1: "Tirupati Balaji temple Andhra Pradesh, golden gopuram, Tirumala hills, majestic temple entrance, sacred hill temple",
  tp_pandharpur_1: "Pandharpur Vitthal temple Maharashtra, ancient temple on Chandrabhaga river bank, devotees, warkari pilgrimage",
  tp_local_1: "Pune temples, Dagdusheth Ganpati temple, colorful Indian temple decorations, bustling temple street",
  tp_local_2: "Siddhivinayak temple Mumbai, golden dome temple, Mumbai cityscape, devotional atmosphere, marigold garlands",
  tp_custom_1: "Indian pilgrimage collage, multiple sacred temples, diverse holy sites across India, spiritual journey montage",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Read all packages
  const packages = db.select().from(travelPackages).all();
  console.log(`Found ${packages.length} travel packages\n`);

  let success = 0;
  let failed = 0;

  for (const pkg of packages) {
    const customPrompt = promptMap[pkg.id] || `${pkg.titleEn}, Indian temple, sacred pilgrimage destination`;
    const fullPrompt = `Professional travel photography, ${customPrompt}, beautiful landscape, high quality, 4K, vibrant colors, golden hour lighting`;

    console.log(`[${success + failed + 1}/${packages.length}] Generating image for "${pkg.titleEn}" (${pkg.id})...`);

    try {
      const result: any = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: fullPrompt,
          image_size: "landscape_16_9",
          num_images: 1,
        },
      });

      const imageUrl = result.data?.images?.[0]?.url;
      if (!imageUrl) {
        console.error(`  ERROR: No image URL in response for ${pkg.id}`);
        failed++;
        continue;
      }

      // Update DB
      db.update(travelPackages)
        .set({ imageUrl })
        .where(eq(travelPackages.id, pkg.id))
        .run();

      console.log(`  SUCCESS: ${imageUrl.substring(0, 80)}...`);
      success++;
    } catch (err: any) {
      console.error(`  ERROR for ${pkg.id}: ${err.message}`);
      failed++;
    }

    // Delay between calls
    if (success + failed < packages.length) {
      await sleep(2000);
    }
  }

  console.log(`\nDone! Success: ${success}, Failed: ${failed}`);
  sqlite.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
