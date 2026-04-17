# SEO Keywords + Meta Descriptions Reference

Complete dictionary for Phase 2 implementation. Each page has MR + EN versions.
Covers: Devanagari Marathi, Roman-Marathi, English.

---

## Keyword Bucket Strategy

Every URL gets 3 buckets:
- **Devanagari Marathi** — native keyboard users
- **Roman-Marathi** — Indian users typing Marathi in English keyboard
- **English** — global + Indian English users

Split ratio:
- `/mr/*` pages: 60% Devanagari, 30% Roman-Marathi, 10% English
- `/en/*` pages: 60% English, 30% Roman-Marathi, 10% Devanagari

---

## 1. Homepage (`/mr` and `/en`)

### `/mr` (Marathi home)

**Title:** `भाग्यवेध — मोफत कुंडली, राशीफल, पंचांग | Vedic Astrology Marathi`

**Description:** `मोफत जन्म कुंडली, आजचे राशीभविष्य, गुण मिलान, पंचांग, शुभ मुहूर्त आणि तीर्थयात्रा सेवा. Aajcha rashifal, mofat kundli, panchang Marathi. भाग्यवेध वर वैदिक ज्योतिष.`

**Keywords:**
```
मोफत कुंडली, जन्म कुंडली, आजचे राशीभविष्य, पंचांग आज, गुण मिलान, मुहूर्त, तीर्थयात्रा, मराठी ज्योतिष,
mofat kundli, aajcha rashifal, ajjcha rashi bhavishya, panchang marathi, gun milan marathi, muhurat marathi,
bhaagyavedh, vedic astrology marathi, pune astrology
```

### `/en` (English home)

**Title:** `Bhaagyavedh — Free Kundli, Horoscope, Panchang | Vedic Astrology`

**Description:** `Free janam kundli maker, daily horoscope, Ashtakoot matching, panchang, shubh muhurat, and pilgrimage services. Aajcha rashifal marathi, mofat kundali. Trusted Vedic astrology from Pune.`

**Keywords:**
```
free kundli online, janam kundli maker, daily horoscope, kundli matching, panchang today, shubh muhurat, vedic astrology,
mofat kundli, aajcha rashifal, janam kundali marathi, gun milan, bhaagyavedh, marathi horoscope,
आजचे राशीभविष्य, मोफत कुंडली
```

---

## 2. Kundli (`/mr/kundli` and `/en/kundli`)

### `/mr/kundli`

**Title:** `मोफत जन्म कुंडली ऑनलाइन — Mofat Janam Kundli | भाग्यवेध`

**Description:** `मोफत जन्म कुंडली तयार करा. जन्म तारीख, वेळ, ठिकाण टाका आणि अचूक लग्न कुंडली, ग्रह स्थिती, दशा, योग मिळवा. Mofat kundali online marathi. वैदिक पद्धत, लाहिरी अयनांश.`

**Keywords:**
```
मोफत कुंडली, जन्म कुंडली, जन्म पत्रिका, ऑनलाइन कुंडली, लग्न कुंडली, कुंडली मराठी, वैदिक कुंडली, ग्रह स्थिती,
mofat kundli, janam kundali marathi, online kundli marathi, kundali maker marathi, free kundli marathi,
janam patrika, free kundli online, birth chart free, vedic kundli
```

### `/en/kundli`

**Title:** `Free Kundli Online — Janam Kundali Maker in Marathi & English | Bhaagyavedh`

**Description:** `Generate free janam kundli online. Enter birth date, time, place — get accurate lagna chart, planetary positions, dashas, yogas in Marathi or English. Mofat kundali marathi maker.`

**Keywords:**
```
free kundli online, free janam kundli, kundli maker online, birth chart free, lagna chart, vedic kundli,
mofat kundli, janam kundali marathi, kundali maker, kundli in marathi, online kundali marathi,
जन्म कुंडली, मोफत कुंडली
```

---

## 3. Rashifal Index (`/mr/rashifal` and `/en/rashifal`)

### `/mr/rashifal`

**Title:** `आजचे राशीभविष्य — 12 राशी | Aajcha Rashifal Marathi | भाग्यवेध`

**Description:** `आजचे राशीभविष्य 12 राशींसाठी. मेष, वृषभ, मिथुन, कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुंभ, मीन. Aajcha rashi bhavishya marathi. वास्तविक ग्रह गोचरावर आधारित दैनिक राशीफल.`

**Keywords:**
```
आजचे राशीभविष्य, दैनिक राशीफल, 12 राशी भविष्य, राशी भविष्य मराठी,
aajcha rashifal, ajjcha rashi bhavishya, aaj cha rashi bhavishya, daily rashifal marathi, rashi bhavishya today,
daily horoscope, today horoscope, 12 zodiac signs horoscope
```

