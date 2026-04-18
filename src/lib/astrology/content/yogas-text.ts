/**
 * Yoga explanatory text — 30 classical yogas.
 * Based on BPHS + Jataka Parijata + Phaladeepika.
 * Key: yoga slug matching detection logic in analysis.ts.
 */

import type { BilingualSnippet } from "./types";

export const YOGA_TEXT: Record<string, BilingualSnippet> = {
  "ruchaka": {
    mr: "रुचक महापुरुष योग — मंगळ स्वगृही/उच्च राशीत केंद्रात. जातक योद्धा-सेनापती, धाडसी, तेजस्वी, उंच-बलवान शरीर. सैन्य-क्रीडा-शल्यक्रिया-अभियांत्रिकीत सर्वोच्च यश. शत्रूंवर विजय. अधिकार-प्रतिष्ठा. धारदार नेतृत्व.",
    en: "Ruchaka Mahapurusha Yoga — Mars in own/exaltation in a kendra. Warrior-general, bold, brilliant, tall-strong body. Supreme success in military/sports/surgery/engineering. Victory over enemies. Authority-prestige. Sharp leadership.",
  },
  "bhadra": {
    mr: "भद्र महापुरुष योग — बुध स्वगृही/उच्च राशीत केंद्रात. जातक अत्यंत बुद्धिमान, विद्वान, लेखक-वक्ता-व्यापारी. दीर्घायू, आकर्षक-तरुण दिसतात. व्यापार-शिक्षण-लेखन-IT क्षेत्रात चमकतात. विनोदी-बहुआयामी.",
    en: "Bhadra Mahapurusha Yoga — Mercury in own/exaltation in a kendra. Extremely intelligent, scholar, writer-speaker-businessman. Long-lived, attractive-youthful. Shine in business/education/writing/IT. Witty-multifaceted.",
  },
  "hamsa": {
    mr: "हंस महापुरुष योग — गुरु स्वगृही/उच्च राशीत केंद्रात. जातक धार्मिक, न्यायप्रिय, विद्वान-गुरु. उच्च शिक्षण, शिक्षक-न्यायाधीश-पुरोहित क्षेत्रात कीर्ती. समाजात पूज्य. विस्तृत व्यक्तिमत्त्व. उत्तम आरोग्य.",
    en: "Hamsa Mahapurusha Yoga — Jupiter in own/exaltation in a kendra. Religious, just, scholar-guru. Higher education, fame as teacher-judge-priest. Respected in society. Expansive personality. Excellent health.",
  },
  "malavya": {
    mr: "मालव्य महापुरुष योग — शुक्र स्वगृही/उच्च राशीत केंद्रात. जातक अत्यंत सुंदर-आकर्षक, कलाप्रेमी, विलासी. कला-फॅशन-सौंदर्य-मनोरंजन क्षेत्रात कीर्ती. उत्तम जोडीदार. संपत्ती-वाहने-सुख. मधुर वाणी.",
    en: "Malavya Mahapurusha Yoga — Venus in own/exaltation in a kendra. Extremely beautiful-attractive, art-loving, luxurious. Fame in arts/fashion/beauty/entertainment. Excellent spouse. Wealth-vehicles-comforts. Sweet speech.",
  },
  "shasha": {
    mr: "शश महापुरुष योग — शनि स्वगृही/उच्च राशीत केंद्रात. जातक शिस्तबद्ध-कर्तव्यदक्ष, हळू पण स्थायी उत्कर्ष. प्रशासन-खाणकाम-बांधकाम-राजकारणात सर्वोच्च. दीर्घायु. कठोर परिश्रमातून महान पद.",
    en: "Shasha Mahapurusha Yoga — Saturn in own/exaltation in a kendra. Disciplined-dutiful, slow but lasting rise. Supreme in administration/mining/construction/politics. Long-lived. Great position through hard labor.",
  },
  "budhaditya": {
    mr: "बुधादित्य योग — सूर्य व बुध एकाच राशीत. जातक बुद्धिमान, चतुर, विनोदी, यशस्वी. शिक्षण-राजकारण-प्रशासन-लेखन क्षेत्रात चमकतात. आत्मविश्वासी-वक्तृत्वपूर्ण. समाजात आदर. शासकीय कृपा.",
    en: "Budhaditya Yoga — Sun and Mercury in same sign. Intelligent, clever, witty, successful. Shine in education/politics/administration/writing. Confident-eloquent. Respected in society. Govt favor.",
  },
  "gajakesari": {
    mr: "गजकेसरी योग — चंद्र व गुरु एकमेकांपासून केंद्रात (१/४/७/१०). जातक प्रतापी, प्रतिष्ठित, संपत्तीवान, कीर्तिमान. समाजात आदर. हत्ती-सिंहासारखे बलवान-राजेशाही. उच्च शिक्षण-धर्मनिष्ठा. दीर्घकालीन यश-समृद्धी.",
    en: "Gajakesari Yoga — Moon and Jupiter in kendra from each other. Prestigious, renowned, wealthy, famous. Respected in society. Elephant-lion like strong-regal. Higher education-religiosity. Long-term success-prosperity.",
  },
  "anapha": {
    mr: "अनफा योग — चंद्रापासून बाराव्या घरात (सूर्याशिवाय) ग्रह. जातक सज्जन-सभ्य, कीर्तिमान, आरोग्यवान. सुख-समृद्धी-सन्मान. सुबुद्ध-विवेकी. सुंदर व्यक्तिमत्त्व. राजाप्रमाणे उच्च जीवन.",
    en: "Anapha Yoga — planet(s) in 12th from Moon (except Sun). Gentle-civilized, famous, healthy. Comforts-prosperity-honor. Wise-discreet. Handsome personality. Royal lifestyle.",
  },
  "sunapha": {
    mr: "सुनफा योग — चंद्रापासून दुसऱ्या घरात (सूर्याशिवाय) ग्रह. जातक स्वकर्तृत्वाने धनवान, बुद्धिमान, कौटुंबिक सुख. स्वतंत्र विचार. अनेक कलागुण. सरकारी-बौद्धिक क्षेत्रात यश. सामान्य पार्श्वभूमीतून उदय.",
    en: "Sunapha Yoga — planet(s) in 2nd from Moon (except Sun). Self-made wealthy, intelligent, family joy. Independent thinking. Multiple skills. Success in govt/intellectual fields. Rise from common background.",
  },
  "durudhara": {
    mr: "दुरुधरा योग — चंद्राच्या दोन्ही बाजूला (२रे व १२वे) ग्रह. जातक सर्वबाजूंनी सुखी — धन-धान्य-वाहन-परिवार. इतरांची मदत. दातृत्वी. जीवनात कमतरता नाही. मित्र-नातेवाईकांचा भक्कम आधार.",
    en: "Durudhara Yoga — planets on both sides of Moon (2nd and 12th). Happy in all directions — wealth-grain-vehicles-family. Help from others. Generous. No deficiencies in life. Strong support of friends-relatives.",
  },
  "kemadruma": {
    mr: "केमद्रुम योग — चंद्रापासून २/१२ मध्ये कोणताही ग्रह नाही, व चंद्र कोणत्याही केंद्रात नाही. जातक गरीब-एकाकी-कष्टी. शुभ ग्रहांची दृष्टी किंवा केंद्रस्थ चंद्र असल्यास भंग. नमस्कार-श्लोक-चंद्र उपासना करावी.",
    en: "Kemadruma Yoga — no planets in 2nd/12th from Moon and Moon in no kendra. Poor-lonely-troubled. Cancelled by benefic aspects or Moon in kendra. Recommended: Moon mantras, Chandra upasana.",
  },
  "chandra-mangala": {
    mr: "चंद्र-मंगल योग — चंद्र व मंगळ एकत्र. जातक व्यापारी-धनवान, परंतु मातेचे सुख कमी. कमाईची तीव्र इच्छा. स्त्री-संपर्कातून फायदा. अस्थिर भावना. रिअल-इस्टेट, व्यापार, व्यवसायात यश.",
    en: "Chandra-Mangala Yoga — Moon and Mars conjunction. Businessman-wealthy but less mother-joy. Intense earning desire. Gains through female contacts. Unstable emotions. Success in real-estate, trade, business.",
  },
  "guru-mangala": {
    mr: "गुरु-मंगल योग — गुरु व मंगळ एकत्र किंवा समसप्तक. जातक धार्मिक-योद्धा, शिल्पकुशल, वेदज्ञ. बुद्धिमान. शस्त्र-तंत्रज्ञान-धर्म-कर्मात यश. विवाह-संततीत स्वच्छंदता. आदर्शवादी.",
    en: "Guru-Mangala Yoga — Jupiter and Mars in same sign or 7/7 aspect. Religious-warrior, skilled craftsman, vedic-scholar. Intelligent. Success in weapons/technology/dharma. Independence in marriage/progeny. Idealistic.",
  },
  "shukra-guru": {
    mr: "शुक्र-गुरु योग — शुक्र व गुरु एकाच राशीत. जातक विद्वान-कलाकार, वकील-सल्लागार. उच्च कुळातील जोडीदार. धार्मिक-न्यायप्रिय. शिक्षण-वकिली-कला-वित्त क्षेत्रात यश. संपत्ती-कीर्ती.",
    en: "Shukra-Guru Yoga — Venus and Jupiter in same sign. Scholar-artist, lawyer-advisor. Spouse from high family. Religious-just. Success in education/law/arts/finance. Wealth-fame.",
  },
  "adhi": {
    mr: "अधि योग — चंद्रापासून ६/७/८ मध्ये शुभ ग्रह (बुध/गुरु/शुक्र). जातक धनवान, सुखी, अधिकारप्राप्त. मंत्री-नेता प्रवृत्ती. विजय-प्रतिष्ठा-दीर्घायु. आलिशान जीवन-कार-बंगला.",
    en: "Adhi Yoga — benefics (Mercury/Jupiter/Venus) in 6th/7th/8th from Moon. Wealthy, happy, authority-holder. Minister-leader nature. Victory-prestige-longevity. Luxury life-cars-mansion.",
  },
  "vasumati": {
    mr: "वसुमती योग — चंद्रापासून उपचय (३/६/१०/११) मध्ये शुभ ग्रह. जातक संपत्तीवान, सुखप्रद, वैभवी. आर्थिक स्थैर्य. समाजात प्रतिष्ठा. भौतिक सुख-समृद्धी.",
    en: "Vasumati Yoga — benefics in upachaya (3/6/10/11) from Moon. Wealthy, comfortable, prosperous. Financial stability. Social prestige. Material joy-prosperity.",
  },
  "neecha-bhanga": {
    mr: "नीचभंग राजयोग — नीच ग्रहाचे नीचत्व रद्द (४ शास्त्रीय नियमांनुसार). सुरुवातीच्या अडचणीनंतर अचानक उत्कर्ष. संघर्षातून मोठे यश. पराक्रमाने राजयोग. नीचच्या अपेक्षित दोषाऐवजी फळ.",
    en: "Neecha Bhanga Raja Yoga — debilitation cancelled (per 4 classical rules). Sudden rise after initial struggles. Great success through struggle. Raja Yoga via valor. Fruit contrary to expected debilitation defect.",
  },
  "viparita-raja": {
    mr: "विपरीत राजयोग — दुःस्थान (६/८/१२) चे स्वामी दुःस्थानातच. शत्रू-रोग-कर्ज-अडथळे नष्ट. संकटातून वैभव. गुप्त-अनपेक्षित यश. वैद्यकीय-संशोधन-गुप्तचर क्षेत्रात कीर्ती.",
    en: "Viparita Raja Yoga — lords of dusthanas (6/8/12) in dusthanas. Enemies-disease-debts-obstacles destroyed. Glory from adversity. Hidden-unexpected success. Fame in medical/research/intelligence.",
  },
  "raja": {
    mr: "राजयोग — केंद्र (१/४/७/१०) व त्रिकोण (१/५/९) स्वामींचे एकत्र/परस्पर-अवलोकन/स्थान-विनिमय. जातक राजस्वरूप-सत्तावान, कीर्तिमान, संपत्तीवान. समाजात उच्च स्थान. नेतृत्व-अधिकार-सन्मान.",
    en: "Raja Yoga — kendra (1/4/7/10) and trikona (1/5/9) lords in conjunction/mutual aspect/exchange. King-like power, renowned, wealthy. High social standing. Leadership-authority-honor.",
  },
  "dhana": {
    mr: "धनयोग — २रा व ११वा स्वामी संबंध (एकत्र/दृष्टी/विनिमय). अनेक उत्पन्न-स्रोत, आर्थिक स्थैर्य, कौटुंबिक संपत्ती. दीर्घकालीन धनप्राप्ती. व्यापार-गुंतवणुकीत यश. अप्रत्याशित लाभ.",
    en: "Dhana Yoga — 2nd and 11th lords connection (conjunction/aspect/exchange). Multiple income sources, financial stability, family wealth. Long-term wealth. Success in trade/investments. Unexpected gains.",
  },
  "lakshmi": {
    mr: "लक्ष्मी योग — ९वा स्वामी बलवान व लग्नेश केंद्र/त्रिकोणात. अपार संपत्ती, भाग्य, सौंदर्य. धार्मिक कुटुंब. सरकारी कृपा. कला-सौंदर्य-शिक्षणातून उन्नती. देवीकृपा-युक्त.",
    en: "Lakshmi Yoga — 9th lord strong and Lagnesh in kendra/trikona. Immense wealth, fortune, beauty. Religious family. Govt favor. Rise via arts/beauty/education. Devi-grace blessed.",
  },
  "sarasvati": {
    mr: "सरस्वती योग — बुध, गुरु, शुक्र केंद्र/त्रिकोण/२ मध्ये, गुरु बलवान. जातक अत्यंत विद्वान, कवी-लेखक-कलाकार. शिक्षण-साहित्य-संशोधनात शिरोमणी. सरस्वती-कृपा. वाणीत तेज.",
    en: "Sarasvati Yoga — Mercury, Jupiter, Venus in kendra/trikona/2nd with Jupiter strong. Extremely scholarly, poet-writer-artist. Topmost in education/literature/research. Sarasvati-grace. Brilliant speech.",
  },
  "kalanidhi": {
    mr: "कालनिधि योग — गुरु २/५ मध्ये बुध/शुक्रासह किंवा त्यांच्या राशीत. जातक कला-कुशल, विद्वान, संपत्तीवान. धार्मिक सन्मान. दीर्घायु. कलानिधी-खजिना. शिक्षण-वक्तृत्वात शिरोमणी.",
    en: "Kalanidhi Yoga — Jupiter in 2nd/5th with or in signs of Mercury/Venus. Art-skilled, scholar, wealthy. Religious honor. Longevity. Treasury of arts. Topmost in education-oratory.",
  },
  "parvata": {
    mr: "पर्वत योग — शुभ ग्रह केंद्रात व १२/८ घरे रिक्त. जातक पर्वतासम स्थिर-प्रतिष्ठित, नेता, दातृत्वी. कीर्ती-अधिकार-सन्मान. दीर्घ-स्थायी यश. वैभवी जीवन.",
    en: "Parvata Yoga — benefics in kendras and 8th/12th houses empty. Mountain-like stable-prestigious, leader, generous. Fame-authority-honor. Long-lasting success. Glorious life.",
  },
  "kahala": {
    mr: "काहल योग — ४वा व १० वा स्वामी परस्पर केंद्रात, लग्नेश बलवान. जातक सैन्य-सेनानी, धाडसी, निर्भय. वाहने-संपत्ती. शासकीय अधिकार. काहल (ढोल)-सारखे कीर्ती पसरते.",
    en: "Kahala Yoga — 4th and 10th lords in mutual kendras with Lagnesh strong. Military-commander, bold, fearless. Vehicles-wealth. Govt authority. Fame spreads like kahala (drum).",
  },
  "mahabhagya": {
    mr: "महाभाग्य योग — पुरुष: दिवसा जन्म, सूर्य-चंद्र-लग्न विषम राशीत. स्त्री: रात्री जन्म, सूर्य-चंद्र-लग्न सम राशीत. जातक अत्यंत भाग्यशाली — संपत्ती, सन्मान, कीर्ती, दीर्घायु, उत्तम जोडीदार. महान राजयोग.",
    en: "Mahabhagya Yoga — Male: day birth, Sun-Moon-Lagna in odd signs. Female: night birth, Sun-Moon-Lagna in even signs. Extremely fortunate — wealth, honor, fame, longevity, excellent spouse. Great Raja Yoga.",
  },
  "pushkala": {
    mr: "पुष्कल योग — चंद्राचा स्वामी केंद्रात बलवान शुभ ग्रहासह. जातक धनवान, विद्वान, सामर्थ्यवान. मित्रांकडून आदर. राजा-समान जीवन. भरीव यश. पुष्कळ (विपुल) समृद्धी.",
    en: "Pushkala Yoga — Moon's lord in kendra with strong benefic. Wealthy, scholarly, powerful. Honored by friends. Royal-like life. Solid success. Abundant prosperity.",
  },
  "sankha": {
    mr: "शंख योग — ५वा व ६वा स्वामी परस्पर केंद्रात, लग्नेश बलवान. जातक दीर्घायु, सुखी, संपत्तीवान. भू-संपत्ती-वाहने. दयाळू-परोपकारी. शंखासम शुभ-कीर्ती. आध्यात्मिक प्रवृत्ती.",
    en: "Shankha Yoga — 5th and 6th lords in mutual kendras with Lagnesh strong. Long-lived, happy, wealthy. Land-property-vehicles. Kind-charitable. Shankha-like auspicious fame. Spiritual nature.",
  },
  "shubha": {
    mr: "शुभ योग — शुभ ग्रह (गुरु/शुक्र/बुध) लग्नात. जातक सुंदर, दयाळू, आदरणीय, दीर्घायु. चेहरा प्रसन्न. उत्तम आरोग्य. सौम्य वाणी. सुशील व्यक्तिमत्त्व. सुख-समाधान.",
    en: "Shubha Yoga — benefic (Jupiter/Venus/Mercury) in Lagna. Beautiful, kind, respected, long-lived. Pleasant face. Excellent health. Gentle speech. Virtuous personality. Joy-contentment.",
  },
  "amala": {
    mr: "अमल योग — १० व्या घरात शुभ ग्रह (गुरु/शुक्र/बुध). जातक निर्दोष कीर्ती, उदात्त कर्म, दीर्घकालीन सन्मान. समाजात निर्मल प्रतिष्ठा. शासकीय मान. धर्मयुक्त कर्मक्षेत्र. आदर्श व्यक्ती.",
    en: "Amala Yoga — benefic (Jupiter/Venus/Mercury) in 10th house. Spotless fame, noble deeds, long-term honor. Pristine social reputation. Govt respect. Dharmic career. Ideal person.",
  },
};
