/**
 * Nakshatra deep-dive predictions — 27 snippets.
 * Based on Saravali, Horasara, Jyotisha Parijata classical canon.
 * Key: rashi-index 0..26 matching constants.ts NAKSHATRAS order (0=Ashwini).
 */

import type { BilingualSnippet } from "./types";

export const NAKSHATRA_DEEP: Record<number, BilingualSnippet> = {
  0: {
    mr: "अश्विनी नक्षत्रात जन्मलेले — अश्विनीकुमार अधिदेवता, अश्व-मस्तक चिन्ह. चपळ, ऊर्जावान, पुढाकार घेणारे. वैद्यकीय-उपचार-अश्वसंबंधी कार्यात प्रावीण्य. अहंकार-अधीरता जपावी. सौंदर्य-स्वास्थ्य-शीघ्रता ही वैशिष्ट्ये. प्राचीन वैद्यक क्षेत्रात जन्मजात कौशल्य. तरुण दिसता. स्वतंत्र स्वभाव. यात्रा-प्रवास प्रिय. गूढ उपचारशक्ती.",
    en: "Born in Ashwini — Ashwini Kumaras deity, horse-head symbol. Agile, energetic, initiator. Excellence in medical/healing/horse-related work. Guard ego/impatience. Beauty-health-swiftness are traits. Innate skill in ancient medicine. Youthful appearance. Independent nature. Travel-loving. Hidden healing power.",
  },
  1: {
    mr: "भरणी नक्षत्रात जन्मलेले — यम अधिदेवता, योनी चिन्ह. कठोर-सहनशील, जीवन-मृत्यूचे रहस्य जाणणारे. अडथळे सहन करून यश. स्त्री-प्रसूतिशास्त्र, संरक्षण-कार्य, न्यायपालनात रुचि. मुक्त प्रेम-स्वभाव पण जबाबदारी. काळजीवाहू. विरोधकांना सहज पराभूत करतात. कधीकधी हट्टी. जीवनाच्या अंतिम सत्यांवर चिंतन. धैर्य-परीक्षा.",
    en: "Born in Bharani — Yama deity, yoni symbol. Stern-enduring, knows life-death mysteries. Success by enduring obstacles. Interest in gynecology/obstetrics, protection work, justice. Liberal in love but responsible. Caretakers. Easily defeat opponents. Sometimes stubborn. Contemplation on ultimate truths. Test of courage.",
  },
  2: {
    mr: "कृत्तिका नक्षत्रात जन्मलेले — अग्नि अधिदेवता, वस्तरा-ज्वाला चिन्ह. तेजस्वी, स्पष्टवक्ते, शुद्धीकरण-योद्धे. खोटे सहन न करणारे. सैन्य-अग्नि-पोलाद-स्वयंपाक क्षेत्रात यश. तीक्ष्ण बुद्धी-टीकाकार. अहंकारावर नियंत्रण आवश्यक. नेतृत्वगुण. ज्ञानाची तीव्र भूक. कधीकधी कठोर वागणे दुखवते. आग-तत्त्व प्रधान.",
    en: "Born in Krittika — Agni deity, razor-flame symbol. Brilliant, outspoken, purifier-warriors. Don't tolerate falsehood. Success in military/fire/steel/cooking. Sharp intellect-critic. Ego control essential. Leadership. Intense thirst for knowledge. Sometimes harsh manner hurts. Fire-element dominant.",
  },
  3: {
    mr: "रोहिणी नक्षत्रात जन्मलेले — ब्रह्मा/प्रजापती अधिदेवता, बैलगाडी/कमळ चिन्ह. चंद्राचे प्रिय नक्षत्र — सौंदर्य-आकर्षण शिरोमणी. कला-संगीत-वस्त्र-कृषी-भू-संपत्तीत यश. मधुर स्वर. इंद्रियसुख-भोग. कौटुंबिक प्रेम. कधी इंद्रिय-लोलुप. निर्मात्याचा संकेत. स्त्री-सौंदर्य-पोषण तत्त्वाचे केंद्र. पृथ्वीतत्त्वशी घट्ट जुळलेले.",
    en: "Born in Rohini — Brahma/Prajapati deity, cart/lotus symbol. Moon's favorite — peak beauty-charm. Success in arts/music/textiles/agriculture/property. Sweet voice. Sensual pleasures. Family love. Sometimes sense-indulgent. Creator's hint. Center of feminine beauty-nourishment. Strongly bonded to earth-element.",
  },
  4: {
    mr: "मृगशिरा नक्षत्रात जन्मलेले — सोम/चंद्र अधिदेवता, मृग-शिर चिन्ह. जिज्ञासू, अन्वेषक, भटकंती-प्रेमी. ज्ञान-शोध, संशोधन, प्रवास, प्रकाशन क्षेत्रात यश. कोमल-सौम्य पण चंचल. सतत नवीन शोध. कधीकधी अस्थिर. कलात्मक रुचि. दूरदृष्टी. सत्याचा पाठपुरावा. सुगंध-संवेदनशील.",
    en: "Born in Mrigashira — Soma/Moon deity, deer-head symbol. Curious, seeker, wanderer. Success in knowledge-seeking, research, travel, publishing. Gentle-soft but restless. Constantly seeking new discoveries. Sometimes unstable. Artistic taste. Far-sightedness. Pursuit of truth. Fragrance-sensitive.",
  },
  5: {
    mr: "आर्द्रा नक्षत्रात जन्मलेले — रुद्र अधिदेवता, अश्रू-रत्न चिन्ह. तीव्र-गहन, वादळासारखे. विनाश-पुनर्निर्माण तत्त्व. विज्ञान-संशोधन-तंत्रज्ञानात अग्रगण्य. जीवनात तीव्र बदल. भावनिक चढ-उतार. कठोर सत्य शोधक. कधी उदासीनता-विध्वंसक विचार. सर्जनशील शक्ती. अंतर्दृष्टी तीक्ष्ण.",
    en: "Born in Ardra — Rudra deity, teardrop-gem symbol. Intense-deep, storm-like. Destruction-rebirth principle. Pioneer in science/research/technology. Intense life changes. Emotional turbulence. Seeker of harsh truth. Sometimes depression-destructive thoughts. Creative power. Sharp insight.",
  },
  6: {
    mr: "पुनर्वसु नक्षत्रात जन्मलेले — अदिती अधिदेवता, धनुष्य-तरकस चिन्ह. आशावादी, उदार, मातृ-स्वरूप. पुनरागमन-पुनर्निर्माण तत्त्व. शिक्षण-मार्गदर्शन-धर्म कार्यात यश. दीर्घ प्रवास. विनम्र-समाधानी. कौटुंबिक मूल्ये. पुन्हा-पुन्हा नवीन सुरुवात. आध्यात्मिक झोपडी. सर्वसमावेशक स्वभाव. राम-जन्माचे नक्षत्र.",
    en: "Born in Punarvasu — Aditi deity, bow-quiver symbol. Optimistic, generous, mother-like. Return-rebuild principle. Success in education/guidance/dharma work. Long travels. Humble-content. Family values. Repeated fresh starts. Spiritual abode. All-inclusive nature. Rama's birth nakshatra.",
  },
  7: {
    mr: "पुष्य नक्षत्रात जन्मलेले — बृहस्पती अधिदेवता, फूल-आचळ चिन्ह. सर्वात शुभ नक्षत्र — पोषक, संरक्षक, गुरुतुल्य. धर्म-शिक्षण-प्रशासनात यश. विश्वासार्ह, स्थिर. कौटुंबिक जबाबदारी. आशीर्वाद देणारे. शासकीय कृपा. काही वेळा हट्टी-पारंपारिक. पुष्टी-समृद्धीचे केंद्र. रानी-राज्य-नेते.",
    en: "Born in Pushya — Brihaspati deity, flower-udder symbol. Most auspicious — nourishing, protecting, guru-like. Success in dharma/education/administration. Trustworthy, stable. Family responsibility. Blessings-givers. Govt favor. Sometimes stubborn-traditional. Center of nurture-prosperity. Royalty-rulership-leadership.",
  },
  8: {
    mr: "आश्लेषा नक्षत्रात जन्मलेले — नाग अधिदेवता, सर्प-वेटोळे चिन्ह. गूढ, धोरणीबाज, मनोवैज्ञानिक. औषधविज्ञान, विष-विद्या, ज्योतिष, गुप्तचर कार्यात प्रावीण्य. तीव्र अंतर्ज्ञान. कधी हाताळणी-फसवणूक प्रवृत्ती. कुंडलिनी-योग-तंत्र गतिशील. गूढ प्रेम. मोक्ष-संशोधन. एकाकी. गूढ शक्ती जन्मजात.",
    en: "Born in Ashlesha — Nagas deity, coiled serpent symbol. Mystical, strategic, psychologist. Mastery in pharmacology/toxicology/astrology/espionage. Intense intuition. Sometimes manipulation-deception tendency. Kundalini-yoga-tantra active. Secret love. Moksha-research. Solitary. Innate occult power.",
  },
  9: {
    mr: "मघा नक्षत्रात जन्मलेले — पितर अधिदेवता, सिंहासन चिन्ह. राजेशाही, पूर्वजांचा वारसा, अभिमानी. शासन-प्रशासन-राजकारणात अग्रगण्य. कुटुंब-परंपरेचा अभिमान. सत्तेची आकर्षण. उदार-दानशूर. कधी अहंकारी-स्वार्थी. पूर्वजन्म राजसी संस्कार. पितृ-कर्म महत्त्वाचे. प्राचीन ज्ञानाचे रक्षक.",
    en: "Born in Magha — Pitrs deity, throne symbol. Regal, ancestral legacy, proud. Leaders in governance-administration-politics. Pride in family-tradition. Attracted to power. Generous-charitable. Sometimes egoistic-selfish. Past-life royal samskaras. Pitr-karma important. Guardians of ancient knowledge.",
  },
  10: {
    mr: "पूर्व फाल्गुनी नक्षत्रात जन्मलेले — भग अधिदेवता, पलंग-स्विंग चिन्ह. रोमँटिक, विलासप्रिय, सामाजिक. कला-मनोरंजन-सौंदर्य-फॅशन क्षेत्रात यश. आनंदाचे केंद्र. मधुर स्वभाव. उदार. कधी आळशी-भोगी. भाग-भाग्य-संपत्ती तत्त्व. लग्न-प्रेमसंबंधांत तेज. विश्रांती प्रिय. सर्जनशील.",
    en: "Born in Purva Phalguni — Bhaga deity, bed-swing symbol. Romantic, luxury-loving, social. Success in arts/entertainment/beauty/fashion. Center of joy. Sweet nature. Generous. Sometimes lazy-indulgent. Fortune-share-wealth principle. Brilliance in marriage/romance. Rest-loving. Creative.",
  },
  11: {
    mr: "उत्तर फाल्गुनी नक्षत्रात जन्मलेले — अर्यमा अधिदेवता, पलंगाचा दुसरा पाय चिन्ह. करार-प्रतिबद्धता-उदारता. विवाहजीवनात स्थिर. दान-संस्था-धर्मादाय कार्यात यश. शांत नेतृत्व. विश्वसनीय मित्र. कधी आत्मविश्वासाचा अभाव. मैत्रीपूर्ण. प्रतिज्ञा-पाळणारे. कौटुंबिक सौख्य.",
    en: "Born in Uttara Phalguni — Aryaman deity, bed's second leg symbol. Contract-commitment-generosity. Stable in marriage. Success in charity-philanthropy. Quiet leadership. Trustworthy friends. Sometimes lacks confidence. Friendly. Keeps promises. Family joy.",
  },
  12: {
    mr: "हस्त नक्षत्रात जन्मलेले — सविता (सूर्य) अधिदेवता, हस्त चिन्ह. कौशल्य-हस्तकला-उपचार-लेखन क्षेत्रात चमत्कारी. चपळ बुद्धी. विनोदी. शिल्प-दस्तकला-आयुर्वेद-ज्योतिष-हस्तसामुद्रिक यात प्रावीण्य. धूर्त वाटाघाटी-कुशल. कधीकधी संशय-गुप्तता. हात-तत्त्व — जे हाती घेतो ते पूर्ण. व्यापारी-कारागीर.",
    en: "Born in Hasta — Savitr (Sun) deity, hand symbol. Miraculous in skill-handicraft-healing-writing. Quick wit. Humorous. Mastery in crafts-ayurveda-astrology-palmistry. Shrewd negotiator. Sometimes suspicious-secretive. Hand-principle — what's taken in hand gets completed. Trader-artisan.",
  },
  13: {
    mr: "चित्रा नक्षत्रात जन्मलेले — त्वष्टा/विश्वकर्मा अधिदेवता, मोती-रत्न चिन्ह. आकर्षक, कलाकार, वास्तुकार. डिझाइन-वास्तुशास्त्र-दागिने-चित्रकला-फॅशन क्षेत्रात यश. तेजस्वी व्यक्तिमत्त्व. स्वतःची ओळख बनवणारे. स्वाभिमानी. कधी दिखाऊ-अहंकारी. सुंदर-असामान्य रूप. सर्जनशीलता चरमावर.",
    en: "Born in Chitra — Tvashtr/Vishvakarma deity, pearl-gem symbol. Attractive, artist, architect. Success in design-architecture-jewelry-painting-fashion. Brilliant personality. Identity-builders. Self-respecting. Sometimes showy-egoistic. Beautiful-unusual looks. Peak creativity.",
  },
  14: {
    mr: "स्वाती नक्षत्रात जन्मलेले — वायु अधिदेवता, तरुण अंकुर चिन्ह. स्वतंत्र, व्यापारी, मुत्सद्दी. वारा-तत्त्व — चंचल पण सर्वत्र. राजनैतिक-व्यापार-वाहतूक-संगीत क्षेत्रात यश. संतुलित दृष्टिकोन. अनुकूल. कधी निर्णयक्षमतेचा अभाव. प्रेम-विरह. स्वावलंबी. कोणतेही बंधन मान्य नाही.",
    en: "Born in Swati — Vayu deity, young sprout symbol. Independent, trader, diplomat. Wind-principle — restless yet omnipresent. Success in politics-trade-transport-music. Balanced perspective. Adaptive. Sometimes decision-lacking. Love-separation. Self-reliant. No bondage accepted.",
  },
  15: {
    mr: "विशाखा नक्षत्रात जन्मलेले — इंद्राग्नी अधिदेवता, विजयी तोरण चिन्ह. महत्त्वाकांक्षी, निर्धारी, विजय-प्रेमी. राजकारण-नेतृत्व-स्पर्धा क्षेत्रात यश. ध्येयवादी. दीर्घ मेहनत. कधी अस्वस्थ-असंतुष्ट. दुहेरी देवता — दोन ध्येये एकाच वेळी. धार्मिक उत्साह. मानवजातीस मदत.",
    en: "Born in Vishakha — Indra-Agni deity, triumphal arch symbol. Ambitious, resolute, victory-loving. Success in politics-leadership-competition. Goal-oriented. Long labor. Sometimes restless-dissatisfied. Dual deity — two goals simultaneously. Religious zeal. Help to humanity.",
  },
  16: {
    mr: "अनुराधा नक्षत्रात जन्मलेले — मित्र अधिदेवता, कमळ/पुष्प-हार चिन्ह. मैत्री-भक्ती-निष्ठा चरमावर. अनुयायी पण नेतृत्व क्षमता. धर्म-मैत्री-कला-अध्यात्म क्षेत्रात यश. सहकार्य-कुशल. परदेशी संबंध. कधीकधी स्वतःच्या भावना दाबतात. भक्तिमय-विश्वासू. गट-नेतृत्व. संख्या-शक्ती.",
    en: "Born in Anuradha — Mitra deity, lotus/flower-garland symbol. Peak friendship-devotion-loyalty. Follower yet leadership capable. Success in dharma-friendship-arts-spirituality. Cooperation-skilled. Foreign connections. Sometimes suppress own feelings. Devotional-faithful. Group leadership. Power in numbers.",
  },
  17: {
    mr: "ज्येष्ठा नक्षत्रात जन्मलेले — इंद्र अधिदेवता, छत्र-कुंडल चिन्ह. ज्येष्ठ-अनुभवी, गुप्त शक्ती, रक्षक. गुप्तचर-संरक्षण-राजकारण-मानसशास्त्र क्षेत्रात यश. नेतृत्व जन्मजात. खोल भावना-गुप्त. कधी एकाकी-संशयी. वडीलधारा जबाबदारी. चरित्रप्रधान. वयाच्या आधी परिपक्व. मूळ-उत्पत्तीचे रहस्य.",
    en: "Born in Jyeshtha — Indra deity, umbrella-earring symbol. Elder-experienced, hidden power, protector. Success in intelligence-security-politics-psychology. Innate leadership. Deep emotions-secretive. Sometimes lonely-suspicious. Elder responsibility. Character-dominant. Mature before age. Mystery of root-origin.",
  },
  18: {
    mr: "मूळ नक्षत्रात जन्मलेले — निऋति अधिदेवता, मुळे-सिंह-शेपूट चिन्ह. मूळ-शोधक, तत्त्वज्ञानी, वेद-वैद्य. वैद्यकीय-दर्शन-संशोधन क्षेत्रात प्रावीण्य. आयुष्याची सुरुवात कठीण, पण अखेर सत्य-प्राप्ती. वडील-पितरांशी संबंध गुंतागुंतीचे. तीव्र-भेदक बुद्धी. आध्यात्मिक मूल. मोक्ष-संशोधक. गंडमूल जन्म-शांती करावी.",
    en: "Born in Mula — Nirriti deity, roots-lion-tail symbol. Root-seeker, philosopher, vedic-healer. Mastery in medical-philosophy-research. Difficult start but eventual truth-realization. Complex relations with father-ancestors. Sharp-piercing intellect. Spiritual root. Moksha-seeker. Gandamula shanti recommended.",
  },
  19: {
    mr: "पूर्वाषाढा नक्षत्रात जन्मलेले — आप अधिदेवता, पंखा-सूप चिन्ह. अजिंक्य-उत्साही, जल-तत्त्व. नौदल-जहाज-पाणी-पूर्वजन्म-उपचार क्षेत्रात यश. आशावादी. प्रेरक वक्ता. कधी अति-उत्साही. दुसऱ्यांवर प्रभाव. विजयी जीवनशैली. प्राचीन पाणीसंबंधी शहाणपण. निर्भय प्रवास.",
    en: "Born in Purva Ashadha — Apah deity, fan-winnow symbol. Invincible-enthusiastic, water-element. Success in navy-ships-water-past-life-healing. Optimistic. Inspiring speaker. Sometimes over-enthusiastic. Influence on others. Victorious lifestyle. Ancient water wisdom. Fearless travel.",
  },
  20: {
    mr: "उत्तराषाढा नक्षत्रात जन्मलेले — विश्वेदेव अधिदेवता, हत्तीदांत चिन्ह. विजेता-न्यायी, अंतिम विजय. राजकारण-न्याय-प्रशासन-धर्म क्षेत्रात शिरोमणी. शांत बलवान. दीर्घ-कर्म. कधी कठोर-रिगिड. सत्याचा वारसा. पूर्णतेकडे वाटचाल. कायमची प्रतिष्ठा. शेवटी यशस्वी.",
    en: "Born in Uttara Ashadha — Vishvedeva deity, elephant-tusk symbol. Victor-just, final victory. Topmost in politics-justice-administration-dharma. Quiet strong. Long-karma. Sometimes harsh-rigid. Heritage of truth. Journey toward perfection. Permanent prestige. Eventually successful.",
  },
  21: {
    mr: "श्रवण नक्षत्रात जन्मलेले — विष्णु अधिदेवता, तीन पदक्षेप चिन्ह. श्रवण-संग्राहक, संवाद-कुशल, विस्तृत. ऐकणे-शिकणे-शिकवणे-प्रकाशन-धर्मशास्त्र क्षेत्रात यश. ज्ञान-भांडार. विश्वसनीय-कीर्तिमान. कधी गपशप-अफवा. गुरु-परंपरा. बहुभाषिक. कौटुंबिक आदर्श. श्रवणेंद्रिय तीव्र.",
    en: "Born in Shravana — Vishnu deity, three-steps symbol. Listener-collector, communication-skilled, expansive. Success in listening-learning-teaching-publishing-dharma. Knowledge-treasury. Reliable-renowned. Sometimes gossip-rumor. Guru-tradition. Multilingual. Family ideal. Sharp hearing.",
  },
  22: {
    mr: "धनिष्ठा नक्षत्रात जन्मलेले — अष्टवसु अधिदेवता, ढोल-वाद्य चिन्ह. संगीत-लय-समृद्धी-धन. नृत्य-संगीत-व्यवसाय-तालबद्ध कार्यात यश. श्रीमंती-जन्मजात. सामाजिक-दातृत्वी. कधी जोडीदाराशी विलगता. मेहनती-निर्णायक. समूह-नेतृत्व. दातृत्व-कीर्ती. दीर्घायु. कला-उद्योगाची जोड.",
    en: "Born in Dhanishta — Ashta-Vasu deity, drum-musical symbol. Music-rhythm-prosperity-wealth. Success in dance-music-business-rhythmic work. Wealth-born. Social-philanthropic. Sometimes spouse-distance. Hardworking-decisive. Group-leadership. Generosity-fame. Longevity. Arts-industry blend.",
  },
  23: {
    mr: "शततारका नक्षत्रात जन्मलेले — वरुण अधिदेवता, शून्य वर्तुळ/शंभर तारे चिन्ह. शंभर वैद्य/गूढ-ज्ञाता. औषध-ज्योतिष-विज्ञान-गूढविद्यांमध्ये प्रावीण्य. एकांत-प्रिय. संशोधक-तपस्वी. असामान्य धैर्य. कधी हटवादी-तडजोडहीन. उपचार-शक्ती. रहस्य-शोधक. दीर्घायु पण आरोग्य जपावे. व्यसन-जोखीम.",
    en: "Born in Shatabhisha — Varuna deity, empty-circle/100-stars symbol. Hundred-physicians/mystic-knower. Mastery in medicine-astrology-science-occult. Solitude-loving. Researcher-ascetic. Unusual courage. Sometimes stubborn-uncompromising. Healing power. Secret-seeker. Longevity but guard health. Addiction risk.",
  },
  24: {
    mr: "पूर्व भाद्रपदा नक्षत्रात जन्मलेले — अज-एकपाद अधिदेवता, शय्येचा पुढील पाय/तलवार चिन्ह. तीव्र-अग्निमय, तत्त्वज्ञानी, सुधारक. अध्यात्म-तत्त्वज्ञान-अग्नि-विद्युत कार्यात यश. तीव्र भावना. कधी संताप-विनाशक. आध्यात्मिक साधक. वैश्विक विचार. गूढ शक्ती. रात्रकालीन-क्रियाशील. आदर्शवादी.",
    en: "Born in Purva Bhadrapada — Aja-Ekapada deity, bed's front leg/sword symbol. Intense-fiery, philosopher, reformer. Success in spirituality-philosophy-fire-electricity. Intense emotions. Sometimes anger-destructive. Spiritual seeker. Universal thinking. Occult power. Night-active. Idealist.",
  },
  25: {
    mr: "उत्तर भाद्रपदा नक्षत्रात जन्मलेले — अहिर्बुध्न्य अधिदेवता, शय्येचा मागील पाय/जुळे चिन्ह. गहन-स्थिर, तपस्वी, सागरसम. आध्यात्म-तत्त्वज्ञान-दीर्घकालीन उद्योगात यश. शांत प्रतिष्ठा. अंतर्मुखी-विश्लेषक. कधी एकाकी-उदास. परोपकारी. गूढ शांतता. धार्मिक कार्यात उत्कृष्ट. जल-तत्त्व खोल.",
    en: "Born in Uttara Bhadrapada — Ahirbudhnya deity, bed's back leg/twin symbol. Deep-steady, ascetic, ocean-like. Success in spirituality-philosophy-long-term enterprise. Quiet prestige. Introvert-analytical. Sometimes solitary-gloomy. Altruist. Mystical calm. Excellent in religious work. Deep water-element.",
  },
  26: {
    mr: "रेवती नक्षत्रात जन्मलेले — पूषन अधिदेवता, मत्स्य/ढोल चिन्ह. शेवटचे नक्षत्र — पूर्णता-मोक्ष. पोषक, मार्गदर्शक, धार्मिक. शिक्षक-पालक-धर्मगुरु क्षेत्रात यश. मधुर स्वभाव. कलात्मक. परदेशी प्रवास. कधी भावनिक-अस्थिर. शेवट-शेवटच्या गोष्टीत पारंगत. सार्वत्रिक प्रेम. पशुप्रेमी. गंडमूल — शांती करावी.",
    en: "Born in Revati — Pushan deity, fish/drum symbol. Final nakshatra — completion-moksha. Nourisher, guide, religious. Success as teacher-parent-religious-guru. Sweet nature. Artistic. Foreign travel. Sometimes emotional-unstable. Expert in final/ending matters. Universal love. Animal-loving. Gandamula — shanti recommended.",
  },
};