### `/en/rashifal`

**Title:** `Today's Horoscope — All 12 Zodiac Signs | Aajcha Rashifal Marathi`

**Description:** `Daily horoscope for all 12 zodiac signs in Marathi and English. Aajcha rashi bhavishya based on real Vedic planetary transits. Get predictions for career, love, health, finance.`

**Keywords:**
```
daily horoscope, today horoscope, 12 zodiac horoscope, daily rashifal, vedic horoscope,
aajcha rashifal, ajjcha rashi bhavishya, rashi bhavishya marathi, daily rashifal marathi,
आजचे राशीभविष्य, दैनिक राशीफल
```

---

## 4. Rashifal Per Sign (12 signs × 2 langs = 24 variants)

### Pattern for each sign:

**`/mr/rashifal/{slug}` Title:**
```
{mr} राशीफल आज — {en} Horoscope Today | {romanMr} | भाग्यवेध
```

**Example `/mr/rashifal/mesh`:**
```
Title: मेष राशीफल आज — Aries Horoscope Today | Mesh Rashi Bhavishya | भाग्यवेध
Description: मेष राशीचे आजचे भविष्य — करिअर, प्रेम, आरोग्य, आर्थिक. Mesh rashi aaj cha bhavishya in marathi. वास्तविक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.
```

**`/en/rashifal/{slug}` Title:**
```
{en} Horoscope Today — {mr} राशीफल | {romanMr} Marathi | Bhaagyavedh
```

**Example `/en/rashifal/mesh`:**
```
Title: Aries Horoscope Today — मेष राशीफल | Mesh Rashi Bhavishya Marathi | Bhaagyavedh
Description: Aries daily horoscope — career, love, health, finance. Mesh rashi bhavishya in Marathi. Based on real Vedic planetary transits, updated daily.
```

### Sign Name Table (for template substitution)

| Slug | Marathi | English | Roman-Marathi |
|---|---|---|---|
| mesh | मेष | Aries | Mesh |
| vrishabh | वृषभ | Taurus | Vrishabh, Vrushabh |
| mithun | मिथुन | Gemini | Mithun |
| kark | कर्क | Cancer | Kark, Karka |
| singh | सिंह | Leo | Singh, Simha |
| kanya | कन्या | Virgo | Kanya |
| tula | तुला | Libra | Tula |
| vrishchik | वृश्चिक | Scorpio | Vrishchik, Vrushchik |
| dhanu | धनु | Sagittarius | Dhanu |
| makar | मकर | Capricorn | Makar |
| kumbh | कुंभ | Aquarius | Kumbh |
| meen | मीन | Pisces | Meen, Meena |

**Keywords per rashi page (both langs):**
```
{mr} राशी, {mr} राशीफल, {mr} राशीफल आज, {mr} राशीभविष्य, {mr} राशी चे भविष्य,
{romanMr} rashi, {romanMr} rashifal, {romanMr} rashi bhavishya, {romanMr} rashi aaj, aajcha {romanMr} rashifal,
{en} horoscope, {en} horoscope today, {en} daily horoscope, {en} zodiac today
```

**Concrete Example — Aries/Mesh full keyword list:**
```
मेष राशी, मेष राशीफल, मेष राशीफल आज, मेष राशीभविष्य, मेष राशी चे भविष्य,
mesh rashi, mesh rashifal, mesh rashi bhavishya, mesh rashi aaj, aajcha mesh rashifal, mesh rashi bhavisya,
aries horoscope, aries horoscope today, aries daily horoscope, aries zodiac today
```

---

## 5. Matching (`/mr/matching` and `/en/matching`)

### `/mr/matching`

**Title:** `गुण मिलान — 36 गुण कुंडली मेळ | Gun Milan Marathi | भाग्यवेध`

**Description:** `विवाहासाठी 36 गुण कुंडली जुळवणी. अष्टकूट गुण मिलान — वर्ण, वश्य, तारा, योनी, ग्रह मैत्री, गण, भकूट, नाडी. Gun milan marathi, kundali matching online free.`

**Keywords:**
```
गुण मिलान, कुंडली मिलान, कुंडली मेळ, 36 गुण कुंडली, अष्टकूट, मंगळ दोष, नाडी दोष, भकूट दोष, विवाह कुंडली,
gun milan marathi, gun milaan, kundali matching marathi, ashtakoot matching marathi, mangal dosh marathi, nadi dosh,
kundli matching, gun milan, 36 gun milan, ashtakoot, marriage kundli matching
```

### `/en/matching`

**Title:** `Kundli Matching — 36 Gun Milan Ashtakoot | Guna Match Marathi | Bhaagyavedh`

**Description:** `Free 36 guna kundli matching for marriage. Ashtakoot method — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi. Mangal dosh and Nadi dosh check in Marathi + English.`

