/**
 * Planet-in-rashi predictions — 108 snippets (9 planets × 12 rashis).
 * Based on BPHS Ch. 3 (Planetary Dignities) + classical rashi-fal tradition.
 * Key: `${planetId}-${rashiIndex}` where rashiIndex 0=Aries .. 11=Pisces.
 * Dignity markers included (exalt/debil/own/MT) to reflect classical strength.
 */

import type { BilingualSnippet } from "./types";

export const PLANET_IN_RASHI: Record<string, BilingualSnippet> = {
  // ─── SUN ───────────────────────────────────────────────────
  "Sun-0": {
    mr: "सूर्य मेष राशीत (उच्च) — अत्यंत तेजस्वी व्यक्तिमत्त्व, धाडसी नेतृत्व, आत्मविश्वास चरमावर. सैन्य-पोलिस-शल्यचिकित्सा क्षेत्रात अग्रगण्य. स्वाभिमान उत्तम.",
    en: "Sun in Aries (Exalted) — extremely brilliant personality, bold leadership, peak confidence. Frontrunner in military/police/surgery. Excellent self-respect.",
  },
  "Sun-1": {
    mr: "सूर्य वृषभ राशीत — कलाप्रेमी, धीरगंभीर, धनप्रेम. स्थिर स्वभाव. संगीत-सौंदर्य-शेती क्षेत्रात रुचि. हळू पण स्थायी यश.",
    en: "Sun in Taurus — art-loving, patient, wealth-oriented. Steady nature. Interest in music/beauty/agriculture. Slow but lasting success.",
  },
  "Sun-2": {
    mr: "सूर्य मिथुन राशीत — बुद्धिमान, संवादकुशल, द्विस्वभावी. लेखन-शिक्षण-मीडियात यश. बहुमुखी. निर्णयात अस्थिरता.",
    en: "Sun in Gemini — intelligent, communicative, dual-natured. Success in writing/education/media. Versatile. Decision-instability.",
  },
  "Sun-3": {
    mr: "सूर्य कर्क राशीत — भावनिक नेतृत्व, मातृ-प्रभाव, मनःप्रधान. जलसंबंधी व्यवसायात यश. कौटुंबिक जबाबदाऱ्या.",
    en: "Sun in Cancer — emotional leadership, maternal influence, mind-dominated. Success in water-related business. Family responsibilities.",
  },
  "Sun-4": {
    mr: "सूर्य सिंह राशीत (स्वगृही + मूलत्रिकोण) — राजसी व्यक्तिमत्त्व, उत्तम नेतृत्व, सत्ता-कीर्ती. शासकीय कृपा प्रचंड. सर्वोच्च राजयोग.",
    en: "Sun in Leo (Own + Moolatrikona) — regal personality, excellent leadership, power-fame. Immense govt favor. Supreme Raja Yoga.",
  },
  "Sun-5": {
    mr: "सूर्य कन्या राशीत — विश्लेषक, सेवाभावी, तपशीलवार. आरोग्य-लेखन-वैद्यकीय क्षेत्रात यश. अंहकार मध्यम.",
    en: "Sun in Virgo — analytical, service-minded, detail-oriented. Success in health/writing/medical. Moderate ego.",
  },
  "Sun-6": {
    mr: "सूर्य तूळ राशीत (नीच) — आत्मविश्वासात घट, स्वप्रतिमेत गोंधळ, न्यायप्रिय. कला-मुत्सद्देगिरी जमते. इतरांवर अवलंबित्व.",
    en: "Sun in Libra (Debilitated) — diminished confidence, self-image confusion, justice-loving. Arts/diplomacy suit. Dependence on others.",
  },
  "Sun-7": {
    mr: "सूर्य वृश्चिक राशीत — तीव्र, गूढ, संशोधक नेतृत्व. शस्त्रक्रिया-गुप्तसेवा-ज्योतिष क्षेत्रात यश. परिवर्तनकारी शक्ती.",
    en: "Sun in Scorpio — intense, mystical, researcher-leader. Success in surgery/intelligence/astrology. Transformative power.",
  },
  "Sun-8": {
    mr: "सूर्य धनु राशीत — धार्मिक नेता, शिक्षक-न्यायाधीश, उच्च तत्त्वज्ञान. गुरु-प्रवृत्ती. परदेशी कीर्ती. विस्तृत व्यक्तिमत्त्व.",
    en: "Sun in Sagittarius — religious leader, teacher-judge, high philosophy. Guru-nature. Foreign fame. Expansive personality.",
  },
  "Sun-9": {
    mr: "सूर्य मकर राशीत — कठोर-शिस्तबद्ध नेतृत्व, दीर्घकालीन कर्म, राजकीय-प्रशासकीय यश. श्रमातून सत्ता. व्यावहारिक.",
    en: "Sun in Capricorn — strict-disciplined leadership, long-term karma, political-administrative success. Power through labor. Practical.",
  },
  "Sun-10": {
    mr: "सूर्य कुंभ राशीत — अपारंपारिक नेतृत्व, सुधारक, मानवतावादी. समाजसेवा-नवकल्पना क्षेत्रात यश. स्वातंत्र्य-प्रिय.",
    en: "Sun in Aquarius — unconventional leadership, reformer, humanitarian. Success in social service/innovation. Freedom-loving.",
  },
  "Sun-11": {
    mr: "सूर्य मीन राशीत — आध्यात्मिक नेतृत्व, करुणामय, कलात्मक. अंतर्मुखी. आध्यात्म-सेवेत कीर्ती. स्वप्नदर्शी.",
    en: "Sun in Pisces — spiritual leadership, compassionate, artistic. Introverted. Fame in spirituality/service. Visionary.",
  },

  // ─── MOON ──────────────────────────────────────────────────
  "Moon-0": {
    mr: "चंद्र मेष राशीत — तेजस्वी-भावनिक, अधीर मन, स्वतंत्र विचार. अचानक निर्णय. रागीट पण हृदयाने साफ. नेतृत्वगुण.",
    en: "Moon in Aries — brilliant-emotional, impatient mind, independent thinking. Quick decisions. Irritable but pure-hearted. Leadership.",
  },
  "Moon-1": {
    mr: "चंद्र वृषभ राशीत (उच्च) — शांत-स्थिर मन, सौंदर्य-कला-संगीतप्रेमी, मानसिक समतोल उत्तम. कौटुंबिक सुख. मधुर स्वर.",
    en: "Moon in Taurus (Exalted) — calm-steady mind, beauty/art/music-loving, excellent mental balance. Family joy. Sweet voice.",
  },
  "Moon-2": {
    mr: "चंद्र मिथुन राशीत — चंचल मन, बहुमुखी, संवाद-लेखनात प्रावीण्य. एकाच वेळी अनेक कामे. कल्पक विचार.",
    en: "Moon in Gemini — restless mind, versatile, mastery in communication/writing. Multi-tasker. Imaginative thinking.",
  },
  "Moon-3": {
    mr: "चंद्र कर्क राशीत (स्वगृही) — संवेदनशील-भावनाप्रधान, मातृ-प्रेम अत्युच्च, मनःशांती. अंतर्ज्ञान तीव्र. कौटुंबिक-प्रेम.",
    en: "Moon in Cancer (Own) — sensitive-emotional, peak maternal love, mental peace. Intense intuition. Family love.",
  },
  "Moon-4": {
    mr: "चंद्र सिंह राशीत — आत्मविश्वासी-गर्विष्ठ मन, उदार, नेतृत्व-प्रिय. मान-सन्मानाची आस. राजेशाही वृत्ती.",
    en: "Moon in Leo — confident-proud mind, generous, leadership-loving. Desire for honor. Regal nature.",
  },
  "Moon-5": {
    mr: "चंद्र कन्या राशीत — विश्लेषक-तपशीलवार मन, आरोग्याची काळजी, परिपूर्णतावादी. सेवाभावी. कधीकधी अतिचिंतेचे भार.",
    en: "Moon in Virgo — analytical-detailed mind, health-conscious, perfectionist. Service-minded. Sometimes over-worry burden.",
  },
  "Moon-6": {
    mr: "चंद्र तूळ राशीत — समतोल मन, सौंदर्यप्रेमी, न्यायप्रिय, सहजीवनात सुख. नातेसंबंधांत कुशल. कधी निर्णयात अडथळा.",
    en: "Moon in Libra — balanced mind, beauty-loving, justice-oriented, joy in partnerships. Skilled in relationships. Sometimes decision-block.",
  },
  "Moon-7": {
    mr: "चंद्र वृश्चिक राशीत (नीच) — तीव्र-गूढ भावना, संशयी, रहस्य-प्रिय. भावनिक चढ-उतार. गूढ विद्यांमध्ये रुचि.",
    en: "Moon in Scorpio (Debilitated) — intense-mystical emotions, suspicious, secret-loving. Emotional turbulence. Interest in occult.",
  },
  "Moon-8": {
    mr: "चंद्र धनु राशीत — आशावादी-तत्त्वज्ञानी मन, धार्मिक, साहसी. तीर्थप्रेमी. विस्तृत दृष्टिकोन. उच्च नैतिकता.",
    en: "Moon in Sagittarius — optimistic-philosophical mind, religious, adventurous. Pilgrimage-loving. Broad outlook. High morals.",
  },
  "Moon-9": {
    mr: "चंद्र मकर राशीत — गंभीर-व्यावहारिक मन, जबाबदार, महत्त्वाकांक्षी. भावनांवर नियंत्रण. कधी मानसिक ताण.",
    en: "Moon in Capricorn — serious-practical mind, responsible, ambitious. Control over emotions. Sometimes mental strain.",
  },
  "Moon-10": {
    mr: "चंद्र कुंभ राशीत — मानवतावादी-मुक्त विचार, नवकल्पना, स्वातंत्र्य. सामाजिक मैत्री. कधी भावनिक अंतर.",
    en: "Moon in Aquarius — humanitarian-free thinking, innovative, independent. Social friendships. Sometimes emotional distance.",
  },
  "Moon-11": {
    mr: "चंद्र मीन राशीत — अंतर्ज्ञानी-कलात्मक, करुणा, आध्यात्मिक. स्वप्नदर्शी. अतिसंवेदनशील. काव्य-कला-मानसशास्त्र प्रिय.",
    en: "Moon in Pisces — intuitive-artistic, compassionate, spiritual. Dreamy. Hypersensitive. Poetry/art/psychology-loving.",
  },

  // ─── MARS ──────────────────────────────────────────────────
  "Mars-0": {
    mr: "मंगळ मेष राशीत (स्वगृही + मूलत्रिकोण) — अपार पराक्रम, धाडसी योद्धा, सैन्य-क्रीडा-शल्यक्रियेत शिरोमणी. स्व-बळाने यश. नेतृत्व अप्रतिम.",
    en: "Mars in Aries (Own + Moolatrikona) — immense valor, bold warrior, topmost in military/sports/surgery. Success through self-might. Unmatched leadership.",
  },
  "Mars-1": {
    mr: "मंगळ वृषभ राशीत — स्थिर पराक्रम, धन-सुरक्षेसाठी लढा, कलात्मक-भौतिक यश. अडगट स्वभाव. हट्टी परिश्रमी.",
    en: "Mars in Taurus — steady valor, fight for wealth/security, artistic-material success. Stubborn nature. Tenacious hardworker.",
  },
  "Mars-2": {
    mr: "मंगळ मिथुन राशीत — शब्दांचे शस्त्र, तर्कशक्ती, वादविवाद-कौशल्य. लेखन-संवाद-तंत्रज्ञानात ऊर्जा. चंचल पराक्रम.",
    en: "Mars in Gemini — weapon of words, reasoning power, debate skill. Energy in writing/communication/technology. Restless valor.",
  },
  "Mars-3": {
    mr: "मंगळ कर्क राशीत (नीच) — भावनिक चढ-उतार, कुटुंबात तंटे, रागावर नियंत्रण नाही. अंतर्गत संघर्ष. पराक्रम दुर्बळ.",
    en: "Mars in Cancer (Debilitated) — emotional turbulence, family disputes, uncontrolled anger. Internal conflict. Weakened valor.",
  },
  "Mars-4": {
    mr: "मंगळ सिंह राशीत — राजेशाही पराक्रम, उदार योद्धा, नेतृत्वगुणी. सरकारी-सैन्य क्षेत्रात कीर्ती. अहंकाराची जोखीम.",
    en: "Mars in Leo — regal valor, generous warrior, leadership. Fame in govt/military. Ego risk.",
  },
  "Mars-5": {
    mr: "मंगळ कन्या राशीत — विश्लेषक-तपशीलवार पराक्रम, अभियंता-वैद्य, कार्य-कुशलता. परिपूर्णतावादी. पण अति-टीका टाळा.",
    en: "Mars in Virgo — analytical-detailed valor, engineer-doctor, work-efficiency. Perfectionist. Avoid over-criticism.",
  },
  "Mars-6": {
    mr: "मंगळ तूळ राशीत — मुत्सद्दी पराक्रम, जोडीदारामार्फत विवाद, कलात्मक संघर्ष. न्यायासाठी लढा. समतोल कठीण.",
    en: "Mars in Libra — diplomatic valor, disputes via spouse, artistic conflict. Fight for justice. Balance difficult.",
  },
  "Mars-7": {
    mr: "मंगळ वृश्चिक राशीत (स्वगृही) — तीव्र-गूढ पराक्रम, संशोधक-शल्य-गुप्तसेवा, परिवर्तनकारी. गूढविद्यांमध्ये सिद्धी.",
    en: "Mars in Scorpio (Own) — intense-mystical valor, researcher-surgeon-intelligence, transformative. Mastery in occult.",
  },
  "Mars-8": {
    mr: "मंगळ धनु राशीत — धार्मिक योद्धा, तीर्थ-प्रचारक, साहसी प्रवास. नैतिक पराक्रम. तत्त्व-संघर्ष. उच्च शिक्षणात ऊर्जा.",
    en: "Mars in Sagittarius — religious warrior, pilgrim-preacher, adventurous travels. Moral valor. Ideological struggles. Energy in higher education.",
  },
  "Mars-9": {
    mr: "मंगळ मकर राशीत (उच्च) — अत्युच्च पराक्रम, शिस्तबद्ध-धोरणी योद्धा, कर्मकुशल. प्रशासकीय-सैन्य क्षेत्रात सर्वोच्च. महान राजयोग.",
    en: "Mars in Capricorn (Exalted) — peak valor, disciplined-strategic warrior, karma-skilled. Top in administration/military. Great Raja Yoga.",
  },
  "Mars-10": {
    mr: "मंगळ कुंभ राशीत — सुधारक पराक्रम, क्रांतिकारी, तंत्रज्ञान-सामाजिक कार्यात ऊर्जा. अपारंपारिक लढाया.",
    en: "Mars in Aquarius — reformist valor, revolutionary, energy in technology/social causes. Unconventional battles.",
  },
  "Mars-11": {
    mr: "मंगळ मीन राशीत — करुणामय योद्धा, कलात्मक-आध्यात्मिक पराक्रम. स्पष्ट दिशा कठीण. अंतर्गत लढाया. संवेदनशील.",
    en: "Mars in Pisces — compassionate warrior, artistic-spiritual valor. Clear direction difficult. Internal battles. Sensitive.",
  },

  // ─── MERCURY ───────────────────────────────────────────────
  "Mercury-0": {
    mr: "बुध मेष राशीत — धाडसी-तीक्ष्ण बुद्धी, अचानक निर्णय, तर्क-वादविवाद कुशल. अधीर पण चपळ मन. नेतृत्वात लेखन.",
    en: "Mercury in Aries — bold-sharp intellect, quick decisions, skilled in logic/debate. Impatient but agile mind. Leadership in writing.",
  },
  "Mercury-1": {
    mr: "बुध वृषभ राशीत — स्थिर-व्यावहारिक बुद्धी, आर्थिक गणन, कला-संगीतज्ञ. धन-व्यवस्थापनात यश. निर्णय विचारपूर्वक.",
    en: "Mercury in Taurus — steady-practical intellect, financial computation, arts/music knowledge. Success in wealth management. Deliberate decisions.",
  },
  "Mercury-2": {
    mr: "बुध मिथुन राशीत (स्वगृही + मूलत्रिकोण) — अत्युच्च बुद्धिमत्ता, संवादसम्राट, लेखक-प्रकाशक-शिक्षक. बहुभाषी. IT-तंत्रज्ञानात यश.",
    en: "Mercury in Gemini (Own + Moolatrikona) — peak intelligence, communication emperor, writer/publisher/teacher. Multi-lingual. Success in IT/tech.",
  },
  "Mercury-3": {
    mr: "बुध कर्क राशीत — भावनिक बुद्धी, कौटुंबिक व्यवसाय, मानसशास्त्र. अंतर्ज्ञान + तर्क मिश्रण. लेखन संवेदनशील.",
    en: "Mercury in Cancer — emotional intellect, family business, psychology. Intuition + logic mix. Sensitive writing.",
  },
  "Mercury-4": {
    mr: "बुध सिंह राशीत — राजकीय बुद्धी, नेतृत्व-लेखन, सरकारी सल्लागार. अहंकारयुक्त तर्क. कीर्ती-प्रिय बुद्धी.",
    en: "Mercury in Leo — political intellect, leadership-writing, govt advisor. Ego-tinged logic. Fame-seeking mind.",
  },
  "Mercury-5": {
    mr: "बुध कन्या राशीत (स्वगृही + उच्च) — परिपूर्ण विश्लेषक बुद्धी, वैद्यकीय-लेखा-संशोधन-तज्ज्ञ. तपशीलवार. महान राजयोग.",
    en: "Mercury in Virgo (Own + Exalted) — perfect analytical intellect, medical/accounting/research expert. Detail-oriented. Great Raja Yoga.",
  },
  "Mercury-6": {
    mr: "बुध तूळ राशीत — मुत्सद्दी बुद्धी, कायदेशीर लेखन, कला-व्यवसाय. भागीदारीत कौशल्य. न्यायप्रिय तर्क.",
    en: "Mercury in Libra — diplomatic intellect, legal writing, arts-business. Partnership skill. Justice-loving reasoning.",
  },
  "Mercury-7": {
    mr: "बुध वृश्चिक राशीत — गूढ-संशोधक बुद्धी, गुप्त लेखन, गुप्तचर-ज्योतिष. तीक्ष्ण-तीव्र तर्क. रहस्यप्रिय.",
    en: "Mercury in Scorpio — mystical-researcher intellect, secret writing, intelligence/astrology. Sharp-intense logic. Secrecy-loving.",
  },
  "Mercury-8": {
    mr: "बुध धनु राशीत — तत्त्वज्ञानी-विस्तृत बुद्धी, धार्मिक लेखन-प्रकाशन, शिक्षक. उच्च-शिक्षणात कीर्ती. पण तपशीलावर दुर्लक्ष.",
    en: "Mercury in Sagittarius — philosophical-broad intellect, religious writing-publishing, teacher. Fame in higher education. But overlook details.",
  },
  "Mercury-9": {
    mr: "बुध मकर राशीत — व्यावहारिक-शिस्तबद्ध बुद्धी, प्रशासकीय लेखन, व्यवसाय-योजना. दीर्घकालीन रणनीती. गंभीर तर्क.",
    en: "Mercury in Capricorn — practical-disciplined intellect, administrative writing, business planning. Long-term strategy. Serious reasoning.",
  },
  "Mercury-10": {
    mr: "बुध कुंभ राशीत — नवकल्पक बुद्धी, तंत्रज्ञान-संशोधन, अपारंपारिक लेखन. मानवतावादी. भविष्यदर्शी.",
    en: "Mercury in Aquarius — innovative intellect, technology-research, unconventional writing. Humanitarian. Visionary.",
  },
  "Mercury-11": {
    mr: "बुध मीन राशीत (नीच) — अस्पष्ट-कल्पक बुद्धी, कला-काव्य, अंतर्ज्ञानी परंतु अस्पष्टता. तपशील गोंधळ. सृजनशील.",
    en: "Mercury in Pisces (Debilitated) — vague-imaginative intellect, art-poetry, intuitive but unclear. Detail confusion. Creative.",
  },

  // ─── JUPITER ───────────────────────────────────────────────
  "Jupiter-0": {
    mr: "गुरु मेष राशीत — धैर्यवान गुरु, धाडसी तत्त्वज्ञान, स्वतंत्र धर्म-विचार. कर्तृत्व धार्मिक. स्वमार्गी अध्यापक.",
    en: "Jupiter in Aries — courageous guru, bold philosophy, independent religious thinking. Righteous action. Self-made teacher.",
  },
  "Jupiter-1": {
    mr: "गुरु वृषभ राशीत — स्थिर-कलात्मक ज्ञान, संगीत-काव्यात अध्यापन, भौतिक-आध्यात्मिक समतोल. समृद्ध कौटुंबिक गुरु.",
    en: "Jupiter in Taurus — steady-artistic knowledge, teaching in music/poetry, material-spiritual balance. Prosperous family-guru.",
  },
  "Jupiter-2": {
    mr: "गुरु मिथुन राशीत — बहुमुखी ज्ञान, लेखक-प्रकाशक, शिक्षक. तर्कात धर्म. परंतु तपशीलावर नियंत्रण कमी.",
    en: "Jupiter in Gemini — versatile knowledge, writer-publisher, teacher. Religion in reasoning. Less detail-control.",
  },
  "Jupiter-3": {
    mr: "गुरु कर्क राशीत (उच्च) — अत्यंत करुणामय गुरु, मातृ-समान, धर्मशास्त्र-प्रावीण्य. महान राजयोग. भाग्य चरमावर.",
    en: "Jupiter in Cancer (Exalted) — extremely compassionate guru, mother-like, dharma-shastra mastery. Great Raja Yoga. Peak fortune.",
  },
  "Jupiter-4": {
    mr: "गुरु सिंह राशीत — राजेशाही गुरु, धर्मराज, नेतृत्वपूर्ण शिक्षक. समाजात पूज्य. सरकारी-धार्मिक सल्लागार.",
    en: "Jupiter in Leo — regal guru, dharma-raja, leading teacher. Respected in society. Govt-religious advisor.",
  },
  "Jupiter-5": {
    mr: "गुरु कन्या राशीत — विश्लेषक गुरु, वैद्यकीय-आयुर्वेद ज्ञान, तपशीलवार शास्त्र. पण अति-चिकित्सा टाळा.",
    en: "Jupiter in Virgo — analytical guru, medical-ayurvedic knowledge, detailed scripture. Avoid over-analysis.",
  },
  "Jupiter-6": {
    mr: "गुरु तूळ राशीत — न्यायप्रिय गुरु, कायदेशीर-मुत्सद्दी, कला-धर्म समन्वय. भागीदारीत शुभ. संतुलित शिक्षक.",
    en: "Jupiter in Libra — justice-loving guru, legal-diplomatic, art-dharma synthesis. Auspicious in partnerships. Balanced teacher.",
  },
  "Jupiter-7": {
    mr: "गुरु वृश्चिक राशीत — गूढ-तंत्र ज्ञान, संशोधक गुरु, ज्योतिष-आयुर्वेदात प्रावीण्य. परिवर्तनकारी उपदेश.",
    en: "Jupiter in Scorpio — esoteric-tantric knowledge, researcher-guru, mastery in astrology/ayurveda. Transformative teaching.",
  },
  "Jupiter-8": {
    mr: "गुरु धनु राशीत (स्वगृही + मूलत्रिकोण) — सर्वोच्च गुरु, सनातन धर्मशास्त्र, तीर्थयात्रा प्रेमी. महान राजयोग.",
    en: "Jupiter in Sagittarius (Own + Moolatrikona) — supreme guru, eternal dharma-shastra, pilgrimage-lover. Great Raja Yoga.",
  },
  "Jupiter-9": {
    mr: "गुरु मकर राशीत (नीच) — व्यावहारिक पण कमी विस्तृत, कर्मपूर्ण. आदर्श दृष्टी मर्यादित. कठोर शिक्षक.",
    en: "Jupiter in Capricorn (Debilitated) — practical but less expansive, karma-focused. Idealism limited. Strict teacher.",
  },
  "Jupiter-10": {
    mr: "गुरु कुंभ राशीत — मानवतावादी गुरु, सुधारक-तत्त्वज्ञान, सामाजिक धर्म. अपारंपारिक आध्यात्मिक मार्ग.",
    en: "Jupiter in Aquarius — humanitarian guru, reformist philosophy, social dharma. Unconventional spiritual path.",
  },
  "Jupiter-11": {
    mr: "गुरु मीन राशीत (स्वगृही) — अत्यंत करुणामय-भक्त गुरु, रहस्यवादी, अंतर्ज्ञानी. मोक्षकारक. महान राजयोग.",
    en: "Jupiter in Pisces (Own) — extremely compassionate-devoted guru, mystic, intuitive. Moksha-giving. Great Raja Yoga.",
  },

  // ─── VENUS ─────────────────────────────────────────────────
  "Venus-0": {
    mr: "शुक्र मेष राशीत — धाडसी प्रेम, अधीर नातेसंबंध, साहसी कला. स्वतंत्र-आक्रमक रोमान्स. अचानक आकर्षण.",
    en: "Venus in Aries — bold love, impatient relationships, adventurous art. Independent-aggressive romance. Sudden attractions.",
  },
  "Venus-1": {
    mr: "शुक्र वृषभ राशीत (स्वगृही) — इंद्रियसुख, कलात्मक, सौंदर्य-संगीत. स्थिर-समृद्ध प्रेम. सुख-वस्त्र-भोग. भाग्य उत्तम.",
    en: "Venus in Taurus (Own) — sensual pleasures, artistic, beauty-music. Steady-prosperous love. Comfort-clothing-enjoyment. Good fortune.",
  },
  "Venus-2": {
    mr: "शुक्र मिथुन राशीत — संवादात प्रेम, कल्पक कला, बहुमुखी रोमान्स. लेखन-गीतांमध्ये सौंदर्य. चंचल नातेसंबंध.",
    en: "Venus in Gemini — love in communication, imaginative art, versatile romance. Beauty in writing/songs. Fickle relationships.",
  },
  "Venus-3": {
    mr: "शुक्र कर्क राशीत — भावनिक प्रेम, कौटुंबिक आनंद, मातृ-समान पालनपोषण. संवेदनशील कला. गृह-सुख उत्तम.",
    en: "Venus in Cancer — emotional love, family joy, maternal nurturing. Sensitive art. Excellent home pleasure.",
  },
  "Venus-4": {
    mr: "शुक्र सिंह राशीत — राजेशाही प्रेम, नाट्यमय रोमान्स, कला-मनोरंजनात कीर्ती. अहंयुक्त प्रेम. सौंदर्यप्रेमी.",
    en: "Venus in Leo — regal love, dramatic romance, fame in arts/entertainment. Ego-tinged love. Beauty-lover.",
  },
  "Venus-5": {
    mr: "शुक्र कन्या राशीत (नीच) — प्रेमात टीका-संकोच, सौंदर्य-संशय, भावनिक उबग. सेवा-प्रेम. कला-तपशीलवार.",
    en: "Venus in Virgo (Debilitated) — criticism-hesitation in love, beauty-doubt, emotional reluctance. Service-love. Detail-art.",
  },
  "Venus-6": {
    mr: "शुक्र तूळ राशीत (स्वगृही + मूलत्रिकोण) — सर्वोच्च कला-प्रेम, न्यायप्रिय नातेसंबंध, भागीदारीत चरम. महान राजयोग.",
    en: "Venus in Libra (Own + Moolatrikona) — peak art-love, justice-oriented relationships, supreme in partnerships. Great Raja Yoga.",
  },
  "Venus-7": {
    mr: "शुक्र वृश्चिक राशीत — तीव्र-गूढ प्रेम, रहस्यमय नातेसंबंध, आकर्षण तीव्र. ईर्ष्या-जोखीम. कामुक कला.",
    en: "Venus in Scorpio — intense-mystical love, secretive relationships, powerful attraction. Jealousy risk. Sensual art.",
  },
  "Venus-8": {
    mr: "शुक्र धनु राशीत — तत्त्वज्ञानी प्रेम, धार्मिक कला, परदेशी रोमान्स. उच्च-आदर्श जोडीदार. तीर्थयात्री कलेत.",
    en: "Venus in Sagittarius — philosophical love, religious art, foreign romance. High-ideal partner. Pilgrim in art.",
  },
  "Venus-9": {
    mr: "शुक्र मकर राशीत — व्यावहारिक-संयमी प्रेम, वयस्कर/मोठा जोडीदार, स्थिर भागीदारी. कलात्मक व्यवसाय.",
    en: "Venus in Capricorn — practical-restrained love, older/elder partner, stable partnerships. Artistic business.",
  },
  "Venus-10": {
    mr: "शुक्र कुंभ राशीत — अपारंपारिक प्रेम, मित्र-प्रेमी, मुक्त नातेसंबंध. समाजसेवेतील कला. सामाजिक सुधारक कलाकार.",
    en: "Venus in Aquarius — unconventional love, friend-lover, free relationships. Art in social service. Reformist artist.",
  },
  "Venus-11": {
    mr: "शुक्र मीन राशीत (उच्च) — अत्युच्च प्रेम, दिव्य-आध्यात्मिक, करुणामय कला. परिपूर्ण रोमान्स. महान राजयोग.",
    en: "Venus in Pisces (Exalted) — peak love, divine-spiritual, compassionate art. Perfect romance. Great Raja Yoga.",
  },

  // ─── SATURN ────────────────────────────────────────────────
  "Saturn-0": {
    mr: "शनि मेष राशीत (नीच) — धाडस कुंठित, अधीर-कर्म संघर्ष, नेतृत्व अस्थिर. क्रोध-अडथळे. अपयशातून शिक्षण.",
    en: "Saturn in Aries (Debilitated) — valor restrained, impatient-karma struggle, unstable leadership. Anger-obstacles. Learning via failure.",
  },
  "Saturn-1": {
    mr: "शनि वृषभ राशीत — स्थिर-दीर्घकालीन कर्म, धन-संपत्तीत हळू यश, कलात्मक परिश्रम. वृद्धापकाळी संपत्ती.",
    en: "Saturn in Taurus — steady-long-term karma, slow wealth success, artistic labor. Wealth in old age.",
  },
  "Saturn-2": {
    mr: "शनि मिथुन राशीत — दीर्घ लेखन-शिक्षण कर्म, संवादात शिस्त, बौद्धिक परिश्रम. प्रकाशनात अंतिम यश.",
    en: "Saturn in Gemini — long writing-education karma, discipline in communication, intellectual labor. Eventual publishing success.",
  },
  "Saturn-3": {
    mr: "शनि कर्क राशीत — भावनिक कष्ट, मातृ-विलंब, कौटुंबिक जबाबदाऱ्या. घरगुती संघर्ष. अंतर्गत तप.",
    en: "Saturn in Cancer — emotional hardships, maternal delays, family responsibilities. Domestic struggles. Inner tapas.",
  },
  "Saturn-4": {
    mr: "शनि सिंह राशीत — सत्तेसाठी दीर्घ लढा, नेतृत्व-उशीर, अहंकार-तप. शासकीय पद प्राप्त परंतु कष्टाने.",
    en: "Saturn in Leo — long fight for power, leadership-delay, ego-tapas. Govt position attained but through hardship.",
  },
  "Saturn-5": {
    mr: "शनि कन्या राशीत — परिपूर्णतावादी शिस्त, वैद्यकीय-संशोधनात दीर्घ परिश्रम, तपशीलवार कर्म.",
    en: "Saturn in Virgo — perfectionist discipline, long labor in medical/research, detailed karma.",
  },
  "Saturn-6": {
    mr: "शनि तूळ राशीत (उच्च) — अत्युच्च शनि, न्याय-कायदा-मुत्सद्देगिरीत सर्वोच्च, दीर्घकालीन प्रतिष्ठा. शश महापुरुष योगसम. महान राजयोग.",
    en: "Saturn in Libra (Exalted) — peak Saturn, supreme in justice-law-diplomacy, long-term prestige. Shasha-like Mahapurusha. Great Raja Yoga.",
  },
  "Saturn-7": {
    mr: "शनि वृश्चिक राशीत — तीव्र-गूढ कष्ट, संशोधन-शल्यक्रियेत दीर्घ तप, गूढविद्यांमध्ये सिद्धी.",
    en: "Saturn in Scorpio — intense-mystical hardships, long tapas in research/surgery, mastery in occult.",
  },
  "Saturn-8": {
    mr: "शनि धनु राशीत — तत्त्वज्ञानी कर्म, धार्मिक शिक्षक-प्रचारक उशिरा, तीर्थयात्री-संन्यासी. उच्च शिक्षणात विलंब.",
    en: "Saturn in Sagittarius — philosophical karma, religious teacher-preacher late, pilgrim-ascetic. Higher education delay.",
  },
  "Saturn-9": {
    mr: "शनि मकर राशीत (स्वगृही + मूलत्रिकोण) — सर्वोच्च कर्मयोग, प्रशासकीय-खाण-बांधकाम सम्राट, दीर्घकालीन सत्ता. महान राजयोग.",
    en: "Saturn in Capricorn (Own + Moolatrikona) — supreme karma-yoga, emperor in administration/mining/construction, long-term power. Great Raja Yoga.",
  },
  "Saturn-10": {
    mr: "शनि कुंभ राशीत (स्वगृही) — अत्यंत शिस्तबद्ध सुधारक, तंत्रज्ञान-सामाजिक न्यायात सर्वोच्च, दीर्घकालीन प्रभाव. भक्कम राजयोग.",
    en: "Saturn in Aquarius (Own) — extremely disciplined reformer, supreme in technology/social justice, long-term impact. Solid Raja Yoga.",
  },
  "Saturn-11": {
    mr: "शनि मीन राशीत — आध्यात्मिक-तपस्वी, करुणामय कर्म, कलेत दीर्घ शिस्त. मोक्ष-साधना दीर्घ.",
    en: "Saturn in Pisces — spiritual-ascetic, compassionate karma, long discipline in arts. Long moksha-sadhana.",
  },

  // ─── RAHU ──────────────────────────────────────────────────
  "Rahu-0": {
    mr: "राहु मेष राशीत — धाडसी-अविचारी महत्त्वाकांक्षा, अकस्मात पुढाकार, क्रोध-जोखीम. परदेशी नेतृत्व. तीव्र स्पर्धा.",
    en: "Rahu in Aries — bold-reckless ambition, sudden initiatives, anger-risk. Foreign leadership. Intense competition.",
  },
  "Rahu-1": {
    mr: "राहु वृषभ राशीत (उच्चसम) — धन-संपत्तीची तीव्र लालसा, परदेशी भौतिक लाभ, कला-सौंदर्य-अन्न उद्योग. अत्यंत शुभ.",
    en: "Rahu in Taurus (Exalted-like) — intense desire for wealth, foreign material gains, arts/beauty/food industries. Very auspicious.",
  },
  "Rahu-2": {
    mr: "राहु मिथुन राशीत — लेखन-मीडिया-तंत्रज्ञान क्षेत्रात चमत्कारी यश, अनेक संवाद, फसवी वाणी जपावी.",
    en: "Rahu in Gemini — miraculous success in writing/media/technology, many communications, guard deceptive speech.",
  },
  "Rahu-3": {
    mr: "राहु कर्क राशीत — भावनिक अस्थिरता, मातृ-विलगता, कौटुंबिक असामान्यता. परदेशी गृह-संबंध.",
    en: "Rahu in Cancer — emotional instability, maternal detachment, family unconventionality. Foreign home-connections.",
  },
  "Rahu-4": {
    mr: "राहु सिंह राशीत — अहंकार-जोखीम, सत्ता-लालसा, राजकीय चमत्कार. सिंहासनी पण तंटे. नाट्यमय जीवन.",
    en: "Rahu in Leo — ego-risk, power-hunger, political miracles. Throne but disputes. Dramatic life.",
  },
  "Rahu-5": {
    mr: "राहु कन्या राशीत — संशोधन-विश्लेषणात असामान्य यश, वैद्यकीय-तंत्रज्ञानात चमत्कार. परदेशी सेवा.",
    en: "Rahu in Virgo — unusual success in research-analysis, miracles in medical-technology. Foreign service.",
  },
  "Rahu-6": {
    mr: "राहु तूळ राशीत — कायदेशीर-मुत्सद्दी चमत्कार, परदेशी भागीदारी, कला-सौंदर्य उद्योग. शुभ स्थिती.",
    en: "Rahu in Libra — legal-diplomatic miracles, foreign partnerships, arts-beauty industries. Auspicious position.",
  },
  "Rahu-7": {
    mr: "राहु वृश्चिक राशीत (नीच) — विष-अपघात-शस्त्रक्रिया जोखीम, गूढ-फसवणूक, तीव्र मानसिक तणाव. सावध.",
    en: "Rahu in Scorpio (Debilitated) — poison-accident-surgery risks, occult-deception, intense mental stress. Caution.",
  },
  "Rahu-8": {
    mr: "राहु धनु राशीत — परदेशी गुरु, धर्म-फसवणूक जोखीम, असामान्य तत्त्वज्ञान. तीर्थयात्रेत धोका.",
    en: "Rahu in Sagittarius — foreign guru, religion-deception risk, unusual philosophy. Pilgrimage risk.",
  },
  "Rahu-9": {
    mr: "राहु मकर राशीत — राजकीय-प्रशासकीय चमत्कार, परदेशी सत्ता, कष्टाने साम्राज्य. धोरणीबाज महत्त्वाकांक्षा.",
    en: "Rahu in Capricorn — political-administrative miracles, foreign power, empire through struggle. Strategic ambition.",
  },
  "Rahu-10": {
    mr: "राहु कुंभ राशीत — तंत्रज्ञान-सामाजिक सुधारकात चमत्कार, परदेशी नेटवर्किंग, अपारंपारिक यश.",
    en: "Rahu in Aquarius — miracles in technology-social reform, foreign networking, unconventional success.",
  },
  "Rahu-11": {
    mr: "राहु मीन राशीत — आध्यात्मिक-भौतिक द्वंद्व, रहस्यमय अनुभव, परदेशी साधना. कल्पक-व्यसन जोखीम.",
    en: "Rahu in Pisces — spiritual-material duality, mystical experiences, foreign sadhana. Imagination-addiction risk.",
  },

  // ─── KETU ──────────────────────────────────────────────────
  "Ketu-0": {
    mr: "केतु मेष राशीत — धाडसी-आध्यात्मिक, योद्धा तपस्वी, अकस्मात विरक्ती. पराक्रम पण अहंमुक्त.",
    en: "Ketu in Aries — bold-spiritual, warrior-ascetic, sudden detachment. Valor but ego-free.",
  },
  "Ketu-1": {
    mr: "केतु वृषभ राशीत (नीच) — धन-संपत्तीत हानी-विरक्ती, कौटुंबिक उदासीनता. भौतिक सुख-त्याग.",
    en: "Ketu in Taurus (Debilitated) — wealth loss-detachment, family indifference. Renunciation of material pleasures.",
  },
  "Ketu-2": {
    mr: "केतु मिथुन राशीत — अंतर्ज्ञानी लेखन, गूढ संवाद, शब्दांपलीकडे समजूत. संवादात अंतर.",
    en: "Ketu in Gemini — intuitive writing, mystical communication, understanding beyond words. Communication gaps.",
  },
  "Ketu-3": {
    mr: "केतु कर्क राशीत — मातृ-विलगता, घर-विरक्ती, भावनिक तपस्या. अंतर्गत शांती-साधना.",
    en: "Ketu in Cancer — maternal detachment, home-renunciation, emotional tapas. Inner peace-sadhana.",
  },
  "Ketu-4": {
    mr: "केतु सिंह राशीत — अहंकार-त्याग, सत्ता-विरक्ती, विनम्र तपस्वी. पूर्वजन्म राजसी संस्कार.",
    en: "Ketu in Leo — ego-renunciation, power-detachment, humble ascetic. Past-life royal samskaras.",
  },
  "Ketu-5": {
    mr: "केतु कन्या राशीत — आरोग्य-संशोधनात आध्यात्मिक सिद्धी, सेवा-मोक्ष, आयुर्वेदिक ज्ञान.",
    en: "Ketu in Virgo — spiritual siddhi in health-research, service-moksha, ayurvedic knowledge.",
  },
  "Ketu-6": {
    mr: "केतु तूळ राशीत — भागीदारीत विरक्ती, न्यायासाठी तपस्या, कला-आध्यात्मिक समन्वय.",
    en: "Ketu in Libra — renunciation in partnerships, tapas for justice, art-spiritual synthesis.",
  },
  "Ketu-7": {
    mr: "केतु वृश्चिक राशीत (उच्चसम) — गूढ-तंत्र सिद्धी, ज्योतिष-आयुर्वेद प्रावीण्य, मोक्ष-साधना चरम.",
    en: "Ketu in Scorpio (Exalted-like) — occult-tantric siddhi, mastery in astrology/ayurveda, peak moksha-sadhana.",
  },
  "Ketu-8": {
    mr: "केतु धनु राशीत — धार्मिक तपस्वी, गुरु-त्याग, तत्त्वज्ञान-मोक्ष, तीर्थयात्री संन्यासी.",
    en: "Ketu in Sagittarius — religious ascetic, guru-renunciation, philosophy-moksha, pilgrim-sannyasi.",
  },
  "Ketu-9": {
    mr: "केतु मकर राशीत — कर्म-त्याग, प्रशासकीय विरक्ती, कठोर तप. सांसारिक यशातून विरक्ती.",
    en: "Ketu in Capricorn — karma-renunciation, administrative detachment, strict tapas. Detachment from worldly success.",
  },
  "Ketu-10": {
    mr: "केतु कुंभ राशीत — सामाजिक-तंत्रज्ञान विरक्ती, मानवतावादी मोक्ष, सुधारक तपस्वी.",
    en: "Ketu in Aquarius — social-technological renunciation, humanitarian moksha, reformist ascetic.",
  },
  "Ketu-11": {
    mr: "केतु मीन राशीत — सर्वोच्च मोक्ष-साधना, दिव्य भक्ती, अंतर्ज्ञान चरमावर. समाधी-योग्यता.",
    en: "Ketu in Pisces — supreme moksha-sadhana, divine devotion, peak intuition. Samadhi-capability.",
  },
};
