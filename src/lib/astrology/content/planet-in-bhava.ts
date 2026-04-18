/**
 * Planet-in-bhava predictions — 108 snippets (9 planets × 12 bhavas).
 * Based on BPHS Ch. 20-27 (Effects of Planets in Bhavas).
 * Key: `${planetId}-${house}` e.g. "Sun-10" = Sun in 10th house.
 */

import type { BilingualSnippet } from "./types";

export const PLANET_IN_BHAVA: Record<string, BilingualSnippet> = {
  // ─── SUN ───────────────────────────────────────────────────
  "Sun-1": {
    mr: "सूर्य लग्नात असल्याने तेजस्वी व्यक्तिमत्त्व, आत्मविश्वासी, नेतृत्वगुणी. शरीर सडपातळ, पित्तप्रकृती. केस पातळ होण्याची शक्यता. अहंकार जपावा. शासकीय सन्मान.",
    en: "Sun in 1st — brilliant personality, confident, leadership. Slender body, bilious nature. Possible hair thinning. Guard ego. Govt honor.",
  },
  "Sun-2": {
    mr: "सूर्य द्वितीयात असल्याने शासकीय उत्पन्न, धारदार वाणी. डोळे व तोंडाच्या तक्रारी शक्य. कौटुंबिक तंटे. अन्न-पेयावर लक्ष द्यावे.",
    en: "Sun in 2nd — govt income, sharp speech. Possible eye/mouth issues. Family disputes. Watch food/drink.",
  },
  "Sun-3": {
    mr: "सूर्य तृतीयात असल्याने उत्तम पराक्रम, यशस्वी भावंडे, लेखक-पत्रकार गुण. धाडसी प्रवास. स्वतःच्या बळावर मोठी कीर्ती. शासकीय कृपा.",
    en: "Sun in 3rd — excellent valor, successful siblings, writer/journalist qualities. Bold travels. Great fame through self-effort. Govt favor.",
  },
  "Sun-4": {
    mr: "सूर्य चतुर्थात असल्याने मातृ-सुख कमी, गृहात तंटे. वाहन-त्रास. शासकीय मालमत्ता संभव. मनःशांती कमी. हृदयविकार जपावे.",
    en: "Sun in 4th — less mother-joy, home disputes. Vehicle troubles. Govt property possible. Low mental peace. Guard heart health.",
  },
  "Sun-5": {
    mr: "सूर्य पंचमात असल्याने कमी पण बुद्धिमान संतति. मंत्रसिद्धी, आध्यात्मिक. मुले हट्टी. शिक्षणात तेज. सट्टा-गुंतवणूक जपून.",
    en: "Sun in 5th — few but intelligent progeny. Mantra-siddhi, spiritual. Stubborn kids. Sharp in education. Careful with speculation.",
  },
  "Sun-6": {
    mr: "सूर्य षष्ठात असल्याने शत्रूंवर विजय, उत्तम आरोग्य, हर्षयोग-सम फल. सैन्य-पोलिस-कायदा क्षेत्रात यश. कर्ज सहज फेड.",
    en: "Sun in 6th — victory over enemies, good health, Harsha-like yoga. Success in military/police/law. Easy debt clearance.",
  },
  "Sun-7": {
    mr: "सूर्य सप्तमात असल्याने विवाहात उशीर, जोडीदाराचा अहंकार. भागीदारीत तणाव. शासकीय भागीदारी. परदेशी-संबंध.",
    en: "Sun in 7th — delayed marriage, spouse's ego. Partnership tension. Govt partnerships. Foreign connections.",
  },
  "Sun-8": {
    mr: "सूर्य अष्टमात असल्याने आयुरारोग्य सांभाळावे, शस्त्रक्रिया शक्य. गूढ विद्या. वारसाहक्कात अडथळे. पित्त-डोळ्यांचे त्रास.",
    en: "Sun in 8th — guard longevity/health, surgeries possible. Occult sciences. Inheritance obstacles. Pitta/eye troubles.",
  },
  "Sun-9": {
    mr: "सूर्य नवमात असल्याने भाग्यवान, धार्मिक, पितृ-आशीर्वाद उत्तम. तीर्थयात्रा, शासकीय कृपा. कायद्या-न्यायात यश. गुरु-शिष्य परंपरा.",
    en: "Sun in 9th — fortunate, religious, excellent paternal blessings. Pilgrimages, govt favor. Success in law/justice. Guru-shishya lineage.",
  },
  "Sun-10": {
    mr: "सूर्य दशमात असल्याने दिग्बल, महान राजयोग, सर्वोच्च कर्म-कीर्ती. शासकीय नोकरीत अधिकार. समाजात आदर. आत्मनिर्मित सत्ता.",
    en: "Sun in 10th — Digbala, great Raja Yoga, supreme career fame. Authority in govt service. Social respect. Self-made power.",
  },
  "Sun-11": {
    mr: "सूर्य एकादशात असल्याने शासकीय उत्पन्न, उच्चपदस्थ मित्र, प्रचंड लाभ. इच्छित पदोन्नती. राजकीय वर्तुळ विस्तृत.",
    en: "Sun in 11th — govt income, high-placed friends, huge gains. Desired promotions. Wide political circle.",
  },
  "Sun-12": {
    mr: "सूर्य द्वादशात असल्याने परदेशवास, एकांतप्रिय, आत्मचिंतन. डोळे-हृदयाच्या तक्रारी. पितृ-वियोग शक्य. आध्यात्मिक प्रगती.",
    en: "Sun in 12th — foreign residence, solitary, introspective. Eye/heart issues. Possible separation from father. Spiritual progress.",
  },

  // ─── MOON ──────────────────────────────────────────────────
  "Moon-1": {
    mr: "चंद्र लग्नात असल्याने सौम्य-भावनिक स्वभाव, आकर्षक चेहरा, मातृ-प्रेम. मन शांत असल्यास सर्वत्र यश. पौर्णिमेचा चंद्र विशेष शुभ.",
    en: "Moon in 1st — gentle emotional nature, attractive face, mother's love. Success everywhere if mind is calm. Full Moon especially auspicious.",
  },
  "Moon-2": {
    mr: "चंद्र द्वितीयात असल्याने मधुर वाणी, कौटुंबिक सौख्य, बदलते उत्पन्न. अन्न-पेयातून समाधान. पत्नी-माता यांचा आर्थिक आधार.",
    en: "Moon in 2nd — sweet speech, family happiness, fluctuating income. Satisfaction via food/drink. Financial support from wife/mother.",
  },
  "Moon-3": {
    mr: "चंद्र तृतीयात असल्याने भावनिक लेखन, भावंडांशी घट्ट नाते, वारंवार प्रवास. धैर्य कमी. कला-संगीतात रुचि.",
    en: "Moon in 3rd — emotional writing, close to siblings, frequent travels. Less courage. Interest in arts/music.",
  },
  "Moon-4": {
    mr: "चंद्र चतुर्थात असल्याने स्वगृही सम, उत्कृष्ट मातृ-भाग्य, गृहसौख्य, वाहन-भूमि लाभ. मानसिक शांती. शेतीत यश.",
    en: "Moon in 4th — own-house like, excellent mother-fortune, home joy, vehicle/land gains. Mental peace. Success in agriculture.",
  },
  "Moon-5": {
    mr: "चंद्र पंचमात असल्याने अनेक सुशील संतति, सर्जनशील बुद्धी, मंत्र-भक्तिसाधना. मुलांकडून सुख. पूर्वपुण्याचे फल.",
    en: "Moon in 5th — many well-mannered progeny, creative intellect, mantra-bhakti sadhana. Joy from children. Past-merit fruit.",
  },
  "Moon-6": {
    mr: "चंद्र षष्ठात असल्याने मानसिक आरोग्य सांभाळावे, पोटाच्या तक्रारी, कर्ज शक्य. सेवाक्षेत्रात भावनिक काम. शत्रू मानसिक.",
    en: "Moon in 6th — guard mental health, stomach issues, possible debts. Emotional work in service sector. Mental enemies.",
  },
  "Moon-7": {
    mr: "चंद्र सप्तमात असल्याने सौंदर्यवान जोडीदार, प्रेमळ विवाह, प्रवासी जीवन. भागीदारीत भावनिक. परदेशी-संबंध शक्य.",
    en: "Moon in 7th — beautiful spouse, loving marriage, travel-life. Emotional in partnerships. Possible foreign connections.",
  },
  "Moon-8": {
    mr: "चंद्र अष्टमात असल्याने मानसिक तणाव, मातृ-आरोग्य चिंता. गूढ विद्या, वारसाहक्क संभव. आयुष्यात अचानक भावनिक बदल.",
    en: "Moon in 8th — mental stress, mother's health concerns. Occult sciences, possible inheritance. Sudden emotional life changes.",
  },
  "Moon-9": {
    mr: "चंद्र नवमात असल्याने धार्मिक माता, तीर्थयात्रा, भाग्यवान. उच्च शिक्षण. परदेशी भावनिक संबंध. दयाळू स्वभाव.",
    en: "Moon in 9th — religious mother, pilgrimages, fortunate. Higher education. Foreign emotional connections. Compassionate nature.",
  },
  "Moon-10": {
    mr: "चंद्र दशमात असल्याने लोकप्रिय करिअर, मातेमार्फत कर्मक्षेत्रात यश. सार्वजनिक जीवन. सेवा-आरोग्य-हॉस्पिटॅलिटीत यश.",
    en: "Moon in 10th — popular career, career success via mother. Public life. Success in service/health/hospitality.",
  },
  "Moon-11": {
    mr: "चंद्र एकादशात असल्याने अनेक मित्र, प्रचंड लाभ, भावनिक इच्छापूर्ती. मोठ्या भावंडांचा आधार. स्त्री-संपर्कातून फायदा.",
    en: "Moon in 11th — many friends, huge gains, emotional desire fulfillment. Elder sibling support. Benefit through women.",
  },
  "Moon-12": {
    mr: "चंद्र द्वादशात असल्याने झोपेच्या तक्रारी, एकांतप्रिय, ध्यानसाधना. परदेशी निवास. माता-वियोग शक्य. आध्यात्मिक प्रगती.",
    en: "Moon in 12th — sleep issues, solitary, meditation practice. Foreign residence. Possible separation from mother. Spiritual progress.",
  },

  // ─── MARS ──────────────────────────────────────────────────
  "Mars-1": {
    mr: "मंगळ लग्नात असल्याने धाडसी, योद्धा प्रवृत्ती, पातळ शरीर. रक्त-जखमा जपाव्या. मांगलिक दोष. अहंकार-राग-कर्ज जपावे.",
    en: "Mars in 1st — bold, warrior nature, slender body. Guard blood/injuries. Mangal Dosh. Guard ego/anger/debt.",
  },
  "Mars-2": {
    mr: "मंगळ द्वितीयात असल्याने तीक्ष्ण वाणी, कौटुंबिक तंटे. परिश्रमातून धनप्राप्ती. दात-तोंडाच्या तक्रारी शक्य.",
    en: "Mars in 2nd — sharp speech, family disputes. Wealth through hard work. Possible dental/mouth issues.",
  },
  "Mars-3": {
    mr: "मंगळ तृतीयात असल्याने अपार पराक्रम, धाडसी भावंडे, मजबूत बाहु. सैन्य-क्रीडेत यश. साहसी प्रवास. स्वकमाई.",
    en: "Mars in 3rd — immense valor, bold siblings, strong arms. Success in military/sports. Adventurous travels. Self-earned.",
  },
  "Mars-4": {
    mr: "मंगळ चतुर्थात असल्याने मातृ-आरोग्य चिंता, गृहविवाद, वाहन-अपघात शक्य. मांगलिक दोष. भूमि-वाद. अग्नि-जोखीम.",
    en: "Mars in 4th — mother's health concerns, home disputes, vehicle accidents possible. Mangal Dosh. Land disputes. Fire risk.",
  },
  "Mars-5": {
    mr: "मंगळ पंचमात असल्याने संततिला उशीर, गर्भपात-जोखीम, तीव्र बुद्धी. सट्टा-जुगारात हानी. मुलांचे आरोग्य जपावे.",
    en: "Mars in 5th — progeny delays, miscarriage risk, sharp intellect. Loss in speculation. Guard children's health.",
  },
  "Mars-6": {
    mr: "मंगळ षष्ठात असल्याने रुचक-सम महापुरुष योग, शत्रूंवर निर्णायक विजय, कायदेशीर तंटे जिंका. सेवाक्षेत्रात पराक्रम.",
    en: "Mars in 6th — Ruchaka-like Mahapurusha yoga, decisive victory over enemies, win legal disputes. Valor in service sector.",
  },
  "Mars-7": {
    mr: "मंगळ सप्तमात असल्याने मांगलिक दोष, वैवाहिक तणाव, जोडीदाराशी भांडणे शक्य. शस्त्रक्रिया-अपघात जपावे. विवाह-उशीर.",
    en: "Mars in 7th — Mangal Dosh, marital tension, possible spouse quarrels. Guard surgeries/accidents. Marriage delays.",
  },
  "Mars-8": {
    mr: "मंगळ अष्टमात असल्याने मांगलिक दोष, अपघात-शस्त्रक्रिया जोखीम, आयुरारोग्य सांभाळावे. वारसाहक्क-तंटे. गूढ शक्ती.",
    en: "Mars in 8th — Mangal Dosh, accident/surgery risks, guard longevity/health. Inheritance disputes. Occult powers.",
  },
  "Mars-9": {
    mr: "मंगळ नवमात असल्याने धार्मिक योद्धा, पितृ-मतभेद, परदेश-धाडसी प्रवास. कायदा-न्यायात यश. गुरु-शिष्य तंटा शक्य.",
    en: "Mars in 9th — religious warrior, paternal disputes, bold foreign travel. Success in law/justice. Possible guru-disciple disputes.",
  },
  "Mars-10": {
    mr: "मंगळ दशमात असल्याने दिग्बल, कर्मकीर्ती, सैन्य-अभियांत्रिकी-शल्यचिकित्सेत यश. नेतृत्व. राजयोग. स्वतःच्या बळावर उत्कर्ष.",
    en: "Mars in 10th — Digbala, career fame, success in military/engineering/surgery. Leadership. Raja Yoga. Self-made rise.",
  },
  "Mars-11": {
    mr: "मंगळ एकादशात असल्याने पराक्रमातून प्रचंड लाभ, मोठ्या भावंडांचा आधार. सैन्य-पोलिस-उद्योगातून उत्पन्न. जिद्दी मित्र.",
    en: "Mars in 11th — huge gains through valor, elder sibling support. Income from military/police/industry. Stubborn friends.",
  },
  "Mars-12": {
    mr: "मंगळ द्वादशात असल्याने मांगलिक दोष, परदेशी निवास, लपलेले शत्रू, शस्त्रक्रिया-खर्च. गुप्त शक्ती. संयम आवश्यक.",
    en: "Mars in 12th — Mangal Dosh, foreign residence, hidden enemies, surgery expenses. Hidden powers. Restraint essential.",
  },

  // ─── MERCURY ───────────────────────────────────────────────
  "Mercury-1": {
    mr: "बुध लग्नात असल्याने बुद्धिमान, विनोदी, व्यवसाय-कौशल्य, चपळ बोलणे. द्विस्वभावी. तरुण दिसता. लेखन-संवादात यश.",
    en: "Mercury in 1st — intelligent, witty, business-skilled, quick speech. Dual nature. Youthful appearance. Success in writing/communication.",
  },
  "Mercury-2": {
    mr: "बुध द्वितीयात असल्याने वाणीमार्फत धनप्राप्ती, उत्तम वक्ता, लेखक-हिशोब-व्यापारी. कौटुंबिक बौद्धिक आधार. अनेक भाषा.",
    en: "Mercury in 2nd — wealth through speech, great orator, writer/accountant/trader. Family's intellectual support. Multiple languages.",
  },
  "Mercury-3": {
    mr: "बुध तृतीयात असल्याने उत्कृष्ट लेखक, संप्रेषण-कौशल्य, भावंडे मदत करतात. प्रकाशनात यश. अल्प प्रवासातून फायदा.",
    en: "Mercury in 3rd — excellent writer, communication skills, siblings help. Success in publishing. Gains through short trips.",
  },
  "Mercury-4": {
    mr: "बुध चतुर्थात असल्याने शिक्षित, गृहसौख्य, वाहन-कौशल्यातून संपत्ती. मातृ-बौद्धिक प्रभाव. IT/शिक्षण-क्षेत्रात यश.",
    en: "Mercury in 4th — educated, home joys, wealth via vehicle/skill. Maternal intellectual influence. Success in IT/education.",
  },
  "Mercury-5": {
    mr: "बुध पंचमात असल्याने हुशार संतति, मंत्र-विद्या, लेखन-कलानिर्मिती. शिक्षणात प्रावीण्य. गुंतवणुकीत बौद्धिक यश.",
    en: "Mercury in 5th — smart progeny, mantra-vidya, writing/art creation. Educational excellence. Intellectual investment success.",
  },
  "Mercury-6": {
    mr: "बुध षष्ठात असल्याने कर्ज शक्य, सेवाक्षेत्रात नोकरी, वाणीमुळे शत्रुत्व. त्वचा-आतड्यांच्या तक्रारी. लेखन-कायदा कामी.",
    en: "Mercury in 6th — possible debts, service-sector job, enmity via speech. Skin/intestinal issues. Writing/law useful.",
  },
  "Mercury-7": {
    mr: "बुध सप्तमात असल्याने व्यापारी भागीदारी, हुशार जोडीदार, प्रवास. दुहेरी विवाह-जोखीम. व्यवसायात बुद्धिमान यश.",
    en: "Mercury in 7th — business partnerships, clever spouse, travels. Dual marriage risk. Intellectual business success.",
  },
  "Mercury-8": {
    mr: "बुध अष्टमात असल्याने संशोधक, गूढविद्या-ज्ञान, आयुष्याचे चिंतन. वारसाहक्क शक्य. मानसिक तणाव जपावा.",
    en: "Mercury in 8th — researcher, occult knowledge, life-contemplation. Possible inheritance. Guard mental stress.",
  },
  "Mercury-9": {
    mr: "बुध नवमात असल्याने विद्वान, शिक्षक-प्रकाशक, धार्मिक लेखन. परदेशी शिक्षण-प्रवास. गुरुकृपा. न्यायप्रिय.",
    en: "Mercury in 9th — scholar, teacher-publisher, religious writing. Foreign education-travel. Guru's grace. Just nature.",
  },
  "Mercury-10": {
    mr: "बुध दशमात असल्याने IT-लेखन-हिशोब-संवाद क्षेत्रात उत्तम करिअर. शासकीय कारकून-सल्लागार. बौद्धिक कीर्ती.",
    en: "Mercury in 10th — excellent career in IT/writing/accounting/communication. Govt clerk/advisor. Intellectual fame.",
  },
  "Mercury-11": {
    mr: "बुध एकादशात असल्याने व्यवसायातून प्रचंड लाभ, अनेक बौद्धिक मित्र, नेटवर्किंग. इच्छापूर्ती. तंत्रज्ञान-उद्योग.",
    en: "Mercury in 11th — huge business gains, many intellectual friends, networking. Desire fulfillment. Tech industry.",
  },
  "Mercury-12": {
    mr: "बुध द्वादशात असल्याने परदेशी व्यापार, गुप्त लेखन, ध्यान. खर्च मानसिक. लपलेले संवाद. दूरदृष्टी.",
    en: "Mercury in 12th — foreign trade, secret writing, meditation. Mental expenses. Hidden communications. Far-sightedness.",
  },

  // ─── JUPITER ───────────────────────────────────────────────
  "Jupiter-1": {
    mr: "गुरु लग्नात असल्याने हंस महापुरुष योगसम, ज्ञानी, धार्मिक, उदार. विस्तृत व्यक्तिमत्त्व. पूज्य-आदरणीय. शरीर भरलेले.",
    en: "Jupiter in 1st — Hamsa-like Mahapurusha, learned, religious, generous. Expansive personality. Respected. Stout body.",
  },
  "Jupiter-2": {
    mr: "गुरु द्वितीयात असल्याने समृद्ध कुटुंब, धार्मिक वाणी, उत्तम अन्न-वस्त्र. शिक्षणातून धन. कौटुंबिक सुख. मधुर स्वर.",
    en: "Jupiter in 2nd — prosperous family, religious speech, excellent food/clothing. Wealth via education. Family joy. Sweet voice.",
  },
  "Jupiter-3": {
    mr: "गुरु तृतीयात असल्याने धार्मिक भावंडे, लेखक-शिक्षक-प्रकाशक, तीर्थयात्रा. स्वकमाई-परिश्रमी. काही वेळा अहंकार कमी.",
    en: "Jupiter in 3rd — religious siblings, writer/teacher/publisher, pilgrimages. Self-earned hardworking. Sometimes less ego.",
  },
  "Jupiter-4": {
    mr: "गुरु चतुर्थात असल्याने उत्कृष्ट मातृ-भाग्य, विशाल घर, वाहन-मालमत्ता, मानसिक शांती. कौटुंबिक धार्मिकता.",
    en: "Jupiter in 4th — excellent mother-fortune, grand home, vehicles/property, mental peace. Family religiosity.",
  },
  "Jupiter-5": {
    mr: "गुरु पंचमात असल्याने अनेक सुज्ञान संतति, आध्यात्मिक गुरु, मंत्रसिद्धी. शिक्षण-न्यायात यश. पूर्वपुण्याचे फल प्रचंड.",
    en: "Jupiter in 5th — many wise progeny, spiritual guru, mantra-siddhi. Success in education/law. Immense past-merit fruit.",
  },
  "Jupiter-6": {
    mr: "गुरु षष्ठात असल्याने केंद्राधिपति-दोष शक्य, सेवाक्षेत्रात शिक्षक-वैद्य. कर्जमुक्ती. शत्रू कमी, रोगप्रतिकार उत्तम.",
    en: "Jupiter in 6th — possible Kendradhipati dosh, teacher/healer in service. Debt-freedom. Few enemies, excellent immunity.",
  },
  "Jupiter-7": {
    mr: "गुरु सप्तमात असल्याने धार्मिक-शुभ जोडीदार, भाग्यशाली विवाह, भागीदारी-यश. विदेशी धर्मप्रसार. कुटुंब-पूज्य.",
    en: "Jupiter in 7th — religious-auspicious spouse, fortunate marriage, partnership success. Foreign dharma-propagation. Respected family.",
  },
  "Jupiter-8": {
    mr: "गुरु अष्टमात असल्याने दीर्घायु, गूढ-धर्म ज्ञान, वारसाहक्क. आयुर्वेदिक-ज्योतिष प्रावीण्य. संशोधक-तपस्वी.",
    en: "Jupiter in 8th — longevity, occult-religious knowledge, inheritance. Ayurvedic/astrological mastery. Researcher-ascetic.",
  },
  "Jupiter-9": {
    mr: "गुरु नवमात असल्याने सर्वोच्च भाग्य, धार्मिक-गुरु, पितृ-कृपा प्रचंड. तीर्थयात्रा, न्यायाधीश-प्राध्यापक. महाराजयोग.",
    en: "Jupiter in 9th — supreme fortune, religious-guru, immense paternal grace. Pilgrimages, judge-professor. Maha-Raja Yoga.",
  },
  "Jupiter-10": {
    mr: "गुरु दशमात असल्याने शिक्षक-न्यायाधीश-पुरोहित करिअर, शासकीय कृपा, आदरणीय पद. धर्मयुक्त कर्म. मोठा राजयोग.",
    en: "Jupiter in 10th — teacher/judge/priest career, govt favor, respected position. Dharmic work. Great Raja Yoga.",
  },
  "Jupiter-11": {
    mr: "गुरु एकादशात असल्याने प्रचंड लाभ, धार्मिक मित्र, इच्छापूर्ती. शिक्षण-धर्मातून उत्पन्न. मोठ्या भावंडांकडून सन्मान.",
    en: "Jupiter in 11th — huge gains, religious friends, desire fulfillment. Income via education-dharma. Honor from elder siblings.",
  },
  "Jupiter-12": {
    mr: "गुरु द्वादशात असल्याने मोक्षकारक, आश्रम-जीवन, परदेशी धर्मकार्य. दान-धर्मात खर्च. आध्यात्मिक चरमसीमा.",
    en: "Jupiter in 12th — moksha-giving, ashram-life, foreign religious work. Charity expenses. Spiritual peak.",
  },

  // ─── VENUS ─────────────────────────────────────────────────
  "Venus-1": {
    mr: "शुक्र लग्नात असल्याने सुंदर-कलात्मक व्यक्तिमत्त्व, आकर्षक, प्रेमळ. सौंदर्यप्रेमी. भोगविलास. मादकता. सुख-समृद्धी.",
    en: "Venus in 1st — beautiful artistic personality, attractive, loving. Beauty-lover. Luxuries. Charm. Comfort-prosperity.",
  },
  "Venus-2": {
    mr: "शुक्र द्वितीयात असल्याने समृद्ध कुटुंब, कलात्मक वाणी, सौंदर्य-प्रसाधन उत्पन्न. अन्न-पेयात अभिरुची. मधुर स्वर.",
    en: "Venus in 2nd — prosperous family, artistic speech, income via beauty/cosmetics. Taste in food/drink. Sweet voice.",
  },
  "Venus-3": {
    mr: "शुक्र तृतीयात असल्याने कलात्मक भावंडे, प्रवासातून आनंद, ललित-कला. लेखन-संगीतात प्रावीण्य. स्त्री-मैत्री.",
    en: "Venus in 3rd — artistic siblings, joy through travels, fine arts. Mastery in writing/music. Female friendships.",
  },
  "Venus-4": {
    mr: "शुक्र चतुर्थात असल्याने विशाल-सुंदर घर, आलिशान वाहने, मातृ-सुख. गृहसौख्य अत्युत्तम. कला-संगीत घरातच.",
    en: "Venus in 4th — grand-beautiful home, luxury vehicles, mother-joy. Excellent home comforts. Art/music at home.",
  },
  "Venus-5": {
    mr: "शुक्र पंचमात असल्याने सुंदर संतति, प्रेमविवाह, कलासर्जन. सौंदर्य-कलेत यश. मनोरंजन-क्षेत्रात प्रावीण्य.",
    en: "Venus in 5th — beautiful progeny, love marriage, art creation. Success in beauty/arts. Excellence in entertainment.",
  },
  "Venus-6": {
    mr: "शुक्र षष्ठात असल्याने जोडीदारामुळे कर्ज, वैवाहिक तक्रारी. कलात्मक सेवा. मधुमेह-मूत्राशयाच्या तक्रारी जपाव्या.",
    en: "Venus in 6th — debts via spouse, marital complaints. Artistic service. Guard diabetes/urinary issues.",
  },
  "Venus-7": {
    mr: "शुक्र सप्तमात असल्याने मालव्य महापुरुष योग, अत्यंत सुंदर जोडीदार, भाग्यशाली विवाह. आलिशान भागीदारी.",
    en: "Venus in 7th — Malavya Mahapurusha yoga, exceptionally beautiful spouse, fortunate marriage. Luxurious partnerships.",
  },
  "Venus-8": {
    mr: "शुक्र अष्टमात असल्याने वारसा-संपत्ती, दीर्घायु, गुप्त प्रेम-संबंध शक्य. भोगविलास-जीवन. स्त्रीमार्फत गूढ ज्ञान.",
    en: "Venus in 8th — inherited wealth, longevity, possible secret relationships. Luxurious life. Occult knowledge via women.",
  },
  "Venus-9": {
    mr: "शुक्र नवमात असल्याने भाग्यवान, धार्मिक कला, परदेशी विवाह-भागीदारी. तीर्थयात्रा-सौंदर्य. उच्च सांस्कृतिक रुची.",
    en: "Venus in 9th — fortunate, religious arts, foreign marriage-partnerships. Pilgrimage-beauty. High cultural taste.",
  },
  "Venus-10": {
    mr: "शुक्र दशमात असल्याने कला-मीडिया-सौंदर्य-फॅशन क्षेत्रात कीर्ती, आलिशान जीवन. शासकीय कला-सल्लागार.",
    en: "Venus in 10th — fame in arts/media/beauty/fashion, luxurious life. Govt arts advisor.",
  },
  "Venus-11": {
    mr: "शुक्र एकादशात असल्याने जोडीदारामार्फत प्रचंड लाभ, कलात्मक मित्र-वर्तुळ, विस्तृत नेटवर्क. इच्छापूर्ती.",
    en: "Venus in 11th — huge gains via spouse, artistic friend circle, wide network. Desire fulfillment.",
  },
  "Venus-12": {
    mr: "शुक्र द्वादशात असल्याने शयनसुख उत्तम, परदेशी विलास-प्रेम, आध्यात्मिक सौंदर्य. दान-कलेवर खर्च.",
    en: "Venus in 12th — excellent bedroom pleasures, foreign luxuries/love, spiritual beauty. Expenses on charity/arts.",
  },

  // ─── SATURN ────────────────────────────────────────────────
  "Saturn-1": {
    mr: "शनि लग्नात असल्याने उंच-सडपातळ शरीर, उशीरा परिपक्वता, कष्टाळू, गंभीर. बालपण कष्टमय. कालांतराने स्थैर्य.",
    en: "Saturn in 1st — tall-thin body, late maturity, hardworking, serious. Difficult childhood. Stability over time.",
  },
  "Saturn-2": {
    mr: "शनि द्वितीयात असल्याने उशिरा धनप्राप्ती, कौटुंबिक कष्ट, वाणी जपावी. कर्ज-तंटे. मोठ्या वयात संचय.",
    en: "Saturn in 2nd — late wealth, family hardships, guard speech. Debt-disputes. Accumulation in later age.",
  },
  "Saturn-3": {
    mr: "शनि तृतीयात असल्याने मेहनती पराक्रम, सावत्र भावंडे शक्य, दीर्घ-संघर्ष. शेवटी कीर्ती. लेखनात शिस्तीचे फल.",
    en: "Saturn in 3rd — laborious valor, possible step-siblings, long struggles. Eventual fame. Disciplined writing rewards.",
  },
  "Saturn-4": {
    mr: "शनि चतुर्थात असल्याने मातृ-कष्ट, जुने-जीर्ण घर, गृहसुख कमी. वृद्ध मातेची सेवा. शेतीतून लाभ दीर्घकालीन.",
    en: "Saturn in 4th — mother-hardships, old dilapidated home, low home comforts. Service to elderly mother. Long-term agriculture gains.",
  },
  "Saturn-5": {
    mr: "शनि पंचमात असल्याने संततिला उशीर, गर्भपात-जोखीम. शिस्तबद्ध मन. मुले वडीलधारी मानसिकतेची. सट्टा टाळा.",
    en: "Saturn in 5th — progeny delays, miscarriage risks. Disciplined mind. Children have mature mindset. Avoid speculation.",
  },
  "Saturn-6": {
    mr: "शनि षष्ठात असल्याने शश-सम राजयोग, दीर्घ लढाई जिंका, आरोग्य सुधारते. कर्जमुक्ती दीर्घकाली. सेवाक्षेत्रात यश.",
    en: "Saturn in 6th — Shasha-like Raja Yoga, win long battles, health improves. Long-term debt clearance. Success in service.",
  },
  "Saturn-7": {
    mr: "शनि सप्तमात असल्याने विवाहात विलंब, वयस्कर-प्रौढ जोडीदार, गंभीर भागीदारी. जोडीदार मेहनती. दीर्घ-सहचर.",
    en: "Saturn in 7th — delayed marriage, older-mature spouse, serious partnerships. Hardworking partner. Lasting companion.",
  },
  "Saturn-8": {
    mr: "शनि अष्टमात असल्याने दीर्घायु, दीर्घकालीन रोग शक्य, संघर्षानंतर वारसा. गूढ-शास्त्र. हळू-हळू कीर्ती.",
    en: "Saturn in 8th — longevity, possible chronic illness, inheritance after struggle. Occult sciences. Slow fame.",
  },
  "Saturn-9": {
    mr: "शनि नवमात असल्याने पितृ-सुख उशिरा, परदेशी दीर्घ-प्रवास, कर्मकष्टाने भाग्य. शेवटी गुरुकृपा. धार्मिक तपस्वी.",
    en: "Saturn in 9th — late father-joy, long foreign travels, fortune through karmic labor. Eventual guru-grace. Religious ascetic.",
  },
  "Saturn-10": {
    mr: "शनि दशमात असल्याने दिग्बल, हळू पण शिखरावर पोहोचाल, शासकीय-खाण-बांधकाम क्षेत्र. श्रमातून महान सत्ता.",
    en: "Saturn in 10th — Digbala, slow but reach the peak, govt/mining/construction. Great power through labor.",
  },
  "Saturn-11": {
    mr: "शनि एकादशात असल्याने उशिरा पण प्रचंड लाभ, वयस्कर मित्र, वास्तववादी. जुने गुंतवणूक फळते. स्थिर संपत्ती.",
    en: "Saturn in 11th — late but huge gains, elderly friends, realistic. Old investments bear fruit. Stable wealth.",
  },
  "Saturn-12": {
    mr: "शनि द्वादशात असल्याने परदेशी निवास, एकांत-आश्रम, आध्यात्मिक कष्ट. तुरुंग-रुग्णालय जपावे. अंतिम मोक्षसाधना.",
    en: "Saturn in 12th — foreign residence, solitude-ashram, spiritual labor. Guard prison/hospital. Final moksha-sadhana.",
  },

  // ─── RAHU ──────────────────────────────────────────────────
  "Rahu-1": {
    mr: "राहु लग्नात असल्याने महत्त्वाकांक्षी, परदेशी छाप, डोक्याच्या तक्रारी, असामान्य विचार. शरीर सांभाळावे. अचानक बदल.",
    en: "Rahu in 1st — ambitious, foreign mannerism, head issues, unusual thinking. Guard body. Sudden changes.",
  },
  "Rahu-2": {
    mr: "राहु द्वितीयात असल्याने परदेशी उत्पन्न, फसवी वाणी शक्य, कौटुंबिक फूट. अचानक संपत्ती-हानी. वाणीवर नियंत्रण.",
    en: "Rahu in 2nd — foreign income, possibly deceitful speech, family fractures. Sudden wealth-loss. Control speech.",
  },
  "Rahu-3": {
    mr: "राहु तृतीयात असल्याने धाडसी, मीडिया-प्रतिभा, परदेशी भावंडे, अपार पराक्रम. अनेक प्रवास. शुभ-स्थिती.",
    en: "Rahu in 3rd — bold, media talent, foreign siblings, immense valor. Many travels. Auspicious placement.",
  },
  "Rahu-4": {
    mr: "राहु चतुर्थात असल्याने गृह-तंटे, सावत्र माता शक्य, असामान्य मालमत्ता. परदेशात घर. मानसिक अशांती जपावी.",
    en: "Rahu in 4th — home disputes, possible step-mother, unusual property. Home abroad. Guard mental unrest.",
  },
  "Rahu-5": {
    mr: "राहु पंचमात असल्याने संतति-समस्या, सट्टा-जोखीम, असामान्य बुद्धी. गर्भधारणेत अडथळे. मंत्र-गूढ शक्ती.",
    en: "Rahu in 5th — progeny issues, speculation risks, unusual intellect. Conception obstacles. Mantra-occult powers.",
  },
  "Rahu-6": {
    mr: "राहु षष्ठात असल्याने शत्रूंवर विजय, हर्षयोगसम, परदेशी सेवा. आरोग्य ठाक. कर्ज-तंटे जिंका. शुभ स्थान.",
    en: "Rahu in 6th — victory over enemies, Harsha-like, foreign service. Good health. Win debt-disputes. Auspicious.",
  },
  "Rahu-7": {
    mr: "राहु सप्तमात असल्याने असामान्य जोडीदार, परदेशी विवाह, फसवणूक-जोखीम. भागीदारीत सावध. गूढ-प्रेम.",
    en: "Rahu in 7th — unconventional spouse, foreign marriage, deceit risk. Cautious in partnerships. Secret love.",
  },
  "Rahu-8": {
    mr: "राहु अष्टमात असल्याने आयुरारोग्य जपावे, गूढ विद्या प्रावीण्य, अचानक वारसा. दीर्घ-गूढ आजार. संशोधक.",
    en: "Rahu in 8th — guard longevity/health, mastery in occult, sudden inheritance. Long-hidden illness. Researcher.",
  },
  "Rahu-9": {
    mr: "राहु नवमात असल्याने परदेशी गुरु, असामान्य धर्म, पितृ-संघर्ष. परदेशी शिक्षण. तीर्थयात्रेत जोखीम.",
    en: "Rahu in 9th — foreign guru, unusual religion, paternal struggles. Foreign education. Pilgrimage risks.",
  },
  "Rahu-10": {
    mr: "राहु दशमात असल्याने राजकीय कीर्ती, परदेशी करिअर, प्रभावशाली. कपट-सावध. शासकीय-राजकीय प्रभाव.",
    en: "Rahu in 10th — political fame, foreign career, influential. Guard manipulation. Govt-political influence.",
  },
  "Rahu-11": {
    mr: "राहु एकादशात असल्याने परदेशी प्रचंड लाभ, असामान्य मित्र, साम्राज्य-निर्माण. इच्छा-पूर्तीची चरमसीमा.",
    en: "Rahu in 11th — huge foreign gains, unconventional friends, empire-building. Peak of desire fulfillment.",
  },
  "Rahu-12": {
    mr: "राहु द्वादशात असल्याने परदेशी जीवन, आध्यात्मिक-भौतिक द्वंद्व, अनिद्रा. गुप्त शत्रू. मोक्ष-शक्ति चरम.",
    en: "Rahu in 12th — foreign life, spiritual-material duality, insomnia. Hidden enemies. Peak moksha-power.",
  },

  // ─── KETU ──────────────────────────────────────────────────
  "Ketu-1": {
    mr: "केतु लग्नात असल्याने विरक्त, आध्यात्मिक, डोकेदुखी, अंतर्ज्ञानी. शरीराकडे दुर्लक्ष. पूर्वजन्म-प्रभाव.",
    en: "Ketu in 1st — detached, spiritual, headaches, intuitive. Neglect body. Past-life influence.",
  },
  "Ketu-2": {
    mr: "केतु द्वितीयात असल्याने वाणी कमी, कौटुंबिक धनाची विरक्ती, उदासीनता. अचानक अपघात-हानी. तपस्वी-वृत्ती.",
    en: "Ketu in 2nd — less speech, detachment from family wealth, indifference. Sudden losses. Ascetic nature.",
  },
  "Ketu-3": {
    mr: "केतु तृतीयात असल्याने धाडसी, आध्यात्मिक भावंडे, अंतर्मुख प्रवास. गूढ लेखन. स्वतःच्या मनोबलावर.",
    en: "Ketu in 3rd — courageous, spiritual siblings, inward travels. Occult writing. Through own mental strength.",
  },
  "Ketu-4": {
    mr: "केतु चतुर्थात असल्याने गृह-विरक्ती, मालमत्तेत हानी, ध्यान-प्रवृत्ती. मातेशी अंतर. घरातच गूढ शक्ती.",
    en: "Ketu in 4th — home-detachment, property loss, meditative. Distance from mother. Occult powers at home.",
  },
  "Ketu-5": {
    mr: "केतु पंचमात असल्याने आध्यात्मिक संतति, मंत्रसिद्धी, बुद्धीची विरक्ती. संतति-विलंब. पूर्वपुण्याचे फल.",
    en: "Ketu in 5th — spiritual progeny, mantra-siddhi, intellectual detachment. Progeny delay. Past-merit fruit.",
  },
  "Ketu-6": {
    mr: "केतु षष्ठात असल्याने शत्रूंवर विजय, रोग-निवारण, विपरीत-सम फल. कर्जमुक्ती. गूढ-रोग बरा. शुभ.",
    en: "Ketu in 6th — victory over enemies, disease recovery, Vipreet-like fruit. Debt-freedom. Cure of hidden illness. Auspicious.",
  },
  "Ketu-7": {
    mr: "केतु सप्तमात असल्याने आध्यात्मिक जोडीदार, विरक्त विवाह, एकांत-वृत्ती. संन्यासी-सम. गुप्त बंधन.",
    en: "Ketu in 7th — spiritual spouse, detached marriage, solitude. Monastic. Secret bonds.",
  },
  "Ketu-8": {
    mr: "केतु अष्टमात असल्याने मोक्षकारक, गूढ-सिद्धी, दीर्घायु. लपलेले ज्ञान. अचानक वारसा. तपस्वी-शक्ती.",
    en: "Ketu in 8th — moksha-giving, occult siddhi, longevity. Hidden knowledge. Sudden inheritance. Ascetic power.",
  },
  "Ketu-9": {
    mr: "केतु नवमात असल्याने आध्यात्मिक गुरु, पितृ-विरक्ती, मोक्ष-प्रवास. धर्मात गूढता. परदेशी साधना.",
    en: "Ketu in 9th — spiritual guru, paternal detachment, moksha-travel. Esoteric religion. Foreign sadhana.",
  },
  "Ketu-10": {
    mr: "केतु दशमात असल्याने आध्यात्मिक करिअर, यशात उदासीनता, योग-ध्यान-पुरोहित. सामाजिक प्रसिद्धी तपस्वी मार्गाने.",
    en: "Ketu in 10th — spiritual career, detachment from fame, yoga-meditation-priesthood. Social fame via ascetic path.",
  },
  "Ketu-11": {
    mr: "केतु एकादशात असल्याने आध्यात्मिक लाभ, असामान्य इच्छा, विरक्त मित्र. धन मिळते पण उपयोग नाही. दानशूर.",
    en: "Ketu in 11th — spiritual gains, unusual desires, detached friends. Wealth arrives but unused. Charitable.",
  },
  "Ketu-12": {
    mr: "केतु द्वादशात असल्याने सर्वोच्च मोक्ष, परदेशी साधना, समाधि-स्थिती. आध्यात्मिक-शक्ति चरम. शेवटी विमुक्ती.",
    en: "Ketu in 12th — supreme moksha, foreign sadhana, samadhi state. Peak spiritual power. Final liberation.",
  },
};