**Keywords:**
```
kundli matching, 36 gun milan, ashtakoot matching, kundali matching free, marriage matching vedic, mangal dosh check, nadi dosh,
gun milan marathi, gun milaan, kundali matching marathi, ashtakoot marathi,
गुण मिलान, कुंडली मिलान, 36 गुण कुंडली
```

---

## 6. Panchang (`/mr/panchang` and `/en/panchang`)

### `/mr/panchang`

**Title:** `आजचे पंचांग — तिथी, नक्षत्र, योग, करण | Panchang Marathi Today | भाग्यवेध`

**Description:** `आजचे पंचांग — तिथी, नक्षत्र, योग, करण, राहू काळ, सूर्योदय, सूर्यास्त. Aaj cha panchang marathi pune. मुंबई, नागपूर, औरंगाबाद साठी दैनिक पंचांग.`

**Keywords:**
```
आजचे पंचांग, पंचांग मराठी, दैनिक पंचांग, तिथी आज, नक्षत्र आज, राहू काळ, सूर्योदय वेळ, पुणे पंचांग, मुंबई पंचांग,
aaj cha panchang, aajcha panchang, panchang marathi, panchang today, rahu kaal marathi, tithi today,
panchang today, today panchang, daily panchang, vedic panchang, rahu kaal, tithi
```

### `/en/panchang`

**Title:** `Today's Panchang — Tithi, Nakshatra, Rahu Kaal | Panchang Marathi | Bhaagyavedh`

**Description:** `Daily Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise, sunset. Aaj cha panchang marathi for Pune, Mumbai, Nagpur. Based on precise astronomical calculations.`

**Keywords:**
```
panchang today, today panchang, daily panchang, hindu panchang, vedic panchang, rahu kaal today, tithi today,
aaj cha panchang, aajcha panchang, panchang marathi, rahu kaal marathi,
आजचे पंचांग, पंचांग मराठी
```

---

## 7. Calendar (`/mr/calendar` and `/en/calendar`)

Dynamic year via `new Date().getFullYear()`.

### `/mr/calendar`

**Title:** `हिंदू दिनदर्शिका {YEAR} — मराठी कॅलेंडर | Marathi Calendar | भाग्यवेध`

**Description:** `मराठी हिंदू दिनदर्शिका {YEAR} — सर्व सण, व्रत, तिथी, नक्षत्र, शुभ मुहूर्त. Marathi calendar {YEAR} festivals, vrat, muhurat. मराठी महिने आणि पंचांग.`

**Keywords:**
```
मराठी कॅलेंडर, हिंदू दिनदर्शिका, मराठी पंचांग, मराठी महिने, सण व्रत {YEAR},
marathi calendar {YEAR}, marathi panchang, hindu calendar marathi, marathi festivals {YEAR},
hindu calendar {YEAR}, vedic calendar, festivals {YEAR}
```

### `/en/calendar`

**Title:** `Hindu Marathi Calendar {YEAR} — Festivals, Tithi & Muhurat | Bhaagyavedh`

**Description:** `Complete Hindu Vedic Marathi calendar {YEAR} with daily tithi, nakshatra, festivals, vrat, and shubh muhurat. Marathi calendar {YEAR} in English and Marathi.`

**Keywords:**
```
hindu calendar {YEAR}, marathi calendar {YEAR}, vedic calendar, festivals {YEAR}, hindu festivals calendar,
marathi calendar, hindu calendar marathi, marathi panchang,
मराठी कॅलेंडर, हिंदू दिनदर्शिका
```

---

## 8. Muhurat (`/mr/muhurat` and `/en/muhurat`)

### `/mr/muhurat`

**Title:** `शुभ मुहूर्त — विवाह, गृहप्रवेश, वास्तुशांती | Shubh Muhurat Marathi | भाग्यवेध`

**Description:** `विवाह मुहूर्त, गृहप्रवेश मुहूर्त, वास्तुशांती, व्यापार शुभारंभ साठी शुभ तिथी. Shubh muhurat marathi {YEAR}. वैदिक पंचांग आधारित अचूक मुहूर्त.`

**Keywords:**
```
शुभ मुहूर्त, विवाह मुहूर्त, गृहप्रवेश मुहूर्त, वास्तुशांती मुहूर्त, व्यापार मुहूर्त, लग्न मुहूर्त मराठी {YEAR},
shubh muhurat marathi, vivah muhurat marathi, gruhapravesh muhurat, marriage muhurat marathi, lagna muhurat,
shubh muhurat, marriage muhurat, griha pravesh muhurat, auspicious time
```

### `/en/muhurat`

**Title:** `Shubh Muhurat Finder — Marriage, Griha Pravesh Marathi | Bhaagyavedh`

