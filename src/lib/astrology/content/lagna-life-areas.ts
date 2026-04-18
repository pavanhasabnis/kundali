/**
 * Lagna life-area predictions — 72 snippets (12 lagnas × 6 areas).
 * Areas: physical, mental, education, career, marriage, finance.
 * Based on classical Parashari lagna-phala tradition.
 * Key: `${rashiIndex}-${area}` e.g. "0-physical" = Aries lagna physical.
 */

import type { BilingualSnippet } from "./types";

export type LifeArea = "physical" | "mental" | "education" | "career" | "marriage" | "finance";

export const LAGNA_LIFE_AREAS: Record<string, BilingualSnippet> = {
  // ─── MESH / ARIES ──────────────────────────────────────────
  "0-physical": {
    mr: "मेष लग्न — अँथलेटिक, स्नायुयुक्त शरीर, लाल छटा, तेजस्वी चेहरा. डोक्यावर चट्टा-जखम शक्य. तीक्ष्ण नाक-भुवया. तरुण-ऊर्जावान. रक्त-पित्त प्रकृती. वेगवान हालचाली.",
    en: "Aries lagna — athletic, muscular body, ruddy complexion, bright face. Possible head scars. Sharp nose-eyebrows. Youthful-energetic. Blood-pitta constitution. Swift movements.",
  },
  "0-mental": {
    mr: "मेष लग्न — धाडसी, अधीर, नेतृत्वप्रिय, अग्निमय स्वभाव. राग लवकर पण लवकर शांत. नवीनतेचे वेड. स्पर्धात्मक. आत्मविश्वास चरमावर. विचार करून कृती कमी.",
    en: "Aries lagna — bold, impatient, leadership-loving, fiery nature. Quick anger, quick calm. Obsessed with newness. Competitive. Peak confidence. Less reflection before action.",
  },
  "0-education": {
    mr: "मेष लग्न — चपळ शिकाऊ पण एका विषयावर स्थिर नाही. तंत्रज्ञान-अभियांत्रिकी-सैन्य शिक्षणात यश. व्यावहारिक शिक्षण. दीर्घ सैद्धांतिक अभ्यासात अडथळा. स्पर्धा परीक्षांत यश.",
    en: "Aries lagna — quick learner but not stable on one subject. Success in technology/engineering/military education. Practical learning. Obstacles in long theoretical study. Success in competitive exams.",
  },
  "0-career": {
    mr: "मेष लग्न — सैन्य, पोलिस, क्रीडा, शल्यक्रिया, अभियांत्रिकी, व्यवस्थापन क्षेत्रात उत्तम यश. स्वतंत्र व्यवसाय. नेतृत्वाची पदे. शासकीय सेवा. उद्योजकता. शारीरिक परिश्रमाचे काम.",
    en: "Aries lagna — excellent success in military, police, sports, surgery, engineering, management. Independent business. Leadership roles. Govt service. Entrepreneurship. Physical-labor work.",
  },
  "0-marriage": {
    mr: "मेष लग्न — जोडीदारावर प्रभुत्व, हक्काची भावना. सिंह-धनु राशीशी अनुकूल. तूळ राशीशी तणाव. वैवाहिक जीवनात तुम्ही अग्रेसर. जोडीदाराला स्वातंत्र्य द्या. मंगळदोष जपावा.",
    en: "Aries lagna — dominant over spouse, possessive. Compatible with Leo/Sagittarius. Tension with Libra. You lead in marriage. Give spouse freedom. Guard Mangal Dosh.",
  },
  "0-finance": {
    mr: "मेष लग्न — जलद कमाई, जोखीम-स्वीकारी, कधीकधी अविचारी खर्च. स्वतःच्या उद्योगातून संपत्ती. उधारी-कर्ज जपावे. साहसी गुंतवणूक. अचानक लाभ-हानी दोन्ही शक्य.",
    en: "Aries lagna — rapid earning, risk-taker, sometimes impulsive spending. Wealth through own enterprise. Guard loans/debts. Bold investments. Sudden gains-losses both possible.",
  },

  // ─── VRISHABHA / TAURUS ────────────────────────────────────
  "1-physical": {
    mr: "वृषभ लग्न — स्थूल-भरदार शरीर, गोल चेहरा, मोठे डोळे, दाट केस. आकर्षक-मादक. मानेचा भाग मजबूत. मध्यम उंची. वृषभ-सारखे सहनशील. आवाज मधुर.",
    en: "Vrishabha lagna — stout-sturdy body, round face, large eyes, thick hair. Attractive-magnetic. Strong neck. Medium height. Bull-like endurance. Sweet voice.",
  },
  "1-mental": {
    mr: "वृषभ लग्न — स्थिर, संयमी, हट्टी, व्यावहारिक, भोगप्रिय. निर्णय विचारपूर्वक. बदलाला विरोध. एकदा ठरवले की अचल. संवेदनशील पण शांत. निसर्ग-सौंदर्य प्रिय.",
    en: "Vrishabha lagna — stable, patient, stubborn, practical, pleasure-loving. Decisions after deliberation. Resistance to change. Once decided, unmoved. Sensitive but calm. Loves nature-beauty.",
  },
  "1-education": {
    mr: "वृषभ लग्न — स्थिर-दीर्घकालीन अभ्यास, कला-संगीत-वाणिज्य-कृषी शिक्षणात यश. व्यावहारिक ज्ञान प्रिय. स्मरणशक्ती उत्तम. भौतिक विज्ञान-अर्थशास्त्रात कल. कलाक्षेत्रात उत्तम.",
    en: "Vrishabha lagna — steady-long-term study, success in arts/music/commerce/agriculture. Practical knowledge-loving. Excellent memory. Inclination to material sciences/economics. Excellent in arts.",
  },
  "1-career": {
    mr: "वृषभ लग्न — बँकिंग, वित्त, विलासवस्तू, रिअल इस्टेट, संगीत, खाद्यउद्योग, कृषी, सौंदर्यप्रसाधने क्षेत्रात यश. स्थिर नोकरी प्रिय. व्यवसायात धीमा पण स्थायी उत्कर्ष.",
    en: "Vrishabha lagna — success in banking, finance, luxury goods, real estate, music, food industry, agriculture, cosmetics. Stable job-loving. Slow but lasting business rise.",
  },
  "1-marriage": {
    mr: "वृषभ लग्न — निष्ठावान, मालकी हक्काची भावना, भोगसौख्य. कन्या-मकर राशीशी अनुकूल. वृश्चिकाशी आव्हान. जोडीदार सुंदर. विवाहात स्थैर्य. कौटुंबिक मूल्ये.",
    en: "Vrishabha lagna — loyal, possessive, sensual joy. Compatible with Virgo/Capricorn. Challenge with Scorpio. Beautiful spouse. Stability in marriage. Family values.",
  },
  "1-finance": {
    mr: "वृषभ लग्न — स्थिर-संचयी संपत्ती, मालमत्ता-दागिने-बचत. धनसंग्रहात शिरोमणी. कलेमार्फत उत्पन्न. दीर्घकालीन गुंतवणूक. वृद्धत्वात संपत्ती. कधी कंजूषपणा.",
    en: "Vrishabha lagna — stable-accumulated wealth, property-jewelry-savings. Topmost in wealth-hoarding. Income via arts. Long-term investments. Wealth in old age. Sometimes miserly.",
  },

  // ─── MITHUN / GEMINI ───────────────────────────────────────
  "2-physical": {
    mr: "मिथुन लग्न — उंच-सडपातळ, तरुण-चपळ, बोलके हात. दोन अभिव्यक्ती — आनंद-चिंता. नाक तीक्ष्ण. आवाज पातळ-वेगवान. डोळे चमकदार. मानसिक ऊर्जा शारीरिकापेक्षा जास्त.",
    en: "Mithun lagna — tall-slim, youthful-agile, expressive hands. Two expressions — joy-worry. Sharp nose. Thin-fast voice. Bright eyes. Mental energy exceeds physical.",
  },
  "2-mental": {
    mr: "मिथुन लग्न — विनोदी, बहुमुखी, चंचल, जिज्ञासू, द्विस्वभावी. एकाच वेळी अनेक कल्पना. संवाद-प्रिय. निर्णयात अस्थिरता. नवनवे शिकायला आवडते. तर्क-वाद कौशल्य.",
    en: "Mithun lagna — witty, versatile, restless, curious, dual-natured. Multiple ideas simultaneously. Communication-loving. Decision-instability. Loves learning new. Reasoning-debate skill.",
  },
  "2-education": {
    mr: "मिथुन लग्न — भाषा-संवाद-तंत्रज्ञान-पत्रकारिता शिक्षणात चमक. बहुविद्याशाखीय अभ्यास. एकाग्रता कमी पण बुद्धी तीक्ष्ण. गणित-विज्ञान-कला यांमध्ये समानपणे प्रावीण्य.",
    en: "Mithun lagna — shine in languages/communication/technology/journalism. Multi-disciplinary study. Low focus but sharp intellect. Equal proficiency in math-science-arts.",
  },
  "2-career": {
    mr: "मिथुन लग्न — मीडिया, IT, पत्रकारिता, शिक्षण, व्यापार, वाहतूक, लेखन-प्रकाशन, जनसंपर्क क्षेत्रात यश. अनेक नोकऱ्या शक्य. एकाच वेळी अनेक प्रकल्प.",
    en: "Mithun lagna — success in media, IT, journalism, education, trade, transport, writing-publishing, PR. Multiple jobs possible. Multiple projects simultaneously.",
  },
  "2-marriage": {
    mr: "मिथुन लग्न — बौद्धिक जुळणी हवी, बद्ध होण्यास कठीण. तूळ-कुंभ राशीशी अनुकूल. धनुशी तणाव. जोडीदाराशी संवाद आवश्यक. चंचल भावना. विवाह-उशीर शक्य.",
    en: "Mithun lagna — need intellectual match, difficult to commit. Compatible with Libra/Aquarius. Tension with Sagittarius. Communication essential with spouse. Restless emotions. Marriage delays possible.",
  },
  "2-finance": {
    mr: "मिथुन लग्न — अनेक उत्पन्न-स्रोत, चतुराईने धनप्राप्ती, लेखन-संवादातून कमाई. कधी अतिखर्च. गुंतवणुकीत चंचल. अल्पकालीन नफा. दलाली-ब्रोकिंग-जाहिरातीत यश.",
    en: "Mithun lagna — multiple income sources, clever earning, income from writing-communication. Sometimes overspending. Restless in investments. Short-term profits. Success in brokering/advertising.",
  },

  // ─── KARK / CANCER ─────────────────────────────────────────
  "3-physical": {
    mr: "कर्क लग्न — गोल-सौम्य शरीर, चंद्रासम चेहरा, भावनिक डोळे, मध्यम उंची. पोटाचा भाग मऊ. त्वचा गोरी-पांढरी. स्त्रीसुलभ गुण. वयानुसार वजन वाढण्याची शक्यता.",
    en: "Kark lagna — round-soft body, moon-like face, emotional eyes, medium height. Soft belly. Fair-pale skin. Feminine qualities. Weight gain with age likely.",
  },
  "3-mental": {
    mr: "कर्क लग्न — भावनिक, काळजीवाहू, चंचल-मूड, अंतर्ज्ञानी. मातृ-स्वरूप. संवेदनशील. कधीकधी रागावणारे पण लगेच शांत. कल्पक-काव्यमय मन. कौटुंबिक जबाबदारी प्रिय.",
    en: "Kark lagna — emotional, caring, moody, intuitive. Mother-like. Sensitive. Sometimes irritable but quickly calm. Imaginative-poetic mind. Family responsibility-loving.",
  },
  "3-education": {
    mr: "कर्क लग्न — मानसशास्त्र-इतिहास-कला-नर्सिंग-पालन-पोषण विषयांत उत्तम. स्मरणशक्ती चांगली. भावनिक प्रसंगांतून शिकतात. पाककला-आहारशास्त्रात कल. मातृभाषेत प्रावीण्य.",
    en: "Kark lagna — excellent in psychology/history/arts/nursing/nurturing. Good memory. Learn from emotional experiences. Inclination to culinary-nutrition. Mother-tongue proficiency.",
  },
  "3-career": {
    mr: "कर्क लग्न — हॉस्पिटॅलिटी, खाद्य-उद्योग, नर्सिंग, रिअल इस्टेट, मातृ-सेवा, मानसशास्त्र, पाक-कला क्षेत्रात यश. मातेमार्फत करिअर. जल-संबंधी व्यवसाय.",
    en: "Kark lagna — success in hospitality, food industry, nursing, real estate, maternal-service, psychology, culinary arts. Career via mother. Water-related business.",
  },
  "3-marriage": {
    mr: "कर्क लग्न — भावनिक, समर्पित, कौटुंबिक. वृश्चिक-मीन राशीशी अनुकूल. मकराशी तणाव. जोडीदार मातृतुल्य सांभाळ करतो. विवाह-प्रेमात गहनता. भावनिक सुरक्षा महत्त्वाची.",
    en: "Kark lagna — emotional, devoted, family-oriented. Compatible with Scorpio/Pisces. Tension with Capricorn. Spouse cares maternally. Depth in marriage-love. Emotional security essential.",
  },
  "3-finance": {
    mr: "कर्क लग्न — अस्थिर उत्पन्न, कौटुंबिक आधारावर, सुरक्षेसाठी बचत. मातृ-संपत्ती लाभ. रिअल इस्टेट-कृषी उत्पन्न. कधी भावनिक खर्च. पारंपारिक गुंतवणूक.",
    en: "Kark lagna — variable income, family-dependent, saves for security. Maternal property gains. Real estate-agriculture income. Sometimes emotional spending. Traditional investments.",
  },

  // ─── SIMHA / LEO ───────────────────────────────────────────
  "4-physical": {
    mr: "सिंह लग्न — उंच-भव्य शरीर, सिंहासम चेहरा, दाट केस, राजेशाही उभारणी. रुंद छाती-भक्कम खांदे. आकर्षक व्यक्तिमत्त्व. डोळे चमकदार. आवाज गंभीर-मजबूत.",
    en: "Simha lagna — tall-majestic body, lion-like face, thick hair, regal posture. Broad chest-strong shoulders. Attractive personality. Bright eyes. Deep-strong voice.",
  },
  "4-mental": {
    mr: "सिंह लग्न — अभिमानी, आत्मविश्वासी, उदार, नाट्यमय, नेता. प्रशंसेची गरज. राजेशाही वृत्ती. अहंकार-जोखीम. कधी हुकूमशाही. परंतु हृदय मोठे. प्रामाणिक-निष्ठावान.",
    en: "Simha lagna — proud, confident, generous, dramatic, leader. Need admiration. Regal nature. Ego-risk. Sometimes authoritarian. But big-hearted. Honest-loyal.",
  },
  "4-education": {
    mr: "सिंह लग्न — नेतृत्व, नाट्य, राजकारण, प्रशासन विषयांत यश. उच्च शिक्षण प्रतिष्ठित संस्थांत. आत्मशिस्त चांगली. विषयात तज्ञ बनणे प्रिय. क्रीडा-कला-नाटकात चमक.",
    en: "Simha lagna — success in leadership, drama, politics, administration. Higher education in prestigious institutions. Good self-discipline. Love becoming expert. Shine in sports-arts-drama.",
  },
  "4-career": {
    mr: "सिंह लग्न — शासकीय, राजकारण, मनोरंजन, व्यवस्थापन, उच्च-पद, नेतृत्वाची पदे. स्वतःचा व्यवसाय प्रिय. अधिकारपद आकर्षित करते. सार्वजनिक व्यक्तिमत्त्व. कीर्ती-प्रिय.",
    en: "Simha lagna — govt, politics, entertainment, management, high-positions, leadership. Own business-loving. Attracted to authority. Public figure. Fame-loving.",
  },
  "4-marriage": {
    mr: "सिंह लग्न — प्रेमळ-प्रभावी, दिखाऊ, प्रशंसेची आस. मेष-धनु राशीशी अनुकूल. कुंभाशी तणाव. जोडीदार रूपवान-प्रतिष्ठित. विवाहात भव्यता. कौटुंबिक कीर्ती महत्त्वाची.",
    en: "Simha lagna — loving-influential, showy, craves admiration. Compatible with Aries/Sagittarius. Tension with Aquarius. Handsome-prestigious spouse. Grand marriage. Family fame matters.",
  },
  "4-finance": {
    mr: "सिंह लग्न — मोठे कमाई-मोठा खर्च, दर्जा-प्रिय, विलासवस्तू. शासकीय-राजकीय उत्पन्न. उदार दातृत्व. कधी अति-खर्च स्वप्रतिष्ठेसाठी. दीर्घकालीन गुंतवणूक.",
    en: "Simha lagna — big earning-big spending, status-loving, luxury goods. Govt-political income. Generous charity. Sometimes over-spending for self-prestige. Long-term investments.",
  },

  // ─── KANYA / VIRGO ─────────────────────────────────────────
  "5-physical": {
    mr: "कन्या लग्न — सडपातळ-नाजूक, तरुण दिसता, तीक्ष्ण वैशिष्ट्ये, मध्यम उंची. स्वच्छ त्वचा. प्रमाणबद्ध चेहरा. पचनसंस्था संवेदनशील. बुद्धिजीवी व्यक्तिमत्त्व.",
    en: "Kanya lagna — slim-delicate, youthful appearance, sharp features, medium height. Clear skin. Proportionate face. Sensitive digestion. Intellectual personality.",
  },
  "5-mental": {
    mr: "कन्या लग्न — विश्लेषक, तपशीलवार, परिपूर्णतावादी, सेवाभावी, टीकात्मक. प्रत्येक गोष्ट नीट हवी. कधी अति-चिंतेचे भार. सूक्ष्म निरीक्षण. विनम्र-विद्वान.",
    en: "Kanya lagna — analytical, detail-oriented, perfectionist, service-minded, critical. Want everything precise. Sometimes over-worry burden. Minute observation. Humble-scholarly.",
  },
  "5-education": {
    mr: "कन्या लग्न — वैद्यक, विश्लेषण, संशोधन, लेखा, लेखन, तपशीलवार विषयांत यश. परिपूर्ण अभ्यासक. गणित-विज्ञान-भाषा प्रिय. अचूकता शिरोमणी.",
    en: "Kanya lagna — success in medicine, analysis, research, accounting, writing, detail-oriented subjects. Perfect student. Math-science-languages-loving. Precision topmost.",
  },
  "5-career": {
    mr: "कन्या लग्न — वैद्यकीय, लेखा, लेखन, विश्लेषण, आरोग्य-सेवा, IT, संपादन, संशोधन क्षेत्रात उत्तम. सेवा-प्रिय. तपशील-तज्ज्ञ. स्वतःचा व्यवसाय देखील.",
    en: "Kanya lagna — excellent in medical, accounting, writing, analysis, health-services, IT, editing, research. Service-loving. Detail-expert. Own business too.",
  },
  "5-marriage": {
    mr: "कन्या लग्न — चिकित्सक परंतु काळजीवाहू, परिपूर्णता हवी. वृषभ-मकर राशीशी अनुकूल. मीनाशी तणाव. जोडीदाराच्या चुकांवर टीका. विवाह-उशीर. विचारपूर्वक निवड.",
    en: "Kanya lagna — critical but caring, need perfection. Compatible with Taurus/Capricorn. Tension with Pisces. Criticize spouse's faults. Marriage delays. Thoughtful selection.",
  },
  "5-finance": {
    mr: "कन्या लग्न — काळजीपूर्वक व्यवस्थापन, हिशोबी, उत्तम बचत, सेवा-उत्पन्न. तपशीलवार बजेट. लहान-स्थिर लाभ. व्यावसायिक गुंतवणूक. कंजूषपणा-जोखीम.",
    en: "Kanya lagna — careful management, budgeting, excellent savings, service-income. Detailed budget. Small-steady gains. Professional investments. Miserliness-risk.",
  },

  // ─── TULA / LIBRA ──────────────────────────────────────────
  "6-physical": {
    mr: "तूळ लग्न — सुंदर-संतुलित वैशिष्ट्ये, मोहक, आकर्षक, मध्यम-उंच. गालावर खळी. स्मितहास्य आकर्षक. कलात्मक सौंदर्य. फॅशन-संवेदनशील. आकर्षक रूप. नितळ त्वचा.",
    en: "Tula lagna — beautiful-balanced features, charming, attractive, medium-tall. Dimples. Attractive smile. Artistic beauty. Fashion-sensitive. Attractive looks. Smooth skin.",
  },
  "6-mental": {
    mr: "तूळ लग्न — संतुलित, सामाजिक, अनिर्णायक, मुत्सद्दी, शांतिप्रिय. प्रत्येक बाजू पाहतात. न्यायप्रिय. सौंदर्यप्रेमी. एकटे अस्वस्थ. नातेसंबंधांवर जीवन. कलाकार मन.",
    en: "Tula lagna — balanced, social, indecisive, diplomatic, peace-loving. See every side. Justice-loving. Beauty-lover. Uneasy alone. Life around relationships. Artistic mind.",
  },
  "6-education": {
    mr: "तूळ लग्न — कला, कायदा, डिझाइन, समाजशास्त्र, फॅशन, मुत्सद्देगिरी विषयांत यश. सौंदर्य-कला प्रिय. गट-अभ्यास प्रिय. सहकार्यात उत्तम. परदेशी शिक्षणाची संधी.",
    en: "Tula lagna — success in arts, law, design, social sciences, fashion, diplomacy. Beauty-arts loving. Group-study loving. Excellent in cooperation. Foreign education opportunities.",
  },
  "6-career": {
    mr: "तूळ लग्न — कायदा, मुत्सद्देगिरी, कला, फॅशन, सौंदर्य, भागीदारी-व्यवसाय, मानव-संसाधन क्षेत्रात यश. स्वतःचा व्यवसाय भागीदारीत. कलाक्षेत्रात कीर्ती.",
    en: "Tula lagna — success in law, diplomacy, arts, fashion, beauty, partnership business, HR. Own business in partnership. Fame in arts.",
  },
  "6-marriage": {
    mr: "तूळ लग्न — भागीदारी-केंद्रित, सुसंवाद हवा, रोमँटिक. मिथुन-कुंभ राशीशी अनुकूल. मेषाशी तणाव. जोडीदार सुंदर-कलाकार. विवाहजीवनात समानता. मालव्य योग शक्य.",
    en: "Tula lagna — partnership-focused, need harmony, romantic. Compatible with Gemini/Aquarius. Tension with Aries. Beautiful-artistic spouse. Equality in marriage. Malavya yoga possible.",
  },
  "6-finance": {
    mr: "तूळ लग्न — अस्थिर उत्पन्न, जोडीदार-अवलंबी, कला-उत्पन्न, सौंदर्य-व्यवसाय. विलासी खर्च. भागीदारीत लाभ. कधी बचतीकडे दुर्लक्ष. आयात-निर्यातात यश.",
    en: "Tula lagna — variable income, partner-dependent, arts-income, beauty business. Luxurious spending. Partnership gains. Sometimes neglect savings. Success in import-export.",
  },

  // ─── VRISHCHIKA / SCORPIO ──────────────────────────────────
  "7-physical": {
    mr: "वृश्चिक लग्न — तीक्ष्ण-तीव्र डोळे, मध्यम-मजबूत शरीर, मोहक व्यक्तिमत्त्व. गूढ-आकर्षण. भुवया दाट. आवाज खोल. चेहऱ्यावर रहस्य. शारीरिक सामर्थ्य चांगले.",
    en: "Vrishchika lagna — intense eyes, medium-strong body, magnetic personality. Mystical charm. Thick eyebrows. Deep voice. Mystery on face. Good physical strength.",
  },
  "7-mental": {
    mr: "वृश्चिक लग्न — तीव्र, गूढ, भावनिक, दृढनिश्चयी, संशयी. सूड-वृत्ती जोखीम. रहस्यप्रिय. एकदा नाराज झाले तर क्षमा कठीण. गूढविद्या-आकर्षण. निडर.",
    en: "Vrishchika lagna — intense, mystical, emotional, resolute, suspicious. Vengeance-tendency risk. Secrecy-loving. Forgiveness difficult once hurt. Attracted to occult. Fearless.",
  },
  "7-education": {
    mr: "वृश्चिक लग्न — संशोधन, वैद्यक, गूढविद्या, मानसशास्त्र, रसायनशास्त्र, ज्योतिष विषयांत प्रावीण्य. गहन अभ्यास. एकाग्रता तीव्र. गुप्त-रहस्यमय विषयांकडे कल.",
    en: "Vrishchika lagna — mastery in research, medicine, occult, psychology, chemistry, astrology. Deep study. Intense focus. Inclination to secret-mystical subjects.",
  },
  "7-career": {
    mr: "वृश्चिक लग्न — संशोधन, शल्यक्रिया, गुप्तचर, तपास, ज्योतिष, रसायनशास्त्र, गूढविद्या, मानसशास्त्र क्षेत्रात उत्तम. परिवर्तनकारी काम. गुप्त-कर्तव्ये.",
    en: "Vrishchika lagna — excellent in research, surgery, intelligence, investigation, astrology, chemistry, occult, psychology. Transformative work. Secret duties.",
  },
  "7-marriage": {
    mr: "वृश्चिक लग्न — तीव्र, मालकी हक्काची, परिवर्तनकारी. कर्क-मीन राशीशी अनुकूल. वृषभाशी तणाव. जोडीदाराशी खोल बंधन. ईर्ष्या-जोखीम. विश्वासघात सहन नाही.",
    en: "Vrishchika lagna — intense, possessive, transformative. Compatible with Cancer/Pisces. Tension with Taurus. Deep bond with spouse. Jealousy risk. Don't tolerate betrayal.",
  },
  "7-finance": {
    mr: "वृश्चिक लग्न — लपलेली संपत्ती, वारसा-उत्पन्न, परिवर्तनकारी कमाई. गूढ-स्रोतांमार्फत. जुगार-सट्टा जोखीम. अनपेक्षित लाभ-हानी. संशोधनातून संपत्ती.",
    en: "Vrishchika lagna — hidden wealth, inheritance income, transformative earnings. Via occult sources. Gambling risk. Unexpected gains-losses. Wealth from research.",
  },

  // ─── DHANU / SAGITTARIUS ───────────────────────────────────
  "8-physical": {
    mr: "धनु लग्न — उंच-अँथलेटिक, मैत्रीपूर्ण-आशावादी चेहरा, प्रसन्न डोळे. रुंद कपाळ. लांब पाय. प्रवासी-शक्ती. उच्च-उच्च कपाळ. हसू सतत. मोकळ्या हालचाली.",
    en: "Dhanu lagna — tall-athletic, friendly-optimistic face, cheerful eyes. Broad forehead. Long legs. Traveler's strength. High forehead. Constant smile. Free movements.",
  },
  "8-mental": {
    mr: "धनु लग्न — आशावादी, तत्त्वज्ञानी, साहसी, मुक्तात्मा, सच्चा. उच्च आदर्श. धर्म-सत्याचा पाठपुरावा. कधी अति-आत्मविश्वासी. दूरदृष्टी. विनोदी. धार्मिक.",
    en: "Dhanu lagna — optimistic, philosophical, adventurous, free-spirited, sincere. High ideals. Pursuit of dharma-truth. Sometimes over-confident. Far-sightedness. Humorous. Religious.",
  },
  "8-education": {
    mr: "धनु लग्न — तत्त्वज्ञान, कायदा, धर्म, उच्च शिक्षण, परदेशी शिक्षणात कल. गुरु-शिष्य परंपरा. प्राध्यापक होण्याची क्षमता. व्यापक ज्ञान-विस्तृत विषय.",
    en: "Dhanu lagna — philosophy, law, religion, higher education, foreign education inclination. Guru-disciple tradition. Capability to be professor. Broad knowledge-expansive subjects.",
  },
  "8-career": {
    mr: "धनु लग्न — अध्यापन, कायदा, प्रवास, धर्म, प्रकाशन, सल्लागार, प्राध्यापक क्षेत्रात यश. परदेशी काम. उच्च-पद. मार्गदर्शक-गुरु. धर्मसंस्थापक.",
    en: "Dhanu lagna — success in teaching, law, travel, religion, publishing, consulting, professorship. Foreign work. High-positions. Guide-guru. Religious founder.",
  },
  "8-marriage": {
    mr: "धनु लग्न — मुक्त-विचारी, स्वातंत्र्य हवे, बौद्धिक जुळणी. मेष-सिंह राशीशी अनुकूल. मिथुनाशी तणाव. जोडीदार धार्मिक-विद्वान. परदेशी-संबंध शक्य.",
    en: "Dhanu lagna — free-thinker, need freedom, intellectual match. Compatible with Aries/Leo. Tension with Gemini. Religious-scholarly spouse. Foreign connections possible.",
  },
  "8-finance": {
    mr: "धनु लग्न — भाग्य-आधारित कमाई, परदेशी उत्पन्न, धर्ममार्गाने लाभ. गुरुकृपा. अचानक संपत्ती. दान-धर्मात खर्च. दीर्घ-प्रवासातून उत्पन्न. आदर्शवादी खर्च.",
    en: "Dhanu lagna — luck-based earning, foreign income, gains via dharma. Jupiter's grace. Sudden wealth. Charity expenses. Income from long travels. Idealistic spending.",
  },

  // ─── MAKAR / CAPRICORN ─────────────────────────────────────
  "9-physical": {
    mr: "मकर लग्न — सडपातळ-मजबूत, गंभीर चेहरा, प्रौढ-दिसणारे, हळू हालचाली. सांधे-हाडे मजबूत. उंची मध्यम. कोरडी त्वचा शक्य. शिस्तबद्ध देहभान.",
    en: "Makar lagna — lean-strong, serious face, mature-looking, slow movements. Strong bones-joints. Medium height. Dry skin possible. Disciplined bodily awareness.",
  },
  "9-mental": {
    mr: "मकर लग्न — शिस्तबद्ध, गंभीर, महत्त्वाकांक्षी, व्यावहारिक, सावध. जबाबदारीचे भान. कष्टाळू. कधी निराश-उदास. दीर्घकालीन नियोजन. कमी भावनिक.",
    en: "Makar lagna — disciplined, serious, ambitious, practical, cautious. Sense of responsibility. Hardworking. Sometimes gloomy-depressed. Long-term planning. Less emotional.",
  },
  "9-education": {
    mr: "मकर लग्न — दीर्घकालीन अभ्यास, प्रशासन, रचना, इतिहास, अर्थशास्त्र, सिव्हिल इंजिनीयरिंग विषयांत यश. शिस्तबद्ध अभ्यासक. कठीण विषय आत्मसात. परिश्रमाने उच्च शिक्षण.",
    en: "Makar lagna — long-term study, administration, structure, history, economics, civil engineering success. Disciplined student. Master difficult subjects. Higher education through labor.",
  },
  "9-career": {
    mr: "मकर लग्न — प्रशासन, शासकीय, बांधकाम, खाणकाम, व्यवस्थापन, राजकारण क्षेत्रात उत्तम. वयासह पद वाढते. अधिकार-पदे. दीर्घकालीन उत्कर्ष.",
    en: "Makar lagna — excellent in administration, govt, construction, mining, management, politics. Position grows with age. Authority-positions. Long-term rise.",
  },
  "9-marriage": {
    mr: "मकर लग्न — गंभीर, कर्तव्यबद्ध, अनेकदा वयस्कर/प्रौढ जोडीदार. वृषभ-कन्या राशीशी अनुकूल. कर्काशी तणाव. विवाह-उशीर. दीर्घकालीन सहचर. जोडीदाराच्या कारकिर्दीत सहकार्य.",
    en: "Makar lagna — serious, duty-bound, often older/mature spouse. Compatible with Taurus/Virgo. Tension with Cancer. Marriage delays. Long-term companion. Support spouse's career.",
  },
  "9-finance": {
    mr: "मकर लग्न — धीमी-स्थिर संपत्ती, दीर्घकालीन गुंतवणूक, पुराणमतवादी. प्रामाणिक परिश्रमातून धन. उशिरा श्रीमंती. मालमत्ता-जमीन उत्पन्न. काटकसर.",
    en: "Makar lagna — slow-steady wealth, long-term investments, conservative. Wealth through honest labor. Late prosperity. Property-land income. Frugality.",
  },

  // ─── KUMBHA / AQUARIUS ─────────────────────────────────────
  "10-physical": {
    mr: "कुंभ लग्न — उंच, असामान्य वैशिष्ट्ये, बौद्धिक रूप, मोठी कवळी. अद्वितीय छाप. डोळे हुशार. वयापेक्षा तरुण. शरीर सामान्य पण आत्मा वेगळा. मूळ-व्यक्तिमत्त्व.",
    en: "Kumbha lagna — tall, unusual features, intellectual look, large forehead. Unique impression. Smart eyes. Younger than age. Normal body but distinct spirit. Original personality.",
  },
  "10-mental": {
    mr: "कुंभ लग्न — स्वतंत्र, अपारंपारिक, मानवतावादी, नवकल्पक, तत्त्वज्ञानी. समूह-मन. वैश्विक दृष्टी. कधी भावनिक अंतर. मित्र-केंद्रित. सुधारक विचार. दूरदर्शी.",
    en: "Kumbha lagna — independent, unconventional, humanitarian, innovative, philosophical. Group-mind. Universal vision. Sometimes emotional distance. Friend-centric. Reformist thinking. Visionary.",
  },
  "10-education": {
    mr: "कुंभ लग्न — विज्ञान, तंत्रज्ञान, समाजशास्त्र, खगोलशास्त्र, संगणक, मानवतावादी विषयांत यश. अपारंपारिक अभ्यास. स्वतःचे संशोधन. समूह-प्रकल्प. अत्याधुनिक तंत्रज्ञान.",
    en: "Kumbha lagna — science, technology, sociology, astronomy, computing, humanitarian subjects success. Unconventional study. Own research. Group projects. Cutting-edge technology.",
  },
  "10-career": {
    mr: "कुंभ लग्न — तंत्रज्ञान, सुधारणा, विज्ञान, समाजसेवा, IT, खगोल-विज्ञान, मानवाधिकार कार्यात यश. स्वतःचे स्टार्टअप. समूह-नेतृत्व. असामान्य करिअर.",
    en: "Kumbha lagna — success in technology, reform, science, social service, IT, astronomy, human rights. Own startup. Group leadership. Unusual career.",
  },
  "10-marriage": {
    mr: "कुंभ लग्न — मित्र-समान, अपारंपारिक, स्वातंत्र्य हवे. मिथुन-तूळ राशीशी अनुकूल. सिंहाशी तणाव. असामान्य जोडीदार. विवाह-बंधन पेक्षा मैत्री. विवाह-उशीर शक्य.",
    en: "Kumbha lagna — friend-like, unconventional, need freedom. Compatible with Gemini/Libra. Tension with Leo. Unusual spouse. Friendship over marriage-bond. Marriage delays possible.",
  },
  "10-finance": {
    mr: "कुंभ लग्न — असामान्य कमाई, समूह-लाभ, तंत्रज्ञान-उत्पन्न. मानवतावादी खर्च. कधी अचानक लाभ-हानी. भविष्यकालीन गुंतवणूक. मित्रांमार्फत आर्थिक संधी.",
    en: "Kumbha lagna — unusual earning, group-gains, technology income. Humanitarian spending. Sometimes sudden gains-losses. Future-oriented investments. Financial opportunities via friends.",
  },

  // ─── MEEN / PISCES ─────────────────────────────────────────
  "11-physical": {
    mr: "मीन लग्न — गोल-मऊ शरीर, स्वप्निल डोळे, चंद्रासम चेहरा, मध्यम उंची. वाढत्या वयात वजन वाढते. पायाचे मोठे तळवे. आरसाप्रिय रूप. संवेदनशील शरीर.",
    en: "Meen lagna — round-soft body, dreamy eyes, moon-like face, medium height. Weight gain with age. Big soles. Mirror-loving looks. Sensitive body.",
  },
  "11-mental": {
    mr: "मीन लग्न — अंतर्ज्ञानी, कलात्मक, करुणामय, संवेदनशील, आध्यात्मिक. कल्पनाशक्ती. कधी वास्तवापासून पळ. दयाळू-त्यागी. सहानुभूतिशील. काव्यात्मक विचार. गूढ शक्ती.",
    en: "Meen lagna — intuitive, artistic, compassionate, sensitive, spiritual. Imagination. Sometimes escape from reality. Kind-sacrificing. Empathetic. Poetic thinking. Mystical power.",
  },
  "11-education": {
    mr: "मीन लग्न — कला, अध्यात्म, मानसशास्त्र, उपचार, काव्य-संगीत, धर्म विषयांत उत्तम. कल्पक शिकाऊ. भावनिक अभ्यास. परदेशी शिक्षण. गूढ-आध्यात्मिक अभ्यास.",
    en: "Meen lagna — excellent in arts, spirituality, psychology, healing, poetry-music, religion. Imaginative learner. Emotional study. Foreign education. Mystical-spiritual study.",
  },
  "11-career": {
    mr: "मीन लग्न — कला, उपचार, अध्यात्म, समुपदेशन, सागरी, तेल-पेट्रोलियम, चित्रकला-संगीत क्षेत्रात यश. आध्यात्मिक गुरु. सेवाक्षेत्र. परदेशी करिअर.",
    en: "Meen lagna — success in arts, healing, spirituality, counseling, marine, oil-petroleum, painting-music. Spiritual guru. Service sector. Foreign career.",
  },
  "11-marriage": {
    mr: "मीन लग्न — समर्पित, रोमँटिक, भावनिक. कर्क-वृश्चिक राशीशी अनुकूल. कन्याशी तणाव. जोडीदार कलाकार-आध्यात्मिक. विवाहात गहन-दिव्य प्रेम. पूर्वजन्म-ऋण शक्य.",
    en: "Meen lagna — devoted, romantic, emotional. Compatible with Cancer/Scorpio. Tension with Virgo. Artistic-spiritual spouse. Deep-divine love in marriage. Possible past-life karmic bonds.",
  },
  "11-finance": {
    mr: "मीन लग्न — अस्थिर उत्पन्न, दान-धर्म प्रवृत्ती, सर्जनशील कमाई. कलेतून-उपचारातून उत्पन्न. कधी आर्थिक शिस्तीचा अभाव. आध्यात्मिक कारणांवर खर्च. भाग्य-आधारित.",
    en: "Meen lagna — variable income, charity tendency, creative earning. Income from arts-healing. Sometimes lack of financial discipline. Spending on spiritual causes. Luck-based.",
  },
};
