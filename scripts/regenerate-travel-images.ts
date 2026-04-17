import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { travelPackages } from "../src/lib/db/schema";
import { fal } from "@fal-ai/client";
import path from "path";

// Configure FAL
fal.config({ credentials: "32c00645-c187-4f55-af75-0963fde67d6d:b15b14102800955a17f1b106b0ea4952" });

// Setup DB
const DB_PATH = path.join(process.cwd(), "data", "app.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema: { travelPackages } });

// Category-specific prompts — each one highly distinct
const promptMap: Record<string, string> = {
  tp_jyotirlinga_1: "Sacred Shiva Jyotirlinga shrine with golden Shiva lingam, ornate stone temple interior, oil lamps, flowers, devotional Hindu temple atmosphere, warm golden lighting, closeup of carved Shiva lingam with bilva leaves",

  tp_jyotirlinga_2: "Bhimashankar temple in misty Sahyadri mountains Maharashtra, ancient black stone Shiva temple surrounded by dense green forest, morning fog, Western Ghats landscape",

  tp_chardham_1: "Badrinath temple Uttarakhand with snow-capped Himalayan peaks behind, colorful painted Hindu temple facade, Alaknanda river, pilgrims walking, dramatic mountain landscape",

  tp_ashtavinayak_1: "Golden Ganesh Ganapati idol decorated with flowers and ornaments, traditional Maharashtrian temple, modak sweets offering, red sindoor, marigold garlands, devotional Ganpati atmosphere, closeup of beautiful Ganesha statue",

  tp_shakti_1: "Kolhapur Mahalakshmi temple goddess idol decorated with gold jewelry and silk saree, ornate temple sanctum, oil lamps, red kumkum, traditional Devi temple interior, divine feminine energy",

  tp_shakti_2: "Tuljapur Bhavani Devi temple Maharashtra, ancient stone temple on hilltop, devotees climbing steps, colorful temple flags, Maharashtrian temple architecture",

  tp_datta_1: "Dattatreya temple Gangapur Karnataka, three-headed Dattatreya deity, serene riverbank temple, padukas (sacred footprints), peaceful ashram atmosphere, sunrise over river",

  tp_panchkedar_1: "Tungnath temple highest Shiva temple in world, small ancient stone temple perched on Himalayan mountain peak, alpine meadows with wildflowers, snow peaks in background, dramatic clouds",

  tp_varanasi_1: "Varanasi ghats at golden sunrise, thousands of oil lamps floating on Ganges river, ancient stone steps leading to water, boats, orange-clad sadhus, Ganga aarti fire ceremony",

  tp_rameshwaram_1: "Rameshwaram temple long ornate pillared corridor, thousand-pillar mandapam, intricate Dravidian temple architecture, perspective shot of endless carved stone pillars, Tamil Nadu temple",

  tp_dwarka_1: "Dwarkadhish temple Gujarat at sunset by Arabian sea, five-story ornate temple with carved spire, blue sea in background, devotees, golden evening light on ancient stone temple",

  tp_shirdi_1: "Shirdi Sai Baba Samadhi Mandir, white marble temple with Sai Baba statue seated with blessing hand, marigold flower decorations, peaceful devotional atmosphere, warm interior lighting",

  tp_tirupati_1: "Tirupati Balaji Venkateswara temple golden gopuram tower, richly decorated golden temple entrance, Tirumala hills, devotees in queue, majestic South Indian temple architecture, golden shrine",

  tp_pandharpur_1: "Pandharpur Vitthal temple with standing Vitthal deity on brick (vit), Chandrabhaga river, warkari pilgrims with tulas and veena, saffron flags, traditional Maharashtrian pilgrimage scene",

  tp_local_1: "Dagdusheth Halwai Ganpati temple Pune, magnificent large Ganesh idol richly decorated with gold and jewels, bright colorful temple interior, festive atmosphere, close-up of beautiful Ganpati",

  tp_local_2: "Siddhivinayak temple Mumbai, golden dome temple exterior, devotees offering prayers, orange marigold garlands, bustling Mumbai temple, golden Ganesh idol visible through doorway",

  tp_custom_1: "Collage-style composition showing diverse Indian pilgrimage sites, multiple temple spires, mountain temples, coastal temples, river ghats, representing spiritual journey across India, warm golden tones",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const packages = db.select().from(travelPackages).all();
  console.log(`Found ${packages.length} travel packages\n`);

  let success = 0;
  let failed = 0;

  for (const pkg of packages) {
    const prompt = promptMap[pkg.id];
    if (!prompt) {
      console.log(`[${success + failed + 1}/${packages.length}] SKIP: No prompt defined for "${pkg.id}" (${pkg.titleEn})`);
      failed++;
      continue;
    }

    console.log(`[${success + failed + 1}/${packages.length}] Generating image for "${pkg.titleEn}" (${pkg.id})...`);

    try {
      const result: any = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt,
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

    // 2-second delay between calls
    if (success + failed < packages.length) {
      await sleep(2000);
    }
  }

  console.log(`\n========================================`);
  console.log(`Done! Success: ${success}, Failed: ${failed}, Total: ${packages.length}`);
  console.log(`========================================`);
  sqlite.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