**Description:** `Find shubh muhurat for marriage, griha pravesh, vastushanti, business. Vivah muhurat marathi {YEAR}. Based on Vedic panchang — tithi, nakshatra, yoga.`

**Keywords:**
```
shubh muhurat, marriage muhurat, griha pravesh muhurat, vastushanti muhurat, auspicious time {YEAR},
shubh muhurat marathi, vivah muhurat marathi, gruhapravesh marathi, marriage muhurat marathi,
शुभ मुहूर्त, विवाह मुहूर्त
```

---

## 9. Graha Sthiti (`/mr/graha-sthiti` and `/en/graha-sthiti`)

### `/mr/graha-sthiti`

**Title:** `आजची ग्रह स्थिती — ९ ग्रह संचार | Graha Sthiti Marathi | भाग्यवेध`

**Description:** `आजची ग्रह स्थिती — सूर्य, चंद्र, मंगळ, बुध, गुरू, शुक्र, शनी, राहू, केतू. Aaj chi graha sthiti marathi. वास्तविक ग्रह गोचर आणि संचार.`

**Keywords:**
```
ग्रह स्थिती, ग्रह संचार, आजचे ग्रह, ग्रह गोचर, 9 ग्रह स्थिती, वैदिक ग्रह,
aaj chi graha sthiti, graha sthiti marathi, planetary position marathi,
planetary positions today, vedic planets today, graha gochar
```

### `/en/graha-sthiti`

**Title:** `Planetary Positions Today — 9 Grahas Live | Graha Sthiti | Bhaagyavedh`

**Description:** `Live planetary positions — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu. Real-time vedic graha sthiti with rashi and nakshatra positions.`

**Keywords:**
```
planetary positions today, graha sthiti, vedic planets, graha gochar, 9 grahas, planetary transit,
graha sthiti marathi, aaj chi graha sthiti, planetary position marathi,
ग्रह स्थिती, ग्रह गोचर
```

---

## 10. Compare (`/mr/compare` and `/en/compare`)

### `/mr/compare`

**Title:** `दोन कुंडलींची तुलना — Kundli Compare Marathi | भाग्यवेध`

**Description:** `दोन कुंडली एकत्र पाहा आणि तुलना करा. ग्रह स्थिती, नवमांश, दशा यांची तुलना. Kundali compare marathi, do kundalikanchi tulna.`

**Keywords:**
```
कुंडली तुलना, दोन कुंडली तुलना, कुंडली compare, कुंडली मेळ मराठी,
kundali compare marathi, two kundali comparison, kundli tulna,
kundli compare, two charts comparison, synastry chart
```

### `/en/compare`

**Title:** `Compare Two Kundlis Side by Side — Chart Comparison | Bhaagyavedh`

**Description:** `Compare two janam kundlis side by side. View planetary positions, navamsha, dashas together. Free kundali compare tool in Marathi and English.`

**Keywords:**
```
kundli compare, compare two kundlis, chart comparison, synastry vedic, kundali comparison,
kundali compare marathi, kundli tulna,
कुंडली तुलना, कुंडली compare
```

---

## 11. Consultation (`/mr/consultation` and `/en/consultation`)

### `/mr/consultation`

**Title:** `ज्योतिष सल्ला — वैदिक ज्योतिष तज्ञांशी संपर्क | Astrology Consultation Marathi | भाग्यवेध`

**Description:** `अनुभवी वैदिक ज्योतिष तज्ञांकडून कुंडली विश्लेषण, दशा, उपाय यांचा सल्ला घ्या. Jyotish salla marathi pune. फोन, व्हिडिओ सल्ला उपलब्ध.`

**Keywords:**
```
ज्योतिष सल्ला, कुंडली सल्ला, दशा सल्ला, वैदिक ज्योतिष तज्ञ, पुणे ज्योतिषी, ज्योतिषी मराठी,
jyotish salla marathi, astrologer marathi, kundli consultation marathi, pune jyotishi,
astrology consultation, vedic astrologer online, online jyotish consultation
```

### `/en/consultation`

**Title:** `Astrology Consultation — Vedic Jyotish in Marathi & English | Bhaagyavedh`

**Description:** `Get personalized Vedic astrology consultation from experienced jyotish experts. Kundli analysis, dasha reading, remedies. Jyotish salla marathi in Pune — phone or video.`

**Keywords:**
```
astrology consultation, vedic astrologer online, jyotish consultation, kundli consultation, online astrologer,
jyotish salla marathi, astrologer marathi, pune jyotishi,
ज्योतिष सल्ला, वैदिक ज्योतिष तज्ञ
```

---

## 12. Pooja Services (`/mr/pooja-services` and `/en/pooja-services`)

### `/mr/pooja-services`

**Title:** `पूजा सेवा — ग्रह शांती, वास्तुशांती, नवग्रह पूजा पुणे | Pooja Services Marathi | भाग्यवेध`

