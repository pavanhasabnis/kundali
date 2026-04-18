/**
 * Panchang-fal predictions — 40 snippets.
 * 15 tithi + 7 vaar + 12 masa + 6 ritu.
 * Based on Muhurta Chintamani + classical panchang tradition.
 */

import type { BilingualSnippet } from "./types";

// ─── Tithi Fal (15) ──────────────────────────────────────────
// Keyed 1-15 (Pratipada=1 .. Purnima/Amavasya=15)
export const TITHI_FAL: Record<number, BilingualSnippet> = {
  1: {
    mr: "प्रतिपदा तिथीला जन्म — उत्साही, स्वतंत्र-विचारी, नवनिर्माणकर्ता. पुढाकार घेणारे. अधीर-तरुण मन. नवीन प्रकल्पांत यश. सुरुवातीचे मार्गदर्शक.",
    en: "Born on Pratipada — enthusiastic, independent-thinker, initiator. Takes charge. Impatient-youthful mind. Success in new ventures. Guide for beginnings.",
  },
  2: {
    mr: "द्वितीया तिथीला जन्म — मधुर वाणी, सौम्य स्वभाव, कौटुंबिक-प्रेमी. कला-सौंदर्य प्रिय. नातेसंबंध जपणारे. विचारपूर्वक निर्णय. समाजात लोकप्रिय.",
    en: "Born on Dwitiya — sweet speech, gentle nature, family-loving. Art-beauty loving. Relationship-nurturer. Thoughtful decisions. Popular in society.",
  },
  3: {
    mr: "तृतीया तिथीला जन्म — धाडसी, साहसी, पराक्रमी. भावंडांसोबत घट्ट नाते. प्रवास-प्रिय. लेखन-संवाद कौशल्य. आत्मनिर्भर. विजयी वृत्ती.",
    en: "Born on Tritiya — bold, adventurous, valorous. Strong bond with siblings. Travel-loving. Writing-communication skill. Self-reliant. Victorious nature.",
  },
  4: {
    mr: "चतुर्थी तिथीला जन्म — गणपति-कृपा, गृहप्रिय, मातृ-प्रेम. बौद्धिक काम. अडथळे दूर करण्याची शक्ती. कौटुंबिक जबाबदारी. संकट-नाशक वृत्ती.",
    en: "Born on Chaturthi — Ganesha-grace, home-loving, mother-love. Intellectual work. Power to remove obstacles. Family responsibility. Obstacle-destroyer nature.",
  },
  5: {
    mr: "पंचमी तिथीला जन्म — बुद्धिमान, सुंदर संतति, विद्या-कला. सर्जनशील. उच्च शिक्षण. पूर्वपुण्य. आध्यात्मिक झुकाव. मंत्रसिद्धी. सरस्वती-कृपा.",
    en: "Born on Panchami — intelligent, beautiful progeny, learning-arts. Creative. Higher education. Past-merit. Spiritual inclination. Mantra-siddhi. Sarasvati-grace.",
  },
  6: {
    mr: "षष्ठी तिथीला जन्म — कार्तिकेय-कृपा, सेना-योद्धा वृत्ती, शत्रू-विजय. कठोर परिश्रम. आरोग्य सांभाळावे. कर्जमुक्ती. सेवाक्षेत्रात यश. धैर्यवान.",
    en: "Born on Shashti — Kartikeya-grace, warrior nature, enemy-conquest. Hard work. Guard health. Debt-freedom. Success in service. Courageous.",
  },
  7: {
    mr: "सप्तमी तिथीला जन्म — श्रीमंत, सदाचारी, देवभक्त. चांगले वर्तन. दृढ इच्छाशक्ती. सप्त-ऋषींचे आशीर्वाद. कौटुंबिक समृद्धी. आध्यात्मिक-नैतिक जीवन.",
    en: "Born on Saptami — wealthy, virtuous, devoted to deities. Good conduct. Strong willpower. Seven-sage blessings. Family prosperity. Spiritual-ethical life.",
  },
  8: {
    mr: "अष्टमी तिथीला जन्म — तपस्वी वृत्ती, गहन विचार, कृष्ण-भक्ती. परिवर्तनकारी शक्ती. अंतर्ज्ञानी. कधी अंतर्द्वंद्व. मजबूत व्यक्तिमत्त्व. संशोधक-गूढ.",
    en: "Born on Ashtami — ascetic nature, deep thought, Krishna-devotion. Transformative power. Intuitive. Sometimes inner conflict. Strong personality. Researcher-mystical.",
  },
  9: {
    mr: "नवमी तिथीला जन्म — दुर्गा/राम-कृपा, धाडसी, नेतृत्व. अंतिम विजय. दैवी कार्यात रुची. कष्टातून कीर्ती. धर्मरक्षक. सिद्धी-दायक तिथी.",
    en: "Born on Navami — Durga/Rama-grace, bold, leadership. Final victory. Interest in divine work. Fame through struggle. Dharma-protector. Siddhi-giving tithi.",
  },
  10: {
    mr: "दशमी तिथीला जन्म — विजय, कीर्ती, सिद्धी. विजयादशमी-सदृश योग. कार्य-पूर्णता. सार्वजनिक यश. शासकीय-सामाजिक सन्मान. साहसी निर्णय.",
    en: "Born on Dashami — victory, fame, accomplishment. Vijayadashami-like yoga. Work-completion. Public success. Govt-social honor. Bold decisions.",
  },
  11: {
    mr: "एकादशी तिथीला जन्म — विष्णु-कृपा, धार्मिक-भक्त, उपवासी. आत्म-संयम. आरोग्यप्रिय. व्रतनिष्ठा. मोक्ष-मार्ग. पवित्र जीवन. दीर्घायु. पुण्यात्मा.",
    en: "Born on Ekadashi — Vishnu-grace, religious-devotee, fasting. Self-control. Health-conscious. Vow-loyalty. Moksha-path. Pure life. Longevity. Virtuous soul.",
  },
  12: {
    mr: "द्वादशी तिथीला जन्म — वामन/विष्णु-कृपा, विद्वान, सात्विक. अन्न-दान-प्रिय. शिक्षक-वृत्ती. दान-धर्म. कौटुंबिक सुख. भगवद्-भक्ती.",
    en: "Born on Dwadashi — Vamana/Vishnu-grace, scholar, sattvic. Food-charity loving. Teacher-nature. Charity-dharma. Family joy. God-devotion.",
  },
  13: {
    mr: "त्रयोदशी तिथीला जन्म — कामदेव-कृपा, आकर्षक, प्रेमळ. रोमँटिक. कला-संगीत-नृत्य प्रिय. संतान-सुख. विवाह-सौख्य. सौंदर्य-प्रेम.",
    en: "Born on Trayodashi — Kamadeva-grace, attractive, loving. Romantic. Art-music-dance loving. Progeny-joy. Marriage-happiness. Beauty-love.",
  },
  14: {
    mr: "चतुर्दशी तिथीला जन्म — शिव/रुद्र-कृपा, तीव्र, परिवर्तनकारी. गूढविद्या प्रावीण्य. वैराग्य-आध्यात्म. योग-तंत्र. कधी मानसिक तणाव. मोक्ष-वृत्ती.",
    en: "Born on Chaturdashi — Shiva/Rudra-grace, intense, transformative. Occult mastery. Renunciation-spirituality. Yoga-tantra. Sometimes mental strain. Moksha nature.",
  },
  15: {
    mr: "पौर्णिमा/अमावास्या तिथीला जन्म — पूर्णत्व किंवा नवीनता. पौर्णिमेचा जातक — लक्ष्मी-कृपा, भावनिक-करुणामय, परिपूर्ण. अमावास्येचा जातक — तपस्वी, गूढ, पितृ-कार्य प्रिय, एकांत.",
    en: "Born on Purnima/Amavasya — completion or new start. Purnima: Lakshmi-grace, emotional-compassionate, complete. Amavasya: ascetic, mystical, pitr-work loving, solitary.",
  },
};

