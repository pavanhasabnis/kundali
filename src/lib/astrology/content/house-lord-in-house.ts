/**
 * House-lord-in-house predictions — 144 snippets (12 lords × 12 houses).
 * Based on BPHS Ch. 33-34 (Effects of the Lords of Houses in various Bhavas).
 * Key format: `${lordOfHouse}-${placedInHouse}` e.g. "1-5" = lagnesh in 5th.
 */

import type { BilingualSnippet } from "./types";

export const HOUSE_LORD_IN_HOUSE: Record<string, BilingualSnippet> = {
  // ─── 1st Lord (Lagnesh) ───────────────────────────────────
  "1-1": {
    mr: "लग्नेश लग्नात असल्याने तुम्ही सुदृढ शरीराचे, दीर्घायुषी आणि आत्मनिर्भर आहात. स्वतःच्या प्रयत्नांनी यश मिळवाल. व्यक्तिमत्त्व प्रभावी असेल. आरोग्य साधारणपणे उत्तम राहील.",
    en: "Lagna lord in 1st grants strong body, longevity and self-reliance. You achieve success through personal effort. Impressive personality and generally robust health.",
  },
  "1-2": {
    mr: "लग्नेश द्वितीयात असल्याने धनप्राप्ती, कुटुंबसौख्य आणि मधुर वाणी लाभेल. अन्न-वस्त्राची कमतरता नसेल. विद्या व धर्मात रुची असेल. कौटुंबिक प्रतिष्ठा वाढेल.",
    en: "Lagna lord in 2nd brings wealth, family happiness and sweet speech. No lack of food or clothing. Interest in learning and religion. Family reputation rises.",
  },
  "1-3": {
    mr: "लग्नेश तृतीयात असल्याने पराक्रमी, धाडसी व स्वतःच्या बळावर पुढे जाणारे व्हाल. लहान भावंडांचा लाभ. लेखन-संवाद कौशल्य उत्तम. अल्प प्रवासातून फायदा.",
    en: "Lagna lord in 3rd makes you bold, adventurous and self-made. Benefits through younger siblings. Excellent writing and communication. Gains through short travels.",
  },
  "1-4": {
    mr: "लग्नेश चतुर्थात असल्याने सुखी गृहजीवन, माता-आशीर्वाद आणि वाहन-भूमी लाभ. शिक्षण चांगले. मानसिक शांती. कुटुंबाशी भावनिक जवळीक.",
    en: "Lagna lord in 4th grants happy home life, mother's blessings, vehicles and lands. Good education, mental peace and emotional closeness with family.",
  },
  "1-5": {
    mr: "लग्नेश पंचमात असल्याने बुद्धिमान, संततिसौख्य व पूर्वपुण्य प्राप्त होईल. राजयोग. अध्यात्म-मंत्रसिद्धीत प्रावीण्य. कलेत व क्रीडेत यश.",
    en: "Lagna lord in 5th brings intelligence, good progeny and past-life merit. Raja Yoga. Mastery in spirituality/mantras. Success in arts and sports.",
  },
  "1-6": {
    mr: "लग्नेश षष्ठात असल्याने आरोग्य चिंता राहील परंतु शत्रूंवर विजय मिळेल. सेवाक्षेत्रात यश. कर्जमुक्ती. परिश्रमाशिवाय फळ नाही.",
    en: "Lagna lord in 6th gives health concerns but victory over enemies. Success in service sector. Debts cleared. No reward without effort.",
  },
  "1-7": {
    mr: "लग्नेश सप्तमात असल्याने विवाहानंतर जीवनात मोठा बदल. प्रवासी वृत्ती, परदेशसंबंध. जोडीदाराशी घट्ट नाते. व्यवसायात भागीदारी लाभदायक.",
    en: "Lagna lord in 7th brings major life change after marriage. Travel-oriented, foreign connections. Strong bond with spouse. Profitable business partnerships.",
  },
  "1-8": {
    mr: "लग्नेश अष्टमात असल्याने शरीर-आरोग्य सांभाळावे. गूढ विद्यांमध्ये रुची. संशोधक वृत्ती. वारसाहक्काने धन. आयुष्याच्या अर्ध्यात मोठा बदल.",
    en: "Lagna lord in 8th — guard health carefully. Interest in occult sciences. Research-oriented. Inherited wealth. Major life change in middle age.",
  },
  "1-9": {
    mr: "लग्नेश नवमात असल्याने भाग्यवान, धार्मिक व पितृआशीर्वाद लाभेल. तीर्थयात्रा. परदेश-गमन संभव. गुरुसेवा. न्यायप्रिय व्यक्तिमत्त्व.",
    en: "Lagna lord in 9th grants fortune, religiosity and father's blessings. Pilgrimages. Foreign travel possible. Guru-service. Just personality.",
  },
  "1-10": {
    mr: "लग्नेश दशमात असल्याने कर्मक्षेत्रात उत्कर्ष, पदप्रतिष्ठा व कीर्ती. शासकीय कृपा. नेतृत्वगुण. दिग्बली ग्रह असल्यास विशेष राजयोग.",
    en: "Lagna lord in 10th brings career success, status and fame. Govt favor. Leadership qualities. Special Raja Yoga if planet is Digbali.",
  },
  "1-11": {
    mr: "लग्नेश एकादशात असल्याने मोठा लाभ, अनेक मित्र व मोठ्या भावंडांचा आधार. इच्छापूर्ती सहज. सामाजिक वर्तुळ विस्तृत. आर्थिक स्थैर्य.",
    en: "Lagna lord in 11th grants great gains, many friends and elder sibling support. Desires easily fulfilled. Wide social circle. Financial stability.",
  },
  "1-12": {
    mr: "लग्नेश द्वादशात असल्याने खर्चाचा कल, परदेशवास व आध्यात्मिक प्रवृत्ती. आरोग्य जपावे. एकांत-प्रिय. मोक्षसाधनेकडे वाटचाल. विरक्ती भाव.",
    en: "Lagna lord in 12th gives expenditure tendency, foreign residence and spiritual inclination. Guard health. Solitude-loving. Progress toward moksha. Detached nature.",
  },

  // ─── 2nd Lord (Dhanesh) ────────────────────────────────────
  "2-1": {
    mr: "द्वितीयेश लग्नात असल्याने स्वतःच्या प्रयत्नांनी धनसंपादन, मोठे कुटुंब आणि वाक्पटुता लाभेल. अन्नसंग्रह उत्तम. वारसा पूर्वजांकडून.",
    en: "2nd lord in 1st brings self-earned wealth, large family and eloquence. Good food supply. Inheritance from ancestors.",
  },
  "2-2": {
    mr: "द्वितीयेश स्वगृही असल्याने विशेष धनयोग, अनेक उत्पन्न-स्रोत व कुटुंबसौख्य. संपत्ती स्थायी. वाणी प्रभावी. परिवारात सन्मान.",
    en: "2nd lord in own house brings special wealth yoga, multiple income sources and family happiness. Lasting wealth. Effective speech. Family respect.",
  },
  "2-3": {
    mr: "द्वितीयेश तृतीयात असल्याने भावंडांमार्फत व अल्प प्रवासाने धनलाभ. पराक्रमातून उत्पन्न. लेखन-प्रकाशनातून फायदा. साहसी वाणी.",
    en: "2nd lord in 3rd — wealth through siblings and short travels. Income through valor. Gains from writing/publishing. Bold speech.",
  },
  "2-4": {
    mr: "द्वितीयेश चतुर्थात असल्याने मातृसुख, संपत्ती, वाहन व गृहलाभ. शेतीजमिनीतून उत्पन्न. कौटुंबिक वारसा. शिक्षणातून धनप्राप्ती.",
    en: "2nd lord in 4th — mother's comfort, property, vehicles and home gains. Income from agriculture/land. Family inheritance. Wealth through education.",
  },
  "2-5": {
    mr: "द्वितीयेश पंचमात असल्याने बुद्धीबळावर धनप्राप्ती, संततिलाभ व सट्टा-गुंतवणुकीत यश. कलेतून उत्पन्न. पूर्वपुण्याने संपत्ती.",
    en: "2nd lord in 5th — wealth through intellect, good progeny and success in speculation/investment. Income from arts. Wealth from past-life merit.",
  },
  "2-6": {
    mr: "द्वितीयेश षष्ठात असल्याने कर्ज, शत्रूमुळे धनहानी संभव. वाणीमुळे वाद. परंतु सेवाक्षेत्रातून पगार-उत्पन्न. वैद्यकीय खर्च शक्य.",
    en: "2nd lord in 6th — possible debts and wealth loss through enemies. Speech-related disputes. But service-sector salary. Medical expenses possible.",
  },
  "2-7": {
    mr: "द्वितीयेश सप्तमात असल्याने जोडीदाराकडून धनप्राप्ती, भागीदारी व्यवसायात लाभ. विवाहानंतर आर्थिक उन्नती. परदेशी व्यापारात यश.",
    en: "2nd lord in 7th — wealth through spouse, gains in partnership business. Financial rise post-marriage. Success in foreign trade.",
  },
  "2-8": {
    mr: "द्वितीयेश अष्टमात असल्याने वारसा-धन संभव परंतु नियमित उत्पन्नात चढ-उतार. गूढ स्रोतातून अचानक लाभ. पत्नीकडून संपत्ती.",
    en: "2nd lord in 8th — inherited wealth possible but fluctuating regular income. Sudden gains from hidden sources. Wealth via spouse.",
  },
  "2-9": {
    mr: "द्वितीयेश नवमात असल्याने धर्मामार्फत, पितृकृपेने व तीर्थयात्रेतून धनप्राप्ती. भाग्यवान कुटुंब. उच्च शिक्षणातून उत्पन्न. परदेशी उत्पन्न.",
    en: "2nd lord in 9th — wealth through dharma, father's grace and pilgrimages. Fortunate family. Income via higher education. Foreign earnings.",
  },
  "2-10": {
    mr: "द्वितीयेश दशमात असल्याने कर्मक्षेत्रातून उत्तम धनलाभ, शासकीय/सरकारी उत्पन्न. प्रतिष्ठित व्यवसाय. प्रभावी वक्तृत्व कामी येते.",
    en: "2nd lord in 10th — excellent income through career, govt earnings. Prestigious profession. Effective speech aids work.",
  },
  "2-11": {
    mr: "द्वितीयेश एकादशात असल्याने प्रचंड लाभ, अनेक उत्पन्नस्रोत व इच्छित धनप्राप्ती. मित्रांमार्फत फायदा. आर्थिक समृद्धी स्थायी.",
    en: "2nd lord in 11th — huge gains, multiple income streams and desired wealth. Gains through friends. Lasting financial prosperity.",
  },
  "2-12": {
    mr: "द्वितीयेश द्वादशात असल्याने उत्पन्नापेक्षा खर्च अधिक, परदेश-गमन खर्च. दान-धर्मात पैसा जातो. बचत कमी. आर्थिक नियोजन आवश्यक.",
    en: "2nd lord in 12th — expenses exceed income, foreign travel expenses. Money spent on charity. Low savings. Financial planning essential.",
  },

  // ─── 3rd Lord (Parakramesh) ────────────────────────────────
  "3-1": {
    mr: "तृतीयेश लग्नात असल्याने स्वतःच्या पराक्रमाने यश, लहान भावंडांचा सहवास आणि धाडसी व्यक्तिमत्त्व. लेखन-कलेत प्रावीण्य. स्वाभिमानी.",
    en: "3rd lord in 1st — success through own valor, company of younger siblings and bold personality. Skill in writing/arts. Self-respecting.",
  },
  "3-2": {
    mr: "तृतीयेश द्वितीयात असल्याने पराक्रमाने धनप्राप्ती, भावंडांमुळे कौटुंबिक लाभ. अल्प प्रवासातून उत्पन्न. वाणीत धारधारपणा.",
    en: "3rd lord in 2nd — wealth through valor, family gains via siblings. Income from short trips. Sharp speech.",
  },
  "3-3": {
    mr: "तृतीयेश स्वगृही असल्याने पराक्रमी, साहसी व बलवान भावंडे. लेखक-पत्रकार योग. स्वतःच्या बळावर जीवन घडवाल. छोट्या व्यवसायांत यश.",
    en: "3rd lord in own house — valiant self, bold siblings. Writer/journalist yoga. Self-made life. Success in small businesses.",
  },
  "3-4": {
    mr: "तृतीयेश चतुर्थात असल्याने भावंडांकडून गृहसुख, मातृ-पक्षाचा आधार. घरातच लेखन-कला. वाहनांद्वारे प्रवास. शिक्षणात प्रगती.",
    en: "3rd lord in 4th — home comforts via siblings, maternal support. Writing/art within home. Travel via vehicles. Educational progress.",
  },
  "3-5": {
    mr: "तृतीयेश पंचमात असल्याने बुद्धिमान भावंडे, पराक्रमातून संततिसौख्य. कलेतून उत्पन्न. क्रीडा-साहसात यश. गूढविद्या रुचि.",
    en: "3rd lord in 5th — intelligent siblings, progeny through valor. Income from arts. Success in sports/adventure. Interest in occult.",
  },
  "3-6": {
    mr: "तृतीयेश षष्ठात असल्याने भावंडांशी मतभेद, शत्रूंविरुद्ध पराक्रम. सैन्य-पोलिस सेवेत यश. आरोग्य सांभाळावे. कायदेशीर तंटे.",
    en: "3rd lord in 6th — disputes with siblings, valor against enemies. Success in military/police service. Guard health. Legal disputes.",
  },
  "3-7": {
    mr: "तृतीयेश सप्तमात असल्याने जोडीदाराशी प्रवास, भागीदारीत पराक्रम. विवाह भावंडांच्या सहकार्याने. व्यापारी प्रवृत्ती.",
    en: "3rd lord in 7th — travel with spouse, valor in partnerships. Marriage through sibling's help. Business nature.",
  },
  "3-8": {
    mr: "तृतीयेश अष्टमात असल्याने भावंडांच्या आरोग्याची काळजी, गुप्त प्रवास. संशोधनात रुचि. वारसाहक्क-तंटे संभव. आयुष्यात अचानक बदल.",
    en: "3rd lord in 8th — sibling health concerns, secret journeys. Interest in research. Inheritance disputes possible. Sudden life changes.",
  },
  "3-9": {
    mr: "तृतीयेश नवमात असल्याने भाग्यवान भावंडे, तीर्थयात्रा व दूरगामी प्रवास. धार्मिक लेखन. गुरु-उपदेशातून मार्गदर्शन.",
    en: "3rd lord in 9th — fortunate siblings, pilgrimages and long travels. Religious writing. Guidance from guru's teachings.",
  },
  "3-10": {
    mr: "तृतीयेश दशमात असल्याने कर्मक्षेत्रात पराक्रम, लेखन-प्रकाशनातून कीर्ती. भावंडे सत्तापदी. मीडिया, पत्रकारिता, खेळ क्षेत्रात यश.",
    en: "3rd lord in 10th — career valor, fame through writing/publishing. Siblings in authority. Success in media, journalism, sports.",
  },
  "3-11": {
    mr: "तृतीयेश एकादशात असल्याने भावंडांमार्फत मोठा लाभ, अनेक प्रवासांतून उत्पन्न. मित्र-वर्तुळ विस्तृत. इच्छित यश.",
    en: "3rd lord in 11th — great gains through siblings, income from multiple travels. Wide friend circle. Desired success.",
  },
  "3-12": {
    mr: "तृतीयेश द्वादशात असल्याने भावंडे परदेशात, प्रवासावर खर्च. पराक्रम निष्फळ वाटू शकतो. एकांत लेखन. खर्च जास्त.",
    en: "3rd lord in 12th — siblings abroad, travel expenses. Valor may feel unrewarded. Solitary writing. High expenses.",
  },

  // ─── 4th Lord (Sukhesh) ────────────────────────────────────
  "4-1": {
    mr: "चतुर्थेश लग्नात असल्याने मातृ-आशीर्वाद सतत सोबत, घर-कुटुंबप्रिय व्यक्तिमत्त्व. वाहन-सुख. भूमिलाभ. मनःशांती.",
    en: "4th lord in 1st — mother's blessings always, home/family-loving personality. Vehicle comforts. Land gains. Mental peace.",
  },
  "4-2": {
    mr: "चतुर्थेश द्वितीयात असल्याने मातृ-पक्षाकडून धनप्राप्ती, संपत्ती-वारसा व कौटुंबिक सौख्य. भूमि-वाहन संपादन. शेतीतून उत्पन्न.",
    en: "4th lord in 2nd — wealth from maternal side, property inheritance and family joy. Land/vehicle acquisition. Agricultural income.",
  },
  "4-3": {
    mr: "चतुर्थेश तृतीयात असल्याने मातेच्या सहकार्याने पराक्रम, भावंडे गृहसुख देतात. अल्प प्रवासात मातृ-सांनिध्य. शिक्षणात प्रगती.",
    en: "4th lord in 3rd — valor with mother's support, siblings provide home comfort. Mother's company in short trips. Educational progress.",
  },
  "4-4": {
    mr: "चतुर्थेश स्वगृही असल्याने मातृ-सुख उत्तम, मोठे घर, अनेक वाहने व भूमि. गृह-सौख्य स्थायी. मानसिक स्थैर्य. मोठा राजयोग.",
    en: "4th lord in own house — excellent mother-joy, big home, multiple vehicles and lands. Lasting domestic happiness. Mental stability. Major Raja Yoga.",
  },
  "4-5": {
    mr: "चतुर्थेश पंचमात असल्याने सुशिक्षित संतति, मातेमार्फत शिक्षण. घरात पुण्यकर्मे. कलेत-अध्यात्मात कौटुंबिक रुची.",
    en: "4th lord in 5th — educated progeny, education through mother. Pious deeds at home. Family interest in arts/spirituality.",
  },
  "4-6": {
    mr: "चतुर्थेश षष्ठात असल्याने मातेचे आरोग्य सांभाळावे, घरात मतभेद. शेती-जमीन वाद शक्य. वाहन-दुरुस्ती खर्च.",
    en: "4th lord in 6th — guard mother's health, home disputes. Possible land/agriculture conflicts. Vehicle repair expenses.",
  },
  "4-7": {
    mr: "चतुर्थेश सप्तमात असल्याने जोडीदार मातेसारखा सांभाळ करतो, विवाहानंतर गृहसौख्य वाढते. परदेशात घर. भागीदारी व्यवसायात भूमि.",
    en: "4th lord in 7th — spouse cares like mother, home joy increases after marriage. Foreign home. Land in partnership business.",
  },
  "4-8": {
    mr: "चतुर्थेश अष्टमात असल्याने मातेच्या आयुरारोग्याची चिंता, वारसाहक्कात अडचणी. लपलेली संपत्ती. अनपेक्षित गृहबदल.",
    en: "4th lord in 8th — mother's health concerns, inheritance difficulties. Hidden property. Unexpected home changes.",
  },
  "4-9": {
    mr: "चतुर्थेश नवमात असल्याने धार्मिक माता, परदेशात घर, पितृ-मातृ भाग्य. तीर्थक्षेत्रात निवास. गृहसौख्य भाग्यावर अवलंबून.",
    en: "4th lord in 9th — religious mother, foreign home, paternal-maternal fortune. Residence in pilgrim center. Home joy based on fortune.",
  },
  "4-10": {
    mr: "चतुर्थेश दशमात असल्याने गृह-संपत्तीतून व्यवसाय, शेती-रियलइस्टेट क्षेत्रात यश. मातेचा कर्मक्षेत्रात आधार. शासकीय कृपेने घर-भूमि.",
    en: "4th lord in 10th — business through home/property, success in agriculture/real-estate. Mother's career support. Govt favor grants home/land.",
  },
  "4-11": {
    mr: "चतुर्थेश एकादशात असल्याने भूमि-वाहनांद्वारे लाभ, मातेकडून आर्थिक पाठिंबा. अनेक घरे-मालमत्ता. मित्रांच्या घरी राहणे.",
    en: "4th lord in 11th — gains via land/vehicles, financial support from mother. Multiple homes/properties. Staying at friends' homes.",
  },
  "4-12": {
    mr: "चतुर्थेश द्वादशात असल्याने घर परदेशात, गृहखर्च जास्त. मातेचे वियोग शक्य. आध्यात्मिक निवास. शेवटी शांत-एकांत घर.",
    en: "4th lord in 12th — home abroad, high household expenses. Separation from mother possible. Spiritual residence. Quiet/solitary home finally.",
  },

  // ─── 5th Lord (Putresh/Vidyesh) ────────────────────────────
  "5-1": {
    mr: "पंचमेश लग्नात असल्याने बुद्धिमान, विद्वान, संततिसौख्य व पूर्वपुण्याचे फल. अध्यात्मात गती. कला-क्रीडेत यश. राजयोग.",
    en: "5th lord in 1st — intelligent, learned, good progeny and past-life merit. Spiritual progress. Success in arts/sports. Raja Yoga.",
  },
  "5-2": {
    mr: "पंचमेश द्वितीयात असल्याने बुद्धिद्वारे धनप्राप्ती, संततिच्या सहकार्याने कुटुंब समृद्ध. शिक्षण-कलेतून उत्पन्न. मंत्रसिद्धी.",
    en: "5th lord in 2nd — wealth through intellect, family prosperous with progeny's help. Income through education/arts. Mantra-siddhi.",
  },
  "5-3": {
    mr: "पंचमेश तृतीयात असल्याने बुद्धिमान भावंडे, स्वतःच्या बुद्धीने पराक्रम. लेखनातून उत्पन्न. मुलांची सहल-प्रवासातून प्रगती.",
    en: "5th lord in 3rd — intelligent siblings, valor through own intellect. Income from writing. Progress through children's outings/travels.",
  },
  "5-4": {
    mr: "पंचमेश चतुर्थात असल्याने गृहसौख्यात संतति, मातृ-वंशातून शिक्षण. घरातच कलानिर्मिती. मानसिक सुख.",
    en: "5th lord in 4th — progeny brings home joy, education from maternal lineage. Art creation at home. Mental happiness.",
  },
  "5-5": {
    mr: "पंचमेश स्वगृही असल्याने अनेक गुणी संतति, अत्यंत बुद्धिमान, पूर्वपुण्याचे प्रचंड फल. अध्यात्म-मंत्र प्रावीण्य. महान राजयोग.",
    en: "5th lord in own house — many virtuous progeny, extremely intelligent, huge past-life merit. Mastery in spirituality/mantras. Great Raja Yoga.",
  },
  "5-6": {
    mr: "पंचमेश षष्ठात असल्याने संततीच्या आरोग्याची काळजी, शिक्षणात अडथळे शक्य. मुलांशी मतभेद. सट्टा-गुंतवणुकीत हानी.",
    en: "5th lord in 6th — progeny health concerns, possible educational obstacles. Disagreements with children. Loss in speculation.",
  },
  "5-7": {
    mr: "पंचमेश सप्तमात असल्याने प्रेमविवाह, जोडीदार बुद्धिमान. संततिसौख्य विवाहानंतर. भागीदारीत बौद्धिक व्यवसाय.",
    en: "5th lord in 7th — love marriage, intelligent spouse. Progeny happiness after marriage. Intellectual business in partnership.",
  },
  "5-8": {
    mr: "पंचमेश अष्टमात असल्याने संततिच्या आरोग्याची चिंता, गर्भधारणेत विलंब. गूढ विद्यांमध्ये रुचि. आयुर्वेदिक ज्ञान.",
    en: "5th lord in 8th — progeny health concerns, delayed conception. Interest in occult sciences. Ayurvedic knowledge.",
  },
  "5-9": {
    mr: "पंचमेश नवमात असल्याने भाग्यवान संतति, अत्यंत पुण्यवान. धर्म-शिक्षणातून कीर्ती. गुरुकृपा. पूर्वपुण्य प्रचंड.",
    en: "5th lord in 9th — fortunate progeny, exceptionally pious. Fame through dharma/education. Guru's grace. Immense past-life merit.",
  },
  "5-10": {
    mr: "पंचमेश दशमात असल्याने कर्मक्षेत्रात बुद्धिमत्तेचे फल, कलेतून कीर्ती. संततीमार्फत यश. शासकीय नोकरीत सल्लागार.",
    en: "5th lord in 10th — intellectual success in career, fame through arts. Success via progeny. Advisor in govt service.",
  },
  "5-11": {
    mr: "पंचमेश एकादशात असल्याने संततीकडून लाभ, बौद्धिक उद्योगातून मोठा फायदा. गुंतवणुकीत यश. इच्छापूर्ती सहज.",
    en: "5th lord in 11th — gains through progeny, great benefit from intellectual ventures. Investment success. Desires easily fulfilled.",
  },
  "5-12": {
    mr: "पंचमेश द्वादशात असल्याने संतति परदेशी, शिक्षणावर खर्च जास्त. आध्यात्मिक मुले. एकांत-चिंतनात बुद्धि-विकास.",
    en: "5th lord in 12th — progeny abroad, high educational expenses. Spiritual children. Intellectual growth in solitary contemplation.",
  },

  // ─── 6th Lord (Rogesh/Shatrushesh) ─────────────────────────
  "6-1": {
    mr: "षष्ठेश लग्नात असल्याने आरोग्य सांभाळावे, स्वतःचाच शत्रू बनण्याची प्रवृत्ती. परंतु तीक्ष्ण बुद्धी, सेवासंस्थेत यश. कठोर परिश्रमी.",
    en: "6th lord in 1st — guard health, tendency to be own enemy. But sharp intellect, success in service organizations. Hardworking.",
  },
  "6-2": {
    mr: "षष्ठेश द्वितीयात असल्याने वाणीमुळे तंटे, शत्रूंकडून धनहानी. कर्जबाजारी होण्याची शक्यता. कौटुंबिक आरोग्य खर्च.",
    en: "6th lord in 2nd — disputes through speech, wealth loss via enemies. Possibility of debts. Family health expenses.",
  },
  "6-3": {
    mr: "षष्ठेश तृतीयात असल्याने भावंडांशी मतभेद परंतु शत्रूंवर पराक्रम. सैन्य-पोलीस करिअर. धाडसी. अल्प प्रवासात जोखीम.",
    en: "6th lord in 3rd — disputes with siblings but valor over enemies. Military/police career. Bold. Risks in short travels.",
  },
  "6-4": {
    mr: "षष्ठेश चतुर्थात असल्याने गृह-विवाद, मातृ-आरोग्य चिंता. भूमि-तंटे शक्य. वाहन-दुर्घटना जपावी. शेजारी शत्रुत्व.",
    en: "6th lord in 4th — domestic disputes, mother's health concerns. Possible land disputes. Guard against vehicle accidents. Neighbor hostility.",
  },
  "6-5": {
    mr: "षष्ठेश पंचमात असल्याने संततिच्या आरोग्याकडे लक्ष, शिक्षणात अडथळे. सट्टा-जुगारात हानी. मुलांशी वैचारिक मतभेद.",
    en: "6th lord in 5th — attention to progeny's health, educational obstacles. Loss in speculation/gambling. Ideological differences with children.",
  },
  "6-6": {
    mr: "षष्ठेश स्वगृही असल्याने हर्षयोग! शत्रूंवर पूर्ण विजय, आजारांवर मात, कर्जमुक्ती. अत्यंत परिश्रमी, सेवाक्षेत्रात मोठे यश.",
    en: "6th lord in own house — Harsha Yoga! Total victory over enemies, recovery from diseases, debt-freedom. Extremely hardworking, great success in service.",
  },
  "6-7": {
    mr: "षष्ठेश सप्तमात असल्याने वैवाहिक तणाव, जोडीदाराच्या आरोग्याची काळजी. भागीदारीत विवाद. कायदेशीर तंटे. सावध व्हा.",
    en: "6th lord in 7th — marital tension, spouse's health concerns. Partnership disputes. Legal disputes. Be cautious.",
  },
  "6-8": {
    mr: "षष्ठेश अष्टमात असल्याने विपरीत राजयोग! शत्रू पराभूत, लपलेले रोग बरे. वारसाहक्कात लाभ. गूढविद्या प्रावीण्य.",
    en: "6th lord in 8th — Vipreet Raja Yoga! Enemies defeated, hidden diseases cured. Inheritance gains. Mastery in occult sciences.",
  },
  "6-9": {
    mr: "षष्ठेश नवमात असल्याने पित्याचे आरोग्य सांभाळावे, धार्मिक तंटे. तीर्थयात्रेत अडथळे. गुरु-विरोध. कायदेशीर विवाद.",
    en: "6th lord in 9th — guard father's health, religious disputes. Obstacles in pilgrimage. Guru opposition. Legal disputes.",
  },
  "6-10": {
    mr: "षष्ठेश दशमात असल्याने नोकरीत अडचणी परंतु शेवटी विजय. सेवाक्षेत्रात कीर्ती. वैद्यकीय-कायदा-सैन्य क्षेत्रात यश.",
    en: "6th lord in 10th — career obstacles but eventual victory. Fame in service sector. Success in medical/law/military fields.",
  },
  "6-11": {
    mr: "षष्ठेश एकादशात असल्याने कर्जमुक्ती, शत्रूंमार्फत लाभ. सेवा-क्षेत्रातून मोठे उत्पन्न. आरोग्य-व्यवसायातून समृद्धी.",
    en: "6th lord in 11th — debt-freedom, gains through enemies. Large income from service sector. Prosperity from health business.",
  },
  "6-12": {
    mr: "षष्ठेश द्वादशात असल्याने रुग्णालय-खर्च, लपलेले शत्रू. परंतु विपरीत राजयोग — शेवटी शत्रू संपतात. आजारावर मात शक्य.",
    en: "6th lord in 12th — hospital expenses, hidden enemies. But Vipreet Raja Yoga — enemies eventually destroyed. Recovery from illness possible.",
  },

  // ─── 7th Lord (Kalatresh) ──────────────────────────────────
  "7-1": {
    mr: "सप्तमेश लग्नात असल्याने जोडीदाराचे व्यक्तिमत्त्वावर प्रभाव, प्रवासी वृत्ती, भागीदारीत जीवन. विवाहानंतर मोठा बदल.",
    en: "7th lord in 1st — spouse's influence on personality, travel-oriented, partnership life. Major change post-marriage.",
  },
  "7-2": {
    mr: "सप्तमेश द्वितीयात असल्याने जोडीदाराकडून धनलाभ, कौटुंबिक सौख्य. विवाहानंतर आर्थिक उन्नती. भागीदारी व्यापारात यश.",
    en: "7th lord in 2nd — wealth through spouse, family happiness. Financial rise after marriage. Success in partnership trade.",
  },
  "7-3": {
    mr: "सप्तमेश तृतीयात असल्याने जोडीदार शेजारी/नातेवाईकांतून, अल्प प्रवासात ओळख. भावंडांमार्फत विवाह. साहसी जोडीदार.",
    en: "7th lord in 3rd — spouse from neighborhood/relatives, met through short travel. Marriage through siblings. Bold spouse.",
  },
  "7-4": {
    mr: "सप्तमेश चतुर्थात असल्याने जोडीदार गृहसुख आणतो, सासू-सासरे सांभाळ. विवाहानंतर घर-जमीन लाभ. वाहनांद्वारे प्रवास.",
    en: "7th lord in 4th — spouse brings home happiness, care of in-laws. Home/land gains after marriage. Travel via vehicles.",
  },
  "7-5": {
    mr: "सप्तमेश पंचमात असल्याने प्रेमविवाह संभव, संततिसौख्य विवाहानंतर. जोडीदार बुद्धिमान. कलेत-सहकार्यात यश.",
    en: "7th lord in 5th — love marriage possible, progeny joy post-marriage. Intelligent spouse. Success in collaborative arts.",
  },
  "7-6": {
    mr: "सप्तमेश षष्ठात असल्याने विवाहात मतभेद, आरोग्य-चिंता. जोडीदाराशी कायदेशीर तंटे शक्य. विवाहात उशीर.",
    en: "7th lord in 6th — marital discord, health concerns. Possible legal disputes with spouse. Marriage delays.",
  },
  "7-7": {
    mr: "सप्तमेश स्वगृही असल्याने उत्तम जोडीदार, भागीदारीत मोठे यश. व्यवसायात आंतरराष्ट्रीय संपर्क. विवाह सुखमय.",
    en: "7th lord in own house — excellent spouse, great success in partnerships. International connections in business. Happy marriage.",
  },
  "7-8": {
    mr: "सप्तमेश अष्टमात असल्याने जोडीदाराच्या आयुरारोग्याची चिंता, गुप्त विवाह-संबंध शक्य. भागीदारीत अनपेक्षित वळण.",
    en: "7th lord in 8th — spouse's longevity concerns, possible secret marriage relations. Unexpected turns in partnerships.",
  },
  "7-9": {
    mr: "सप्तमेश नवमात असल्याने भाग्यवान जोडीदार, विवाह भाग्य आणतो. परदेशातून किंवा दूरवरून संबंध. धार्मिक जोडीदार.",
    en: "7th lord in 9th — fortunate spouse, marriage brings fortune. Relation from foreign/far place. Religious spouse.",
  },
  "7-10": {
    mr: "सप्तमेश दशमात असल्याने जोडीदार कर्मक्षेत्रात सहकार्य, व्यवसाय-भागीदारी. परदेशी करिअर. सार्वजनिक जीवन.",
    en: "7th lord in 10th — spouse's career support, business partnerships. Foreign career. Public life.",
  },
  "7-11": {
    mr: "सप्तमेश एकादशात असल्याने विवाहामार्फत मोठा लाभ, विस्तृत मित्र-वर्तुळ. जोडीदाराचे मित्र आधार. भागीदारी यशस्वी.",
    en: "7th lord in 11th — great gains via marriage, wide friend circle. Spouse's friends support. Successful partnerships.",
  },
  "7-12": {
    mr: "सप्तमेश द्वादशात असल्याने जोडीदार परदेशी, विवाहानंतर खर्च वाढ. वैवाहिक एकांत. शयनसुख उत्तम परंतु अहं-मुक्त.",
    en: "7th lord in 12th — spouse abroad, expenses rise post-marriage. Marital solitude. Good bedroom pleasure but ego-free.",
  },

  // ─── 8th Lord (Ayushesh) ───────────────────────────────────
  "8-1": {
    mr: "अष्टमेश लग्नात असल्याने शरीर-आरोग्य सांभाळावे, गूढ विद्यांमध्ये रुचि. संशोधक वृत्ती. आयुष्याच्या मध्यावर मोठा बदल.",
    en: "8th lord in 1st — guard body/health, interest in occult. Research mind. Major change mid-life.",
  },
  "8-2": {
    mr: "अष्टमेश द्वितीयात असल्याने वारसा-संपत्ती संभव, उत्पन्नात अस्थिरता. वाणीवर नियंत्रण आवश्यक. कौटुंबिक गुप्त प्रकरणे.",
    en: "8th lord in 2nd — inheritance possible, unstable income. Control speech. Family secret matters.",
  },
  "8-3": {
    mr: "अष्टमेश तृतीयात असल्याने भावंडांच्या आरोग्याची काळजी, गुप्त प्रवास. संशोधनात्मक लेखन. अनपेक्षित मृत्यु-जवळीक.",
    en: "8th lord in 3rd — sibling health concerns, secret travels. Research-oriented writing. Unexpected close encounters with mortality.",
  },
  "8-4": {
    mr: "अष्टमेश चतुर्थात असल्याने मातृ-आरोग्य चिंता, वारसाहक्काने घर. गृहात लपलेल्या गोष्टी. भूमि-वाद शक्य.",
    en: "8th lord in 4th — mother's health concerns, home through inheritance. Hidden things in home. Possible land disputes.",
  },
  "8-5": {
    mr: "अष्टमेश पंचमात असल्याने संततिच्या आरोग्याची चिंता, गूढविद्या-मंत्रसिद्धी. बुद्धीला अचानक कल्पना. सट्टा-जोखीम.",
    en: "8th lord in 5th — progeny health concerns, occult/mantra-siddhi. Sudden ideas. Speculation risks.",
  },
  "8-6": {
    mr: "अष्टमेश षष्ठात असल्याने विपरीत राजयोग! रोगावर मात, शत्रूंचा नाश. वैद्यकीय-संशोधन क्षेत्रात कीर्ती.",
    en: "8th lord in 6th — Vipreet Raja Yoga! Recovery from disease, enemies destroyed. Fame in medical/research fields.",
  },
  "8-7": {
    mr: "अष्टमेश सप्तमात असल्याने जोडीदाराच्या आयुरारोग्याची चिंता, भागीदारीत गुप्त अटी. विवाहानंतर मोठा जीवन-बदल.",
    en: "8th lord in 7th — spouse's longevity concerns, secret partnership terms. Major life change post-marriage.",
  },
  "8-8": {
    mr: "अष्टमेश स्वगृही असल्याने दीर्घायु, विपरीत राजयोग, गूढ विद्या प्रावीण्य. संशोधक-तपस्वी. आयुर्वेदिक-ज्योतिष ज्ञान.",
    en: "8th lord in own house — long life, Vipreet Raja Yoga, mastery of occult. Researcher-ascetic. Ayurvedic/astrological knowledge.",
  },
  "8-9": {
    mr: "अष्टमेश नवमात असल्याने पित्याच्या आयुरारोग्याची चिंता, अचानक भाग्यवृद्धी. धार्मिक बदल. गुरुकडून गूढ ज्ञान.",
    en: "8th lord in 9th — father's longevity concerns, sudden rise in fortune. Religious change. Occult knowledge from guru.",
  },
  "8-10": {
    mr: "अष्टमेश दशमात असल्याने कर्मक्षेत्रात अनपेक्षित वळण, घोटाळ्यांची शक्यता. संशोधन-गुप्तसेवा क्षेत्रात यश.",
    en: "8th lord in 10th — unexpected career turns, scandal possibility. Success in research/intelligence fields.",
  },
  "8-11": {
    mr: "अष्टमेश एकादशात असल्याने गुप्त स्रोतातून लाभ, वारसाहक्काने धन. अकस्मात मोठी संपत्ती शक्य.",
    en: "8th lord in 11th — gains from hidden sources, wealth via inheritance. Possibility of sudden great wealth.",
  },
  "8-12": {
    mr: "अष्टमेश द्वादशात असल्याने मोक्षकारक योग, आध्यात्मिक प्रगती. लपलेले खर्च. विदेशात संशोधन.",
    en: "8th lord in 12th — moksha-giving yoga, spiritual progress. Hidden expenses. Research abroad.",
  },

  // ─── 9th Lord (Bhagyesh) ───────────────────────────────────
  "9-1": {
    mr: "नवमेश लग्नात असल्याने भाग्यवान, धार्मिक, पितृ-आशीर्वाद सदैव. स्वतःच्या भाग्यावर यश. गुरुकृपा. न्यायप्रिय स्वभाव.",
    en: "9th lord in 1st — fortunate, religious, always father's blessings. Success through own fortune. Guru's grace. Just nature.",
  },
  "9-2": {
    mr: "नवमेश द्वितीयात असल्याने धर्ममार्गाने धनप्राप्ती, पित्याकडून संपत्ती. कौटुंबिक भाग्य उत्तम. तीर्थयात्रेवर खर्च.",
    en: "9th lord in 2nd — wealth through dharma, property from father. Excellent family fortune. Expenses on pilgrimages.",
  },
  "9-3": {
    mr: "नवमेश तृतीयात असल्याने भाग्यवान भावंडे, धार्मिक लेखन, तीर्थयात्रा. शास्त्र-ज्ञानी. गुरु-उपदेशातून मार्गदर्शन.",
    en: "9th lord in 3rd — fortunate siblings, religious writing, pilgrimages. Scripture-knowledgeable. Guidance from guru.",
  },
  "9-4": {
    mr: "नवमेश चतुर्थात असल्याने मातृ-भाग्य, धार्मिक घर. गृह-संपत्ती भाग्यावर. तीर्थक्षेत्रात निवास. मानसिक शांती.",
    en: "9th lord in 4th — maternal fortune, religious home. Home/property via fortune. Residence in pilgrim place. Mental peace.",
  },
  "9-5": {
    mr: "नवमेश पंचमात असल्याने भाग्यवान संतति, अत्यंत पुण्यवान. गुरुकृपा. धार्मिक कलेत यश. पूर्वपुण्याचे मोठे फल.",
    en: "9th lord in 5th — fortunate progeny, extremely pious. Guru's grace. Success in religious arts. Great fruit of past merit.",
  },
  "9-6": {
    mr: "नवमेश षष्ठात असल्याने पित्याशी मतभेद, धार्मिक तंटे. परंतु शत्रूंवर विजय. कायदेशीर यश. सेवेत भाग्य.",
    en: "9th lord in 6th — disputes with father, religious disputes. But victory over enemies. Legal success. Fortune in service.",
  },
  "9-7": {
    mr: "नवमेश सप्तमात असल्याने भाग्यवान जोडीदार, विवाहाने भाग्यवृद्धी. परदेशी भागीदारी. धार्मिक विवाह.",
    en: "9th lord in 7th — fortunate spouse, marriage brings fortune. Foreign partnerships. Religious marriage.",
  },
  "9-8": {
    mr: "नवमेश अष्टमात असल्याने पित्याच्या आरोग्याची चिंता, अनपेक्षित वारसा-भाग्य. गूढ धार्मिक ज्ञान.",
    en: "9th lord in 8th — father's health concerns, unexpected inheritance-fortune. Esoteric religious knowledge.",
  },
  "9-9": {
    mr: "नवमेश स्वगृही असल्याने सर्वोच्च भाग्य, धार्मिक-तपस्वी, पितृकृपा असीम. महान राजयोग. मानवतावादी.",
    en: "9th lord in own house — supreme fortune, religious-ascetic, unlimited paternal grace. Great Raja Yoga. Humanitarian.",
  },
  "9-10": {
    mr: "नवमेश दशमात असल्याने धर्ममार्गाने कर्मक्षेत्र, न्यायाधीश-गुरु-शिक्षक करिअर. शासकीय कीर्ती. धर्मराज्य यशस्वी.",
    en: "9th lord in 10th — dharma-oriented career, judge/guru/teacher. Govt fame. Successful righteous rule.",
  },
  "9-11": {
    mr: "नवमेश एकादशात असल्याने प्रचंड लाभ, भाग्यवान मित्र. विदेशी उत्पन्न. तीर्थातून संपत्ती. इच्छापूर्ती.",
    en: "9th lord in 11th — huge gains, fortunate friends. Foreign income. Wealth from pilgrimages. Desire fulfillment.",
  },
  "9-12": {
    mr: "नवमेश द्वादशात असल्याने परदेशी भाग्य, आध्यात्मिक तीर्थयात्रा. मोक्षाकडे वाटचाल. विदेशात संपत्ती-कीर्ती.",
    en: "9th lord in 12th — foreign fortune, spiritual pilgrimages. Toward moksha. Wealth/fame abroad.",
  },

  // ─── 10th Lord (Karmesh) ───────────────────────────────────
  "10-1": {
    mr: "दशमेश लग्नात असल्याने स्व-निर्मित करिअर कीर्ती, अधिकारपद, नेतृत्वगुण. शासकीय कृपा. स्वाभिमानी व्यक्तिमत्त्व.",
    en: "10th lord in 1st — self-made career fame, authority, leadership. Govt favor. Self-respecting personality.",
  },
  "10-2": {
    mr: "दशमेश द्वितीयात असल्याने कर्मक्षेत्रातून धनलाभ, शासकीय उत्पन्न. प्रतिष्ठित व्यवसाय. कौटुंबिक कीर्ती.",
    en: "10th lord in 2nd — income via career, govt earnings. Prestigious profession. Family fame.",
  },
  "10-3": {
    mr: "दशमेश तृतीयात असल्याने पराक्रमातून करिअर, लेखन-मीडिया-पत्रकारिता-खेळ. भावंडे सत्तापदी. स्वतःच्या प्रयत्नातून यश.",
    en: "10th lord in 3rd — career through valor, writing/media/journalism/sports. Siblings in authority. Success through self-effort.",
  },
  "10-4": {
    mr: "दशमेश चतुर्थात असल्याने गृह-शेती-रियलइस्टेट करिअर, मातृसांनिध्यात काम. वाहन-उद्योग. शासकीय कृपेने घर.",
    en: "10th lord in 4th — home/agriculture/real-estate career, work near mother. Vehicle industry. Home via govt favor.",
  },
  "10-5": {
    mr: "दशमेश पंचमात असल्याने सर्जनशील करिअर, कला-शिक्षण-सल्लागार क्षेत्र. संततीद्वारे कीर्ती. राजयोग.",
    en: "10th lord in 5th — creative career, arts/education/advisor field. Fame via progeny. Raja Yoga.",
  },
  "10-6": {
    mr: "दशमेश षष्ठात असल्याने सेवाक्षेत्रात यश, वैद्यकीय-कायदा-सैन्य. नोकरीत अडचणी परंतु शेवटी विजय.",
    en: "10th lord in 6th — success in service sector, medical/law/military. Career obstacles but eventual victory.",
  },
  "10-7": {
    mr: "दशमेश सप्तमात असल्याने भागीदारी व्यवसाय, विदेशी करिअर. जोडीदाराचे कर्मक्षेत्रात सहकार्य. सार्वजनिक जीवन.",
    en: "10th lord in 7th — partnership business, foreign career. Spouse's career support. Public life.",
  },
  "10-8": {
    mr: "दशमेश अष्टमात असल्याने करिअरमध्ये अनपेक्षित वळण, संशोधन-गुप्तसेवा. घोटाळ्याची शक्यता. परिवर्तनकारी काम.",
    en: "10th lord in 8th — unexpected career turns, research/intelligence work. Scandal possibility. Transformative work.",
  },
  "10-9": {
    mr: "दशमेश नवमात असल्याने धर्मयुक्त करिअर, न्यायाधीश-शिक्षक-गुरु. शासकीय कृपा. विदेश-परदेशी कर्मयोग.",
    en: "10th lord in 9th — dharmic career, judge/teacher/guru. Govt favor. Foreign work-yoga.",
  },
  "10-10": {
    mr: "दशमेश स्वगृही असल्याने सर्वोच्च कर्मयोग, महान कीर्ती, दिग्बल राजयोग. सत्ता-पद-प्रतिष्ठा चरमसीमेवर.",
    en: "10th lord in own house — supreme karma yoga, great fame, Digbala Raja Yoga. Power-status-prestige at peak.",
  },
  "10-11": {
    mr: "दशमेश एकादशात असल्याने करिअरमधून प्रचंड लाभ, शासकीय मानधन-पदोन्नती. उच्च पद. विस्तृत व्यावसायिक नेटवर्क.",
    en: "10th lord in 11th — huge gains through career, govt allowances/promotions. High position. Wide professional network.",
  },
  "10-12": {
    mr: "दशमेश द्वादशात असल्याने परदेशी करिअर, पडद्यामागे काम. आध्यात्मिक सेवा. करिअरवर मोठा खर्च.",
    en: "10th lord in 12th — foreign career, behind-scenes work. Spiritual service. High career expenses.",
  },

  // ─── 11th Lord (Labhesh) ───────────────────────────────────
  "11-1": {
    mr: "एकादशेश लग्नात असल्याने स्वतःच्या प्रयत्नांनी मोठे लाभ, मोठ्या भावंडांचा आधार. इच्छित प्राप्ती. सामाजिक ओळख.",
    en: "11th lord in 1st — great gains through own efforts, elder sibling support. Desired attainment. Social recognition.",
  },
  "11-2": {
    mr: "एकादशेश द्वितीयात असल्याने अनेक उत्पन्न-स्रोतांतून धनलाभ, कौटुंबिक समृद्धी. व्यवसाय-वाढ. संचय उत्तम.",
    en: "11th lord in 2nd — wealth from multiple income sources, family prosperity. Business growth. Good accumulation.",
  },
  "11-3": {
    mr: "एकादशेश तृतीयात असल्याने भावंडांमार्फत लाभ, अल्प प्रवास-उत्पन्न. लेखन-मीडिया लाभ. साहसातून यश.",
    en: "11th lord in 3rd — gains through siblings, short travel income. Writing/media gains. Success through daring.",
  },
  "11-4": {
    mr: "एकादशेश चतुर्थात असल्याने गृह-संपत्ती-वाहन लाभ, मातृ-पाठिंबा आर्थिक. शेती-भूमि उत्पन्न. स्थिर संपत्ती.",
    en: "11th lord in 4th — home/property/vehicle gains, maternal financial support. Agriculture/land income. Stable wealth.",
  },
  "11-5": {
    mr: "एकादशेश पंचमात असल्याने संततीकडून लाभ, बुद्धी-कलेतून उत्पन्न. गुंतवणूक-सट्ट्यात यश. पूर्वपुण्य फल.",
    en: "11th lord in 5th — gains through progeny, income from intellect/arts. Success in investment/speculation. Past-merit fruit.",
  },
  "11-6": {
    mr: "एकादशेश षष्ठात असल्याने कर्जमुक्ती, सेवाक्षेत्रातून लाभ. शत्रूंद्वारे अप्रत्यक्ष उत्पन्न. आरोग्य-व्यवसायात यश.",
    en: "11th lord in 6th — debt-freedom, gains from service sector. Indirect income via enemies. Success in health business.",
  },
  "11-7": {
    mr: "एकादशेश सप्तमात असल्याने विवाह-भागीदारीतून लाभ, विस्तृत व्यवसाय-नेटवर्क. जोडीदारामुळे आर्थिक प्रगती.",
    en: "11th lord in 7th — gains from marriage/partnership, wide business network. Financial progress through spouse.",
  },
  "11-8": {
    mr: "एकादशेश अष्टमात असल्याने गुप्त स्रोत-वारसातून लाभ, अनपेक्षित संपत्ती. जोडीदाराच्या कुटुंबाकडून.",
    en: "11th lord in 8th — gains from hidden sources/inheritance, unexpected wealth. From spouse's family.",
  },
  "11-9": {
    mr: "एकादशेश नवमात असल्याने धर्ममार्गातून मोठा लाभ, विदेशी उत्पन्न. भाग्यवान मित्र. तीर्थयात्रांतून फायदा.",
    en: "11th lord in 9th — great gains through dharma, foreign income. Fortunate friends. Benefit from pilgrimages.",
  },
  "11-10": {
    mr: "एकादशेश दशमात असल्याने करिअरमधून प्रचंड धन-कीर्ती, शासकीय पदोन्नती. व्यवसाय-विस्तार. नेटवर्किंग शक्ति.",
    en: "11th lord in 10th — huge wealth/fame through career, govt promotions. Business expansion. Networking power.",
  },
  "11-11": {
    mr: "एकादशेश स्वगृही असल्याने सर्वोच्च लाभयोग, विस्तृत मित्र-वर्तुळ. इच्छापूर्ती सहज. आर्थिक साम्राज्य.",
    en: "11th lord in own house — supreme gains yoga, wide friend circle. Easy desire fulfillment. Financial empire.",
  },
  "11-12": {
    mr: "एकादशेश द्वादशात असल्याने परदेशातून लाभ, दान-धर्मात खर्च. आध्यात्मिक मित्र. उत्पन्न मिळते पण खर्चही होते.",
    en: "11th lord in 12th — gains from abroad, charity expenses. Spiritual friends. Income arrives but also departs.",
  },

  // ─── 12th Lord (Vyayesh) ───────────────────────────────────
  "12-1": {
    mr: "द्वादशेश लग्नात असल्याने खर्चिक प्रवृत्ती, आध्यात्मिक वृत्ती, एकांत-प्रिय. आरोग्य सांभाळावे. परदेश-गमन.",
    en: "12th lord in 1st — expenditure tendency, spiritual nature, solitude-loving. Guard health. Foreign travel.",
  },
  "12-2": {
    mr: "द्वादशेश द्वितीयात असल्याने बचत कमी, खर्च जास्त. विदेशी उत्पन्न परंतु तिथेच खर्च. दान-धर्म.",
    en: "12th lord in 2nd — low savings, high expenses. Foreign income but spent there itself. Charity-dharma.",
  },
  "12-3": {
    mr: "द्वादशेश तृतीयात असल्याने भावंडांवर खर्च, प्रवास-खर्च. पराक्रम निष्फळ वाटू शकतो. एकांत लेखन.",
    en: "12th lord in 3rd — expenses on siblings, travel expenses. Valor may feel unrewarded. Solitary writing.",
  },
  "12-4": {
    mr: "द्वादशेश चतुर्थात असल्याने घर-नवीकरण खर्च, मातेचे वियोग शक्य. परदेशात घर. वाहन खर्च जास्त.",
    en: "12th lord in 4th — home renovation expenses, possible separation from mother. Home abroad. High vehicle expenses.",
  },
  "12-5": {
    mr: "द्वादशेश पंचमात असल्याने संततीवर खर्च, शिक्षण-खर्च. आध्यात्मिक मुले. मंत्रसाधनेत लीन.",
    en: "12th lord in 5th — expenses on progeny, education expenses. Spiritual children. Absorbed in mantra-sadhana.",
  },
  "12-6": {
    mr: "द्वादशेश षष्ठात असल्याने विपरीत राजयोग, शत्रू-रोग-कर्ज नष्ट. रुग्णालय-खर्चाचे रूपांतर लाभात. दान-फल.",
    en: "12th lord in 6th — Vipreet Raja Yoga, enemies/disease/debts destroyed. Hospital expense transforms to gain. Fruit of charity.",
  },
  "12-7": {
    mr: "द्वादशेश सप्तमात असल्याने जोडीदार परदेशी किंवा परदेशात स्थायिक. भागीदारीत खर्च. शयनसौख्य.",
    en: "12th lord in 7th — spouse foreign or settled abroad. Expenses in partnerships. Bedroom happiness.",
  },
  "12-8": {
    mr: "द्वादशेश अष्टमात असल्याने विपरीत राजयोग, गूढ-खर्चाचे रूपांतर. दीर्घायु. मोक्षकारक. लपलेली संपत्ती अचानक.",
    en: "12th lord in 8th — Vipreet Raja Yoga, transformation of occult expenses. Longevity. Moksha-giving. Hidden wealth suddenly.",
  },
  "12-9": {
    mr: "द्वादशेश नवमात असल्याने धार्मिक दानधर्म, तीर्थयात्रेवर खर्च. परदेशी शिक्षण. आध्यात्मिक गुरु-सेवा.",
    en: "12th lord in 9th — religious charity, pilgrimage expenses. Foreign education. Spiritual guru-service.",
  },
  "12-10": {
    mr: "द्वादशेश दशमात असल्याने परदेशी करिअर, करिअरसाठी मोठा खर्च. पडद्यामागे कामे. सार्वजनिक व्यय.",
    en: "12th lord in 10th — foreign career, big career expenses. Behind-scenes work. Public expenditure.",
  },
  "12-11": {
    mr: "द्वादशेश एकादशात असल्याने सामाजिक व्ययातून लाभ, दानधर्मातून पुण्य. मित्रांवर खर्च पण परत मिळतो.",
    en: "12th lord in 11th — gains through social expenditure, merit via charity. Expense on friends but returns.",
  },
  "12-12": {
    mr: "द्वादशेश स्वगृही असल्याने मोक्षकारक योग, आध्यात्मिक चरम. विरक्ती. परदेशातच जीवन. मोठा तपस्वी-योग.",
    en: "12th lord in own house — moksha-giving yoga, spiritual peak. Renunciation. Life abroad. Great ascetic yoga.",
  },
};