**Description:** `पुण्यात पूजा, पाठ, होम सेवा — ग्रह शांती पूजा, नवग्रह पूजा, वास्तुशांती, सत्यनारायण पूजा. Pooja services marathi pune. अनुभवी गुरुजी.`

**Keywords:**
```
पूजा सेवा पुणे, ग्रह शांती पूजा, नवग्रह पूजा, वास्तुशांती पूजा, सत्यनारायण पूजा, महामृत्युंजय जप, मंगळ शांती,
pooja services pune, pooja marathi, navgraha pooja marathi, vastushanti marathi, satyanarayan pooja,
pooja services, pooja online booking, vedic pooja, brahmin pooja pune
```

### `/en/pooja-services`

**Title:** `Pooja Services Pune — Graha Shanti, Vastushanti, Navagraha | Bhaagyavedh`

**Description:** `Book authentic Vedic pooja services in Pune — graha shanti, navagraha pooja, vastushanti, satyanarayan pooja, mahamrityunjay jap. Experienced brahmin gurujis.`

**Keywords:**
```
pooja services pune, graha shanti pooja, navagraha pooja, vastushanti, satyanarayan pooja, mahamrityunjay jap,
pooja marathi, navgraha pooja marathi, vastushanti marathi,
पूजा सेवा पुणे, ग्रह शांती पूजा, नवग्रह पूजा
```

---

## 13. Yatra (`/mr/yatra` and `/en/yatra`)

### `/mr/yatra`

**Title:** `तीर्थयात्रा पॅकेज — ज्योतिर्लिंग, चारधाम, अष्टविनायक | Yatra Packages Marathi | भाग्यवेध`

**Description:** `पुणे मधून तीर्थयात्रा — १२ ज्योतिर्लिंग, चारधाम, अष्टविनायक, शक्तिपीठ, पंचप्रयाग. Yatra package marathi pune. सर्व व्यवस्था, गाइड, भोजन सोबत.`

**Keywords:**
```
तीर्थयात्रा, ज्योतिर्लिंग यात्रा, चारधाम यात्रा, अष्टविनायक यात्रा, शक्तिपीठ यात्रा, पंचप्रयाग यात्रा, यात्रा पॅकेज पुणे,
yatra package marathi, jyotirlinga yatra marathi, char dham marathi, ashtavinayak yatra marathi,
pilgrimage tour, jyotirlinga darshan, char dham yatra, ashtavinayak yatra
```

### `/en/yatra`

**Title:** `Pilgrimage Tour Packages — Jyotirlinga, Char Dham, Ashtavinayak | Bhaagyavedh`

**Description:** `Guided pilgrimage packages from Pune — 12 Jyotirlinga, Char Dham, Ashtavinayak, Shakti Peeth, Panch Prayag. Yatra packages in Marathi with full travel arrangements.`

**Keywords:**
```
pilgrimage tour, jyotirlinga yatra, char dham yatra, ashtavinayak yatra, shakti peeth yatra, pilgrimage pune,
yatra package marathi, jyotirlinga yatra marathi, char dham marathi,
तीर्थयात्रा, ज्योतिर्लिंग यात्रा, अष्टविनायक यात्रा
```

---

## 14. Yatra Category Pages (dynamic, 5 categories)

Pattern: `/mr/yatra/{slug}` and `/en/yatra/{slug}`

Categories: `jyotirlinga`, `char-dham`, `ashtavinayak`, `shakti-peeth`, `panch-prayag`

### Example `/mr/yatra/ashtavinayak`

**Title:** `अष्टविनायक यात्रा — ८ गणपती दर्शन पॅकेज | Ashtavinayak Yatra Marathi | भाग्यवेध`

**Description:** `अष्टविनायक ८ गणपती दर्शन यात्रा पॅकेज. मोरगाव, थेऊर, सिद्धटेक, रांजणगाव, ओझर, लेण्याद्री, महड, पाली. Ashtavinayak yatra marathi pune.`

**Keywords:**
```
अष्टविनायक यात्रा, ८ गणपती दर्शन, अष्टविनायक पॅकेज, मोरगाव गणपती, सिद्धटेक, महाराष्ट्र तीर्थयात्रा,
ashtavinayak yatra marathi, ashtavinayak package pune, 8 ganpati darshan,
ashtavinayak yatra, 8 ganesh temples, morgaon ganpati, siddhatek
```

### Pattern for others:

- **`/mr/yatra/jyotirlinga`** — "१२ ज्योतिर्लिंग यात्रा | Jyotirlinga Yatra Marathi"
- **`/mr/yatra/char-dham`** — "चारधाम यात्रा — बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री | Char Dham Marathi"
- **`/mr/yatra/shakti-peeth`** — "शक्तिपीठ यात्रा | Shakti Peeth Yatra Marathi"
- **`/mr/yatra/panch-prayag`** — "पंचप्रयाग यात्रा | Panch Prayag Yatra Marathi"