// ─── Vaar Fal (7) — 0=Sunday ..  6=Saturday ──────────────────
export const VAAR_FAL: Record<number, BilingualSnippet> = {
  0: {
    mr: "रविवारी जन्म — सूर्य-अधिपति. आत्मविश्वासी, नेतृत्वगुणी, शासकीय कृपा. गोल चेहरा. तेजस्वी व्यक्तिमत्त्व. कधी अहंकारी. राजेशाही वृत्ती. पितृ-प्रेम.",
    en: "Born on Sunday — Sun-ruled. Confident, leader, govt favor. Round face. Brilliant personality. Sometimes egoistic. Regal nature. Father-love.",
  },
  1: {
    mr: "सोमवारी जन्म — चंद्र-अधिपति. भावनिक, सौम्य, कलाप्रेमी, मातृ-प्रिय. अंतर्ज्ञान तीव्र. जलप्रिय. चंचल मन. परदेशी प्रवास. काव्य-संगीत रुचि.",
    en: "Born on Monday — Moon-ruled. Emotional, gentle, art-loving, mother-loving. Intense intuition. Water-loving. Restless mind. Foreign travel. Poetry-music interest.",
  },
  2: {
    mr: "मंगळवारी जन्म — मंगळ-अधिपति. धाडसी, पराक्रमी, योद्धा-वृत्ती. गोल पाय-शरीर. संयम कमी. आकर्षक रूप. सैन्य-पोलिस-अभियांत्रिकी क्षेत्र. रक्त-कार्यक्षमता.",
    en: "Born on Tuesday — Mars-ruled. Bold, valiant, warrior-nature. Round legs-body. Low patience. Attractive looks. Military-police-engineering. Blood-efficiency.",
  },
  3: {
    mr: "बुधवारी जन्म — बुध-अधिपति. बुद्धिमान, विनोदी, कवी, व्यापारी. कविता करत नाहीत पण कार्य करतात. पाय-शरीर गोल. संयम कमी. आकर्षक. लेखन-संवाद प्रिय.",
    en: "Born on Wednesday — Mercury-ruled. Intelligent, witty, poet, trader. Don't write poetry but work. Round legs-body. Low patience. Attractive. Writing-communication loving.",
  },
  4: {
    mr: "गुरुवारी जन्म — गुरु-अधिपति. ज्ञानी, धार्मिक, आदरणीय. विस्तृत व्यक्तिमत्त्व. विद्वान. शिक्षक-गुरु वृत्ती. न्यायप्रिय. कौटुंबिक सौख्य. दीर्घायु. भाग्यवान.",
    en: "Born on Thursday — Jupiter-ruled. Wise, religious, respected. Expansive personality. Scholar. Teacher-guru nature. Just. Family joy. Longevity. Fortunate.",
  },
  5: {
    mr: "शुक्रवारी जन्म — शुक्र-अधिपति. सुंदर, कलाकार, प्रेमळ, विलासप्रिय. सौंदर्यप्रेमी. संगीत-कला-फॅशन. स्त्री-संबंध उत्तम. जोडीदार सुंदर. भौतिक सुख.",
    en: "Born on Friday — Venus-ruled. Beautiful, artist, loving, luxury-loving. Beauty-lover. Music-arts-fashion. Excellent female relations. Beautiful spouse. Material pleasures.",
  },
  6: {
    mr: "शनिवारी जन्म — शनि-अधिपति. शिस्तबद्ध, कष्टाळू, गंभीर, दीर्घकालीन यश. कठोर परिश्रमी. उशिरा फळ. जुन्या गोष्टी प्रिय. लोह-उद्योग. दीर्घायु.",
    en: "Born on Saturday — Saturn-ruled. Disciplined, hardworking, serious, long-term success. Hard laborer. Late fruits. Old things loving. Iron-industry. Longevity.",
  },
};