---

## 15. Temples Index (`/mr/temples` and `/en/temples`)

### `/mr/temples`

**Title:** `भारतातील प्रसिद्ध मंदिरे — दर्शन माहिती | Temples Guide Marathi | भाग्यवेध`

**Description:** `५०+ प्रसिद्ध हिंदू मंदिरांची माहिती — दर्शन वेळ, इतिहास, पोहोचण्याचा मार्ग. Famous mandir marathi, temples in india, hindu temple guide.`

**Keywords:**
```
प्रसिद्ध मंदिरे, हिंदू मंदिरे, ज्योतिर्लिंग, मंदिर दर्शन, मंदिर माहिती मराठी,
famous mandir marathi, hindu temples marathi, jyotirlinga marathi, temple guide marathi,
hindu temples, famous mandir, temple guide india, jyotirlinga temples
```

### `/en/temples`

**Title:** `Famous Hindu Temples Guide — Darshan, History, Travel | Bhaagyavedh`

**Description:** `Comprehensive guide to 50+ famous Hindu temples in India. Darshan timings, history, how to reach. Marathi and English info for Jyotirlingas, Shakti Peeths, Divya Desams.`

**Keywords:**
```
hindu temples, famous mandir india, temple guide, jyotirlinga temples, shakti peeth, divya desam,
famous mandir marathi, hindu temples marathi, jyotirlinga marathi,
हिंदू मंदिरे, प्रसिद्ध मंदिरे, ज्योतिर्लिंग
```

---

## 16. Temple Detail (`/{lang}/temples/{id}`)

Pattern: read temple data, generate per-temple

### Template `/mr/temples/{id}`

```tsx
Title: `${temple.nameMr} मंदिर — दर्शन वेळ, इतिहास, कसे पोहोचाल | ${temple.locationMr} | भाग्यवेध`
Description: `${temple.nameMr} (${temple.location}) मंदिर — दर्शन वेळ, इतिहास, पोहोचण्याचा मार्ग, निवास व्यवस्था. ${temple.nameEn} temple marathi guide.`
```

### Template `/en/temples/{id}`

```tsx
Title: `${temple.nameEn} Temple — Darshan Timings, History, How to Reach | Bhaagyavedh`
Description: `Complete ${temple.nameEn} temple guide — darshan timings, history, how to reach, accommodation. ${temple.nameMr} mandir information in Marathi.`
```

### Keywords pattern:
```
{templeNameMr} मंदिर, {templeNameMr} दर्शन, {templeNameMr} माहिती, {locationMr} मंदिरे,
{templeRoman} temple marathi, {templeRoman} mandir,
{templeNameEn} temple, {templeNameEn} darshan, {templeNameEn} history
```

---

## 17. Blog Index (`/mr/blog` and `/en/blog`)

### `/mr/blog`

**Title:** `दैनिक ब्लॉग — ज्योतिष, सण, व्रत लेख मराठी | Astrology Blog Marathi | भाग्यवेध`

**Description:** `दैनिक मराठी ज्योतिष ब्लॉग — राशीभविष्य लेख, सण महत्व, व्रत कथा, उपाय, पंचांग विशेष. Marathi astrology blog.`

**Keywords:**
```
मराठी ज्योतिष ब्लॉग, राशीभविष्य लेख, सण माहिती मराठी, व्रत कथा, ज्योतिष उपाय लेख,
astrology blog marathi, marathi jyotish blog, rashi bhavishya articles,
astrology blog, vedic blog, daily astrology articles
```

### `/en/blog`

**Title:** `Astrology Blog — Marathi Vedic Articles, Festivals, Remedies | Bhaagyavedh`

**Description:** `Daily astrology blog — Marathi vedic articles on horoscope, festivals, vrat, remedies, panchang. Read in Marathi and English.`

**Keywords:**
```
astrology blog, vedic astrology articles, daily astrology, festival articles, astrology remedies,
astrology blog marathi, marathi jyotish blog,
मराठी ज्योतिष ब्लॉग, राशीभविष्य लेख
```

---

## 18. Blog Post (`/{lang}/blog/{slug}`)

Per-post metadata from JSON frontmatter. Pattern:

```tsx
Title: `${post.titleMr} — ${post.titleEn} | भाग्यवेध`     // /mr/
Title: `${post.titleEn} — ${post.titleMr} | Bhaagyavedh`   // /en/
Description: first 160 chars of post body
Keywords: post.tags + language-specific blog keywords
```

---

## 19. Sangrah Index (`/mr/sangrah` and `/en/sangrah`)

### `/mr/sangrah`

**Title:** `संग्रह — आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा मराठी | Sangrah Marathi | भाग्यवेध`

**Description:** `मराठी संग्रह — आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, दैनिक प्रार्थना, नामावली. Marathi aarti, stotra, chalisa, vrat katha collection.`

**Keywords:**
```
मराठी आरती, मराठी स्तोत्र, चालीसा मराठी, मंत्र मराठी, व्रत कथा मराठी, दैनिक प्रार्थना,
marathi aarti, marathi stotra, chalisa marathi, mantra marathi, vrat katha marathi,
aarti collection, sanskrit stotra, hindu chalisa, vrat katha
```

### `/en/sangrah`

**Title:** `Sangrah — Aarti, Stotra, Chalisa, Mantra, Vrat Katha in Sanskrit & Marathi | Bhaagyavedh`

**Description:** `Complete collection of aartis, stotras, chalisas, mantras, vrat kathas in Sanskrit and Marathi with English meaning. Marathi aarti sangrah.`

**Keywords:**
```
aarti collection, sanskrit stotra, hindu chalisa, mantra list, vrat katha english,
marathi aarti, marathi stotra, chalisa marathi, vrat katha marathi,
मराठी आरती, मराठी स्तोत्र
```

---

## 20. Sangrah Category (`/{lang}/sangrah/{category}`)

Categories: aarti, stotra, chalisa, mantra, vrat-katha, daily-prayers, namavali

### Template `/mr/sangrah/aarti`

```tsx
Title: `मराठी आरती संग्रह — गणपती, शिव, विष्णू, देवी | Aarti Marathi | भाग्यवेध`
Description: `मराठी आरती संग्रह — गणपती आरती, शिव आरती, विष्णू आरती, देवी आरती, ज्ञानदेव आरती. मुळ संस्कृत टेक्स्ट आणि अर्थ.`
```

### Template `/en/sangrah/aarti`

```tsx
Title: `Marathi Aarti Collection — Ganpati, Shiva, Vishnu, Devi | Bhaagyavedh`
Description: `Complete collection of marathi aartis — Ganpati aarti, Shiva aarti, Vishnu aarti, Devi aartis. Sanskrit text with Marathi and English meaning.`
```

---

## 21. Sangrah Detail (`/{lang}/sangrah/{category}/{slug}`)

Per-item metadata from item data.

```tsx
Title: `${item.title} — ${item.titleEn} | ${item.deityMr} आरती/स्तोत्र | भाग्यवेध`
Description: `${item.title} — संपूर्ण संस्कृत पाठ, मराठी लिप्यंतर आणि अर्थ. ${item.titleEn} lyrics and meaning.`
```

---

## 22. About (`/mr/about` and `/en/about`)

### `/mr/about`

**Title:** `आमच्याबद्दल — Bhaagyavedh Marathi ज्योतिष प्लॅटफॉर्म | भाग्यवेध`

**Description:** `भाग्यवेध (Bhaagyavedh) — पुण्यातील विश्वसनीय मराठी वैदिक ज्योतिष प्लॅटफॉर्म. कुंडली, गुण मिलान, पंचांग, तीर्थयात्रा सेवा. आमच्याबद्दल जाणून घ्या.`

**Keywords:**
```
भाग्यवेध आमच्याबद्दल, Bhaagyavedh मराठी, वैदिक ज्योतिष पुणे, मराठी ज्योतिष प्लॅटफॉर्म,
bhaagyavedh about, pune astrology platform, marathi jyotish,
about bhaagyavedh, vedic astrology pune, marathi astrology platform
```

### `/en/about`

**Title:** `About Bhaagyavedh — Vedic Astrology Platform Pune | Marathi & English`

**Description:** `Learn about Bhaagyavedh — trusted Vedic astrology platform from Pune offering free kundli, rashifal, matching, panchang, and pilgrimage services in Marathi and English.`

**Keywords:**
```
about bhaagyavedh, vedic astrology pune, marathi astrology platform, pune jyotish,
bhaagyavedh marathi, pune astrology platform, marathi jyotish,
भाग्यवेध आमच्याबद्दल, Bhaagyavedh मराठी
```

---

## 23. Contact (`/mr/contact` and `/en/contact`)

### `/mr/contact`

**Title:** `संपर्क — भाग्यवेध पुणे | Contact Marathi | भाग्यवेध`

**Description:** `भाग्यवेध पुणे — संपर्क करा ज्योतिष, पूजा, तीर्थयात्रा बुकिंगसाठी. फोन, ईमेल, पत्ता. Contact Bhaagyavedh Pune.`

**Keywords:**
```
भाग्यवेध संपर्क, पुणे ज्योतिषी संपर्क, Bhaagyavedh पुणे,
bhaagyavedh contact, pune astrologer contact,
contact bhaagyavedh, pune astrology contact
```