// ─── Masa Fal (12) — Chaitra=1 ..  Phalguna=12 ────────────────
export const MASA_FAL: Record<number, BilingualSnippet> = {
  1: {
    mr: "चैत्र मासात जन्म — नवसंवत्सराची सुरुवात, नवीनतेचा जन्म. राम-जन्माचा मास. उत्साही, प्रवर्तक, वसंताचे सौंदर्य. धार्मिक कार्यात प्रथम. नूतन प्रकल्पात यश.",
    en: "Born in Chaitra — New Year's start, birth of newness. Rama's birth month. Enthusiastic, initiator, spring's beauty. First in religious work. Success in new projects.",
  },
  2: {
    mr: "वैशाख मासात जन्म — उत्तम आरोग्य, कलात्मक-कुशल, बुद्धिमान, दीर्घायु. बुद्ध-जन्म मास. शांत-समृद्ध. शिक्षणात प्रगती. सकारात्मक विचार. सामाजिक कीर्ती.",
    en: "Born in Vaishakha — excellent health, artistic-skilled, intelligent, long-lived. Buddha's birth month. Calm-prosperous. Educational progress. Positive thinking. Social fame.",
  },
  3: {
    mr: "ज्येष्ठ मासात जन्म — ज्येष्ठ-अधिकारी, गंभीर, मोठ्यांचे सांभाळ. उन्हाळ्याची तीव्रता व्यक्तिमत्त्वात. कष्टाळू. नेतृत्व. कुटुंबाचे आधार. अहंकार जपावा.",
    en: "Born in Jyeshtha — elder-authoritative, serious, care of elders. Summer intensity in personality. Hardworking. Leadership. Family pillar. Guard ego.",
  },
  4: {
    mr: "आषाढ मासात जन्म — वर्षाऋतूची सुरुवात. भावनिक-कल्पक, कृषी-जल-संबंधी कार्य. दिव्य-आध्यात्मिक. गुरुपौर्णिमा-गुरुसेवा प्रिय. शांत-पोषक स्वभाव.",
    en: "Born in Ashadha — start of monsoon. Emotional-imaginative, agriculture-water work. Divine-spiritual. Guru-purnima-seva loving. Calm-nourishing nature.",
  },
  5: {
    mr: "श्रावण मासात जन्म — शिव-कृपा, पवित्र, भक्तिमय. श्रावणी व्रतधारी. विद्याप्रिय. जलधारा-सारखे दयाळू. सरस्वती-लक्ष्मी कृपा. पूर्वजन्म-पुण्य.",
    en: "Born in Shravana — Shiva-grace, pure, devotional. Shravani vow-keeper. Learning-loving. Water-flow like kind. Sarasvati-Lakshmi grace. Past-life merit.",
  },
  6: {
    mr: "भाद्रपद मासात जन्म — गणेश-आगमन, बुद्धिमान, विघ्ननाशक. गौरी-पूजक. कौटुंबिक उत्सवप्रिय. ज्ञान-कला-वक्तृत्व. सिद्धी-विनायक कृपा. समाज-नेतृत्व.",
    en: "Born in Bhadrapada — Ganesha arrival, intelligent, obstacle-remover. Gauri-worshipper. Festival-loving in family. Knowledge-arts-oratory. Siddhi-Vinayak grace. Community leadership.",
  },
  7: {
    mr: "आश्विन मासात जन्म — नवरात्र-दुर्गा उपासना, विजयादशमी. शक्तिशाली, विजयी, साहसी. शासकीय सन्मान. कुलदेवी-कृपा. दिवाळीपूर्व तयारी. आध्यात्मिक-उत्साहित.",
    en: "Born in Ashwin — Navaratri-Durga worship, Vijayadashami. Powerful, victorious, adventurous. Govt honor. Kuldevi-grace. Pre-Diwali preparation. Spiritual-enthusiastic.",
  },
  8: {
    mr: "कार्तिक मासात जन्म — दिवाळी-लक्ष्मीपूजन. धनवान, तेजस्वी, पवित्र. तुलसी-विवाह. दीप-प्रकाशाचा जन्म. व्यापारात यश. आध्यात्मिक शुद्धी. शास्त्रनिष्ठ.",
    en: "Born in Kartik — Diwali-Lakshmi worship. Wealthy, brilliant, pure. Tulsi-vivaha. Birth of lamp-light. Business success. Spiritual purity. Scripture-faithful.",
  },
  9: {
    mr: "मार्गशीर्ष मासात जन्म — भगवद्गीतेचा मास, ज्ञानाचे आगमन. कृष्ण-भक्त, तत्त्वज्ञानी, धार्मिक. आध्यात्मिक गुरु-सेवा. शांत-समंजस. उच्च विचार.",
    en: "Born in Margashirsha — Bhagavad-Gita month, advent of knowledge. Krishna-devotee, philosopher, religious. Spiritual guru-service. Calm-wise. High thoughts.",
  },
  10: {
    mr: "पौष मासात जन्म — सूर्याचे उत्तरायण-आरंभ. शिस्तबद्ध, कष्टाळू, साधक. ब्रह्म-मुहूर्तप्रिय. योग-ध्यान. मकर-संक्रांति कृपा. तपस्वी-आध्यात्मिक.",
    en: "Born in Pausha — Sun's Uttarayana-begin. Disciplined, hardworking, seeker. Brahma-muhurta loving. Yoga-meditation. Makar-Sankranti grace. Ascetic-spiritual.",
  },
  11: {
    mr: "माघ मासात जन्म — तीर्थ-स्नानाचा मास, शुद्धी-परम. पुण्यात्मा, दानशूर, विद्वान. महा-कुंभ-कृपा. तपाचे फल. आध्यात्मिक उंची. कौटुंबिक शुभ कार्य.",
    en: "Born in Magha — sacred-bath month, supreme purification. Virtuous, charitable, scholar. Maha-Kumbh grace. Fruit of tapas. Spiritual heights. Auspicious family work.",
  },
  12: {
    mr: "फाल्गुन मासात जन्म — होळी-रंगांचा मास, आनंद-उत्सव. कलात्मक, आनंदी, सामाजिक. रंगप्रिय. वसंताकडे वाटचाल. सर्जनशील. नृत्य-संगीत-काव्यप्रिय. महाशिवरात्र कृपा.",
    en: "Born in Phalguna — Holi-color month, joy-festival. Artistic, joyful, social. Color-loving. Progress toward spring. Creative. Dance-music-poetry loving. Mahashivratri grace.",
  },
};

// ─── Ritu Fal (6) — 1=Vasant .. 6=Shishir ────────────────────
export const RITU_FAL: Record<number, BilingualSnippet> = {
  1: {
    mr: "वसंत ऋतूत जन्म — आनंदी, सौंदर्यप्रेमी, सत्यनिष्ठ. आयुष्यात सर्व प्रकारच्या सुखांचा अनुभव. दानशील, प्रतिष्ठित. निसर्गाचे नवचैतन्य व्यक्तिमत्त्वात. कला-प्रेम.",
    en: "Born in Vasant (Spring) — joyful, beauty-loving, truthful. Experience all kinds of happiness. Charitable, prestigious. Nature's fresh energy in personality. Art-love.",
  },
  2: {
    mr: "ग्रीष्म ऋतूत जन्म — तेजस्वी, महत्त्वाकांक्षी, ऊर्जावान. उन्हाची तीव्रता व्यक्तिमत्त्वात. कठोर कार्यकर्ता. नेतृत्वगुणी. कधी कठोर-रागीष्ठ. यशस्वी प्रवास.",
    en: "Born in Grishma (Summer) — brilliant, ambitious, energetic. Sun's intensity in personality. Hard worker. Leader. Sometimes harsh-irritable. Successful travels.",
  },
  3: {
    mr: "वर्षा ऋतूत जन्म — भावनिक, कल्पक, अंतर्ज्ञानी. पावसाळ्याच्या गहनतेसारखे. कवी-कलाकार वृत्ती. कौटुंबिक प्रेम. दयाळू-संवेदनशील. आध्यात्मिक वळण.",
    en: "Born in Varsha (Monsoon) — emotional, imaginative, intuitive. Like monsoon's depth. Poet-artist nature. Family love. Kind-sensitive. Spiritual turn.",
  },
  4: {
    mr: "शरद ऋतूत जन्म — शांत-संतुलित, बुद्धिमान, चंद्रासम प्रकाशमान. कौटुंबिक सौख्य. उत्सवप्रिय. शरद-पौर्णिमेचा जादू. उच्च कला-साहित्य रुची. सामाजिक कीर्ती.",
    en: "Born in Sharad (Autumn) — calm-balanced, intelligent, moon-like luminous. Family joy. Festival-loving. Sharad-Purnima magic. High arts-literature interest. Social fame.",
  },
  5: {
    mr: "हेमंत ऋतूत जन्म — गंभीर-विचारशील, शिस्तबद्ध, दीर्घकालीन उद्दिष्टांवर लक्ष. साठवण-संयमी. कौटुंबिक जबाबदारी. धीरगंभीर प्रगती. बुद्धिप्रधान.",
    en: "Born in Hemant (Early winter) — serious-thoughtful, disciplined, focus on long-term goals. Storage-restrained. Family responsibility. Patient progress. Intellect-dominant.",
  },
  6: {
    mr: "शिशिर ऋतूत जन्म — आत्म-चिंतनशील, तपस्वी, आध्यात्मिक. थंडीच्या शांततेसारखे. खोल विचार. एकांत-प्रिय. योग-ध्यान कल. अंतर्मुखी. गहन ज्ञान-प्राप्ती.",
    en: "Born in Shishir (Winter) — introspective, ascetic, spiritual. Like winter's silence. Deep thought. Solitude-loving. Yoga-meditation inclination. Introvert. Deep knowledge-attainment.",
  },
};