### `/en/contact`

**Title:** `Contact Bhaagyavedh — Astrology & Pooja Services Pune | Bhaagyavedh`

**Description:** `Contact Bhaagyavedh Pune for astrology consultation, pooja services, yatra bookings. Phone, email, address in Kothrud, Pune.`

**Keywords:**
```
contact bhaagyavedh, pune astrology contact, kothrud astrology, pooja booking pune,
bhaagyavedh contact, pune astrologer contact,
भाग्यवेध संपर्क, पुणे ज्योतिषी
```

---

## 24. Legal Pages (Privacy, Terms, Disclaimer)

Low-priority for keywords but still get lang-specific meta.

### `/mr/privacy`

**Title:** `गोपनीयता धोरण — Privacy Policy Marathi | भाग्यवेध`
**Description:** `भाग्यवेध गोपनीयता धोरण — आपल्या डेटाची सुरक्षा आणि वापरण्याविषयी माहिती. Privacy policy marathi.`

### `/en/privacy`

**Title:** `Privacy Policy — Bhaagyavedh`
**Description:** `Bhaagyavedh privacy policy — how we collect, use, and protect your data. Available in Marathi and English.`

### `/mr/terms`

**Title:** `अटी व शर्ती — Terms Marathi | भाग्यवेध`
**Description:** `भाग्यवेध अटी व शर्ती — वेबसाइट वापर नियम. Terms and conditions marathi.`

### `/en/terms`

**Title:** `Terms and Conditions — Bhaagyavedh`
**Description:** `Bhaagyavedh terms and conditions for website usage. Available in Marathi and English.`

### `/mr/disclaimer`

**Title:** `अस्वीकरण — Disclaimer Marathi | भाग्यवेध`
**Description:** `भाग्यवेध अस्वीकरण — ज्योतिष हे मार्गदर्शनासाठी आहे, अंतिम निर्णयासाठी नाही.`

### `/en/disclaimer`

**Title:** `Disclaimer — Bhaagyavedh`
**Description:** `Bhaagyavedh disclaimer — astrology is for guidance, not final decisions. Available in Marathi and English.`

---

## Roman-Marathi Keyword Master List (reuse across pages)

### Astrology core
```
mofat kundli, mofat kundali, janam kundli marathi, janam kundali, kundali maker marathi
aajcha rashifal, ajjcha rashifal, aaj cha rashi bhavishya, aajcha rashi bhavishya, daily rashifal marathi
gun milan marathi, gun milaan, kundali matching marathi, ashtakoot marathi
panchang marathi, aaj cha panchang, aajcha panchang, rahu kaal marathi
shubh muhurat marathi, vivah muhurat marathi, gruhapravesh marathi
jyotish salla marathi, pune jyotishi, astrologer marathi
```

### Religious
```
marathi aarti, marathi stotra, chalisa marathi, mantra marathi, vrat katha marathi
pooja services pune, navgraha pooja marathi, vastushanti marathi, satyanarayan pooja
```

### Travel/Yatra
```
yatra package marathi, jyotirlinga yatra marathi, char dham marathi, ashtavinayak yatra marathi
tirthyatra package pune, pilgrimage marathi
```

### Signs (Roman transliteration)
```
mesh rashi, vrishabh rashi, mithun rashi, kark rashi, singh rashi, kanya rashi,
tula rashi, vrishchik rashi, dhanu rashi, makar rashi, kumbh rashi, meen rashi
```

---

## Implementation Notes

1. **Phase 2 task:** Replace current `pageMeta({...})` calls with lang-aware version that picks MR or EN metadata based on route param
2. **Helper function:** Create `src/lib/seo-keywords.ts` exporting `getPageMeta(page: string, lang: Lang)` returning title/description/keywords object
3. **Dynamic substitution:** For templates like rashi pages, use `{mr}`, `{en}`, `{romanMr}` placeholders filled at build time
4. **Roman transliteration rule:** When unsure, pick simpler/more common variant (e.g., `vrishabh` not `vrushabha`)
5. **Max keyword count:** 15–25 per page. Don't stuff.
6. **Meta description:** 150–160 chars optimal. Can push to 170.
7. **Title:** 55–70 chars. Include brand at end.

---

## Priority Order For Rollout

1. **Top 5 revenue/traffic pages first:**
   - `/` (home)
   - `/kundli`
   - `/rashifal` + 12 sign pages
   - `/matching`
   - `/panchang`
2. **High-intent service pages:**
   - `/consultation`
   - `/pooja-services`
   - `/yatra` + category pages
3. **Content pages:**
   - `/blog` + top 10 posts
   - `/sangrah` + top items
4. **Informational:**
   - `/about`, `/contact`
5. **Legal (lowest priority):**
   - `/privacy`, `/terms`, `/disclaimer`
