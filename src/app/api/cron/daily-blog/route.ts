import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

// Each article: 500-700 words, detailed, well-structured
const articles = [
  {
    titleMr: "शनि ग्रहाचे साडेसाती — तुमच्या आयुष्यावर होणारा प्रभाव आणि उपाय",
    titleEn: "Saturn's Sade Sati — Its Impact on Your Life and Effective Remedies",
    cat: "ग्रह", catEn: "Planets",
    summaryMr: "शनि ग्रहाची साडेसाती म्हणजे काय, ती कशी कार्य करते आणि त्यावर कोणते उपाय करावेत याबद्दल सविस्तर माहिती.",
    summaryEn: "A detailed guide on what Saturn's Sade Sati is, how it works, and effective remedies to manage its effects.",
    contentMr: `## शनि ग्रहाची साडेसाती — संपूर्ण मार्गदर्शन

शनि ग्रह वैदिक ज्योतिषात सर्वात प्रभावशाली ग्रहांपैकी एक मानला जातो. साडेसाती हा शनि ग्रहाचा एक विशेष कालखंड आहे जो प्रत्येक व्यक्तीच्या जीवनात साधारणतः दोन ते तीन वेळा येतो. हा कालखंड साधारणतः साडेसात वर्षांचा असतो, म्हणूनच याला 'साडेसाती' असे म्हणतात.

### साडेसाती म्हणजे काय?

जेव्हा शनि ग्रह तुमच्या जन्म कुंडलीतील चंद्र राशीच्या बारावे, पहिल्या आणि दुसऱ्या स्थानातून गोचर करतो, तेव्हा साडेसातीचा कालखंड सुरू होतो. शनि ग्रह एका राशीत अडीच वर्षे राहतो, त्यामुळे तीन राशींमधून गोचर करताना एकूण साडेसात वर्षांचा कालावधी लागतो.

### साडेसातीचे तीन टप्पे

**पहिला टप्पा (Rising Phase):** शनि चंद्र राशीच्या बारावे स्थानात येतो. या काळात आर्थिक अडचणी, अनावश्यक खर्च आणि मानसिक तणाव जाणवू शकतो. कौटुंबिक संबंधांमध्ये काही तणाव निर्माण होऊ शकतो.

**दुसरा टप्पा (Peak Phase):** शनि चंद्र राशीवरच गोचर करतो. हा सर्वात तीव्र काळ मानला जातो. या काळात आरोग्य समस्या, नोकरीतील अस्थिरता, आणि व्यक्तिगत संबंधांमध्ये आव्हाने येऊ शकतात. मात्र, हा काळ आत्मचिंतन आणि आध्यात्मिक प्रगतीसाठीही अनुकूल असतो.

**तिसरा टप्पा (Setting Phase):** शनि चंद्र राशीच्या दुसऱ्या स्थानात जातो. या काळात हळूहळू परिस्थिती सुधारू लागते. आर्थिक स्थिरता परत येते, पण कुटुंबातील वाणी आणि संवाद यावर लक्ष देणे आवश्यक असते.

### साडेसातीचे सकारात्मक पैलू

साडेसाती केवळ नकारात्मक नसते. शनि हा न्यायाचा ग्रह आहे. जर तुम्ही कठोर परिश्रम करत असाल, प्रामाणिक असाल आणि इतरांशी चांगले वागत असाल, तर शनि तुम्हाला उत्तम फळ देतो. अनेक यशस्वी लोकांनी साडेसातीच्या काळात मोठे यश मिळवले आहे.

### प्रभावी उपाय

- **हनुमान चालीसा पठण:** दररोज हनुमान चालीसाचे पठण करावे, विशेषतः शनिवारी.
- **शनि मंत्रजप:** "ॐ शं शनैश्चराय नमः" या मंत्राचा 108 वेळा जप करावा.
- **तिळाचे तेल दान:** शनिवारी गरजू लोकांना तिळाचे तेल, काळे कपडे किंवा लोखंडी वस्तू दान कराव्यात.
- **शनिदेव मंदिर भेट:** शनिवारी शनि मंदिरात जाऊन तिळाच्या तेलाने अभिषेक करावा.
- **नीलम रत्न:** ज्योतिषाच्या सल्ल्यानुसार नीलम रत्न धारण करता येते, पण हे अत्यंत काळजीपूर्वक करावे.
- **सेवाभावी कार्य:** गरजू लोकांची सेवा करणे हा शनिला प्रसन्न करण्याचा सर्वोत्तम उपाय आहे.

### कोणत्या राशींवर सध्या साडेसाती आहे?

सध्या शनि कुंभ राशीत गोचर करत आहे. त्यामुळे मकर, कुंभ आणि मीन या तीन राशींवर साडेसातीचा प्रभाव आहे. या राशीच्या लोकांनी विशेष सावधगिरी बाळगावी आणि वरील उपाय नियमित करावेत.

### निष्कर्ष

साडेसाती हा भयावह कालखंड नसून, आत्मचिंतन आणि आध्यात्मिक प्रगतीचा काळ आहे. योग्य दृष्टिकोन, कठोर परिश्रम आणि शनि उपाय यांच्या साहाय्याने हा काळ सुखकारक होऊ शकतो.`,
    contentEn: `## Saturn's Sade Sati — A Complete Guide

Saturn is considered one of the most influential planets in Vedic astrology. Sade Sati is a special period of Saturn that occurs approximately two to three times in every person's life. This period lasts about seven and a half years, which is why it's called 'Sade Sati' (meaning seven and a half).

### What is Sade Sati?

Sade Sati begins when Saturn transits through the 12th, 1st, and 2nd houses from your natal Moon sign in your birth chart. Since Saturn stays in each zodiac sign for approximately two and a half years, the transit through three signs takes a total of seven and a half years.

### Three Phases of Sade Sati

**First Phase (Rising Phase):** Saturn enters the 12th house from the Moon sign. During this period, one may experience financial difficulties, unnecessary expenses, and mental stress. Some tension in family relationships may also arise.

**Second Phase (Peak Phase):** Saturn transits over the Moon sign itself. This is considered the most intense period. Health issues, career instability, and challenges in personal relationships may occur. However, this period is also favorable for self-reflection and spiritual growth.

**Third Phase (Setting Phase):** Saturn moves to the 2nd house from the Moon sign. During this time, the situation gradually improves. Financial stability returns, but attention to speech and family communication remains essential.

### Positive Aspects of Sade Sati

Sade Sati is not entirely negative. Saturn is the planet of justice. If you work hard, remain honest, and treat others well, Saturn rewards you generously. Many successful people have achieved great success during their Sade Sati period.

### Effective Remedies

- **Hanuman Chalisa Recitation:** Recite Hanuman Chalisa daily, especially on Saturdays.
- **Saturn Mantra Chanting:** Chant "Om Sham Shanaischaraya Namah" 108 times.
- **Sesame Oil Donation:** On Saturdays, donate sesame oil, black clothes, or iron items to the needy.
- **Shani Temple Visit:** Visit a Saturn temple on Saturdays and perform abhishek with sesame oil.
- **Blue Sapphire:** Wearing a blue sapphire can help based on astrological consultation, but this must be done with extreme caution.
- **Service to Others:** Serving the needy is the best remedy to please Saturn.

### Which Signs Are Currently Under Sade Sati?

Saturn is currently transiting through Aquarius. Therefore, Capricorn, Aquarius, and Pisces are the three signs currently under Sade Sati's influence. People of these signs should exercise special caution and regularly perform the remedies mentioned above.

### Conclusion

Sade Sati is not a fearsome period but rather a time for self-reflection and spiritual growth. With the right attitude, hard work, and Saturn remedies, this period can become a transformative experience.`,
  },
  {
    titleMr: "कालसर्प दोष — ओळख, प्रभाव आणि निवारण विधी",
    titleEn: "Kalsarpa Dosha — Identification, Effects, and Remedial Rituals",
    cat: "दोष", catEn: "Dosha",
    summaryMr: "कालसर्प दोष कसा ओळखावा, त्याचे जीवनावरील परिणाम आणि त्रंबकेश्वर येथील निवारण विधी याबद्दल संपूर्ण मार्गदर्शन.",
    summaryEn: "Complete guide on identifying Kalsarpa Dosha, its life effects, and the powerful remedial rituals at Trimbakeshwar.",
    contentMr: `## कालसर्प दोष — संपूर्ण मार्गदर्शन

कालसर्प दोष हा वैदिक ज्योतिषातील एक महत्वाचा दोष मानला जातो. जेव्हा जन्मकुंडलीतील सर्व ग्रह राहू आणि केतू यांच्या दरम्यान येतात, तेव्हा कालसर्प दोष तयार होतो. हा दोष व्यक्तीच्या आयुष्यावर विविध प्रकारे प्रभाव टाकू शकतो.

### कालसर्प दोषाचे प्रकार

कालसर्प दोषाचे एकूण बारा प्रकार आहेत, प्रत्येक राहूच्या स्थानानुसार:

- **अनंत कालसर्प:** राहू लग्नात — जीवनात सतत संघर्ष, व्यक्तिमत्वावर प्रभाव
- **कुलिक कालसर्प:** राहू दुसऱ्या स्थानात — आर्थिक अडचणी, कुटुंबात अशांती
- **वासुकी कालसर्प:** राहू तिसऱ्या स्थानात — भावंडांशी वाद, धैर्याचा अभाव
- **शंखपाल कालसर्प:** राहू चौथ्या स्थानात — मातेशी तणाव, स्थावर मालमत्तेत अडचणी
- **पद्म कालसर्प:** राहू पाचव्या स्थानात — संतान प्राप्तीत विलंब, शिक्षणात अडथळे
- **महापद्म कालसर्प:** राहू सहाव्या स्थानात — शत्रूंचा त्रास, आरोग्य समस्या

### कालसर्प दोषाचे प्रमुख लक्षणे

कालसर्प दोष असलेल्या व्यक्तीच्या जीवनात काही विशिष्ट लक्षणे दिसून येतात. सतत स्वप्नात सर्प दिसणे हे एक प्रमुख लक्षण आहे. याशिवाय, प्रयत्न करूनही यश न मिळणे, अचानक आर्थिक नुकसान, वैवाहिक जीवनात अडचणी, आणि मानसिक अस्वस्थता ही देखील या दोषाची लक्षणे असू शकतात.

### निवारण उपाय

**त्र्यंबकेश्वर पूजा:** नाशिक जिल्ह्यातील त्र्यंबकेश्वर हे कालसर्प दोष निवारणासाठी सर्वात प्रसिद्ध ठिकाण आहे. येथे विशेष नागबली पूजा केली जाते जी अत्यंत प्रभावी मानली जाते. ही पूजा अनुभवी गुरुजींकडूनच करवून घ्यावी.

**नागपंचमी पूजा:** नागपंचमीला नाग देवतेची विशेष पूजा करावी. दुधाचा अभिषेक, नागाचे चित्र पूजन आणि नागमंत्राचा जप करावा.

**राहू-केतू शांती पूजा:** राहू आणि केतू या छाया ग्रहांची शांती पूजा करवून घ्यावी. ही पूजा अमावस्येला किंवा ग्रहणाच्या दिवशी केल्यास अधिक प्रभावी ठरते.

**दैनिक उपाय:**
- रोज सकाळी सूर्योदयापूर्वी उठून स्नान करावे
- महामृत्युंजय मंत्राचा 108 वेळा जप करावा
- शनिवारी काळ्या तिळाचे दान करावे
- भैरव बाबांची पूजा करावी

### रत्न उपाय

कालसर्प दोष निवारणासाठी गोमेद (Hessonite) आणि लहसुनिया (Cat's Eye) ही रत्ने फायदेशीर ठरू शकतात. मात्र, कोणतेही रत्न धारण करण्यापूर्वी अनुभवी ज्योतिषाचा सल्ला घेणे अत्यंत आवश्यक आहे.

### निष्कर्ष

कालसर्प दोष गंभीर असला तरी, योग्य उपाय आणि श्रद्धेने या दोषाचे निवारण शक्य आहे. नियमित पूजा, मंत्रजप आणि सेवाभावी कार्य यांच्या माध्यमातून या दोषाचा प्रभाव कमी करता येतो.`,
    contentEn: `## Kalsarpa Dosha — A Complete Guide

Kalsarpa Dosha is considered one of the most significant doshas in Vedic astrology. It forms when all planets in a birth chart are positioned between Rahu and Ketu. This dosha can impact various aspects of a person's life in significant ways.

### Types of Kalsarpa Dosha

There are twelve types of Kalsarpa Dosha, each based on Rahu's position:

- **Anant Kalsarpa:** Rahu in 1st house — constant struggle in life, impact on personality
- **Kulik Kalsarpa:** Rahu in 2nd house — financial difficulties, family discord
- **Vasuki Kalsarpa:** Rahu in 3rd house — disputes with siblings, lack of courage
- **Shankhpal Kalsarpa:** Rahu in 4th house — tension with mother, property issues
- **Padma Kalsarpa:** Rahu in 5th house — delay in children, educational obstacles
- **Mahapadma Kalsarpa:** Rahu in 6th house — enemy troubles, health problems

### Key Symptoms of Kalsarpa Dosha

People with Kalsarpa Dosha exhibit certain distinct symptoms. Frequently seeing snakes in dreams is a primary indicator. Additionally, not achieving success despite efforts, sudden financial losses, difficulties in married life, and mental unrest can also be symptoms of this dosha.

### Remedial Measures

**Trimbakeshwar Puja:** Trimbakeshwar in Nashik district is the most famous place for Kalsarpa Dosha remediation. A special Nagbali Puja is performed here, which is considered extremely effective. This ritual should only be performed by experienced priests.

**Nag Panchami Puja:** Special worship of the Nag deity should be performed on Nag Panchami. This includes milk abhishek, worship of the serpent image, and chanting of Nag mantras.

**Rahu-Ketu Shanti Puja:** A peace ritual for Rahu and Ketu shadow planets should be performed. This puja is more effective when done on Amavasya or during an eclipse.

**Daily Remedies:**
- Wake up before sunrise and bathe daily
- Chant Mahamrityunjaya Mantra 108 times
- Donate black sesame on Saturdays
- Worship Bhairav Baba regularly

### Gemstone Remedies

Gomed (Hessonite) and Lahsuniya (Cat's Eye) can be beneficial for Kalsarpa Dosha remediation. However, it is essential to consult an experienced astrologer before wearing any gemstone.

### Conclusion

While Kalsarpa Dosha is serious, its remediation is possible with proper measures and devotion. Through regular worship, mantra chanting, and charitable work, the effects of this dosha can be significantly reduced.`,
  },
  {
    titleMr: "मंगळ दोष — विवाहावरील प्रभाव आणि योग्य उपाय",
    titleEn: "Mangal Dosha — Its Impact on Marriage and Proper Remedies",
    cat: "दोष", catEn: "Dosha",
    summaryMr: "मंगळ दोष म्हणजे काय, विवाह जुळवताना त्याचे महत्व आणि शास्त्रोक्त उपाय.",
    summaryEn: "Understanding Mangal Dosha, its significance in matchmaking, and scriptural remedies.",
    contentMr: `## मंगळ दोष — विवाह आणि उपाय

मंगळ दोष हा वैदिक ज्योतिषातील सर्वात चर्चित दोषांपैकी एक आहे. विवाह जुळवताना मंगळ दोषाला अत्यंत महत्वाचे स्थान दिले जाते. मात्र, या दोषाबद्दल अनेक गैरसमज प्रचलित आहेत. या लेखात आपण मंगळ दोषाची खरी माहिती आणि योग्य उपाय जाणून घेऊ.

### मंगळ दोष कसा तयार होतो?

जन्मकुंडलीत मंगळ ग्रह जेव्हा पहिल्या (लग्न), चौथ्या, सातव्या, आठव्या किंवा बारावे स्थानात असतो, तेव्हा मंगळ दोष तयार होतो. या दोषाला 'कुजदोष' किंवा 'अंगारक दोष' असेही म्हणतात. भारतीय लोकसंख्येपैकी जवळपास 40-50% लोकांच्या कुंडलीत मंगळ दोष आढळतो.

### मंगळ दोषाचे प्रकार

**तीव्र मंगळ दोष:** मंगळ सातव्या किंवा आठव्या स्थानात असल्यास हा अधिक तीव्र मानला जातो. विशेषतः पापग्रहांच्या दृष्टीत असल्यास त्याचा प्रभाव अधिक जाणवतो.

**सौम्य मंगळ दोष:** मंगळ चौथ्या किंवा बारावे स्थानात असल्यास, आणि शुभग्रहांच्या दृष्टीत असल्यास दोष सौम्य मानला जातो.

### विवाहावरील प्रभाव

मंगळ दोष असलेल्या व्यक्तीने मंगळ दोष असलेल्या व्यक्तीशीच विवाह करावा, असा एक सामान्य नियम आहे. याला 'दोष समन' असे म्हणतात. मात्र, सर्व परिस्थितींमध्ये हा नियम लागू होत नाही. काही विशिष्ट ग्रहयोगांमुळे मंगळ दोष स्वतःच निरस्त होतो.

### मंगळ दोष निरस्त होण्याच्या परिस्थिती

- मंगळ स्वतःच्या राशीत (मेष/वृश्चिक) असल्यास
- मंगळ उच्चीचा (मकर राशीत) असल्यास
- गुरू किंवा शुक्राची दृष्टी मंगळावर असल्यास
- वय 28 वर्षांनंतर मंगळ दोषाचा प्रभाव कमी होतो
- लग्नकुंडलीत मंगळ शुभ स्थानात असल्यास

### शास्त्रोक्त उपाय

**कुंभ विवाह:** मंगळ दोष असलेल्या मुलीचा विवाह प्रथम विष्णू मूर्ती, पिंपळाचे झाड किंवा मातीच्या घड्याशी लावला जातो. यानंतर दुसरा विवाह केला जातो. हा उपाय अत्यंत प्रभावी मानला जातो.

**मंगळ शांती पूजा:** मंगळवारी हनुमान मंदिरात जाऊन विशेष पूजा करावी. सिंदूर अर्पण करावे आणि हनुमान चालीसाचे पठण करावे.

**दैनिक उपाय:**
- मंगळवारी उपवास करावा
- लाल वस्त्र दान करावे
- मसूर डाळ दान करावी
- हनुमान मंदिरात तेल अर्पण करावे
- सुंदरकांड पठण करावे

**रत्न उपाय:** प्रवाळ (Red Coral) रत्न सोन्याच्या अंगठीत मंगळवारी धारण करता येते. मात्र, ज्योतिषाच्या सल्ल्याशिवाय रत्न धारण करू नये.

### निष्कर्ष

मंगळ दोषाची अनावश्यक भीती बाळगू नये. योग्य ज्योतिषीय विश्लेषण, शास्त्रोक्त उपाय आणि विवेकपूर्ण दृष्टिकोन ठेवल्यास मंगळ दोषावर मात करता येते. विवाह जुळवताना केवळ मंगळ दोषावर लक्ष केंद्रित न करता, संपूर्ण कुंडली मिलन करणे आवश्यक आहे.`,
    contentEn: `## Mangal Dosha — Marriage Impact and Remedies

Mangal Dosha is one of the most discussed doshas in Vedic astrology. It holds extremely important significance in matchmaking. However, many misconceptions about this dosha are prevalent. In this article, we will learn the true information about Mangal Dosha and proper remedies.

### How Does Mangal Dosha Form?

Mangal Dosha forms when Mars is positioned in the 1st (Lagna), 4th, 7th, 8th, or 12th house in a birth chart. This dosha is also called 'Kuja Dosha' or 'Angaraka Dosha'. Approximately 40-50% of the Indian population has Mangal Dosha in their charts.

### Types of Mangal Dosha

**Severe Mangal Dosha:** When Mars is in the 7th or 8th house, it is considered more intense. The effect is particularly strong when under the aspect of malefic planets.

**Mild Mangal Dosha:** When Mars is in the 4th or 12th house and under the aspect of benefic planets, the dosha is considered mild.

### Impact on Marriage

A common rule states that a person with Mangal Dosha should marry another person with Mangal Dosha. This is called 'Dosha Saman'. However, this rule doesn't apply in all situations. Certain planetary combinations can automatically neutralize Mangal Dosha.

### Conditions When Mangal Dosha Gets Cancelled

- When Mars is in its own sign (Aries/Scorpio)
- When Mars is exalted (in Capricorn)
- When Jupiter or Venus aspects Mars
- After age 28, the effect of Mangal Dosha diminishes
- When Mars is in an auspicious position in the Navamsa chart

### Scriptural Remedies

**Kumbh Vivah:** A girl with Mangal Dosha first marries a Vishnu idol, Peepal tree, or earthen pot. After this, the second marriage is performed. This remedy is considered highly effective.

**Mangal Shanti Puja:** Visit a Hanuman temple on Tuesdays for special worship. Offer sindoor and recite Hanuman Chalisa.

**Daily Remedies:**
- Fast on Tuesdays
- Donate red clothes
- Donate masoor dal (red lentils)
- Offer oil at Hanuman temple
- Recite Sundarkand

**Gemstone Remedy:** Red Coral (Praval) can be worn in a gold ring on Tuesdays. However, never wear any gemstone without consulting an astrologer.

### Conclusion

There is no need to have unnecessary fear of Mangal Dosha. With proper astrological analysis, scriptural remedies, and a rational approach, Mangal Dosha can be overcome. When arranging marriages, instead of focusing solely on Mangal Dosha, complete horoscope matching should be performed.`,
  },
  {
    titleMr: "नवग्रह पूजा — नऊ ग्रहांची शक्ती आणि पूजाविधी",
    titleEn: "Navagraha Puja — Power of Nine Planets and Worship Rituals",
    cat: "पूजा", catEn: "Puja",
    summaryMr: "नवग्रह पूजा कशी करावी, कोणत्या ग्रहासाठी कोणते मंत्र व उपाय करावेत याचे सविस्तर मार्गदर्शन.",
    summaryEn: "Detailed guidance on performing Navagraha Puja, mantras, and remedies for each planet.",
    contentMr: `## नवग्रह पूजा — संपूर्ण विधी आणि मार्गदर्शन

वैदिक ज्योतिषानुसार नऊ ग्रह मानवी जीवनावर सतत प्रभाव टाकत असतात. सूर्य, चंद्र, मंगळ, बुध, गुरू, शुक्र, शनि, राहू आणि केतू हे नऊ ग्रह प्रत्येक व्यक्तीच्या भाग्य, आरोग्य, करिअर आणि नातेसंबंधांवर परिणाम करतात. नवग्रह पूजा ही या सर्व ग्रहांना प्रसन्न करण्याची एक प्रभावी विधी आहे.

### नवग्रह पूजेचे महत्व

कुंडलीतील कोणताही ग्रह अशुभ स्थानात असल्यास किंवा पापग्रहांच्या दृष्टीत असल्यास, त्या ग्रहाचा नकारात्मक प्रभाव जाणवतो. नवग्रह पूजा केल्याने सर्व ग्रह शांत होतात आणि त्यांचा शुभ प्रभाव वाढतो.

### प्रत्येक ग्रहाची माहिती आणि उपाय

**सूर्य (Sun):** आत्मा, पिता, सरकारी नोकरी, आरोग्य यांचा कारक. रविवारी सूर्योदयाला जल अर्पण करावे. मंत्र: "ॐ सूर्याय नमः". रत्न: माणिक.

**चंद्र (Moon):** मन, माता, भावना यांचा कारक. सोमवारी शिव पूजा करावी. मंत्र: "ॐ चंद्राय नमः". रत्न: मोती.

**मंगळ (Mars):** धैर्य, भावंड, जमीन यांचा कारक. मंगळवारी हनुमान पूजा करावी. मंत्र: "ॐ अंगारकाय नमः". रत्न: प्रवाळ.

**बुध (Mercury):** बुद्धी, व्यापार, वाणी यांचा कारक. बुधवारी विष्णू पूजा करावी. मंत्र: "ॐ बुधाय नमः". रत्न: पाचू.

**गुरू (Jupiter):** ज्ञान, गुरू, विवाह यांचा कारक. गुरुवारी बृहस्पती पूजा करावी. मंत्र: "ॐ बृहस्पतये नमः". रत्न: पुष्कराज.

**शुक्र (Venus):** प्रेम, सौंदर्य, कला, वाहन यांचा कारक. शुक्रवारी लक्ष्मी पूजा करावी. मंत्र: "ॐ शुक्राय नमः". रत्न: हिरा.

**शनि (Saturn):** कर्म, न्याय, आयुष्य यांचा कारक. शनिवारी शनि पूजा करावी. मंत्र: "ॐ शनैश्चराय नमः". रत्न: नीलम.

**राहू (Rahu):** माया, अचानक बदल, परदेश यांचा कारक. राहूकालात पूजा टाळावी. मंत्र: "ॐ राहवे नमः". रत्न: गोमेद.

**केतू (Ketu):** मोक्ष, आध्यात्म, रहस्य यांचा कारक. मंगळवारी गणपती पूजा करावी. मंत्र: "ॐ केतवे नमः". रत्न: लहसुनिया.

### नवग्रह पूजा विधी

नवग्रह पूजा करताना प्रथम गणपती पूजन करावे. त्यानंतर नवग्रह यंत्राची स्थापना करावी. प्रत्येक ग्रहाला त्याच्या आवडीचे धान्य, फूल आणि नैवेद्य अर्पण करावे. शेवटी नवग्रह स्तोत्राचे पठण करावे. ही पूजा अनुभवी गुरुजींच्या मार्गदर्शनाखाली करणे उचित आहे.

### कधी करावी नवग्रह पूजा?

- नवीन कार्यारंभ करताना
- विवाहपूर्वी
- गृहप्रवेशाच्या वेळी
- ग्रह गोचर बदलताना
- आजारपणात
- व्यवसाय सुरू करताना

### निष्कर्ष

नवग्रह पूजा ही एक शक्तिशाली विधी आहे जी सर्व ग्रहांचा अनुकूल प्रभाव मिळवून देते. नियमित पूजा आणि मंत्रजपाने जीवनात शांती, समृद्धी आणि यश प्राप्त होते.`,
    contentEn: `## Navagraha Puja — Complete Rituals and Guidance

According to Vedic astrology, nine planets continuously influence human life. Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — these nine planets affect every person's destiny, health, career, and relationships. Navagraha Puja is an effective ritual to appease all these planets.

### Importance of Navagraha Puja

When any planet in the horoscope is in an inauspicious position or under the aspect of malefic planets, its negative influence is felt. Performing Navagraha Puja pacifies all planets and enhances their positive influence.

### Information and Remedies for Each Planet

**Sun:** Significator of soul, father, government job, health. Offer water at sunrise on Sundays. Mantra: "Om Suryaya Namah". Gemstone: Ruby.

**Moon:** Significator of mind, mother, emotions. Perform Shiva puja on Mondays. Mantra: "Om Chandraya Namah". Gemstone: Pearl.

**Mars:** Significator of courage, siblings, land. Perform Hanuman puja on Tuesdays. Mantra: "Om Angarakaya Namah". Gemstone: Red Coral.

**Mercury:** Significator of intellect, business, speech. Perform Vishnu puja on Wednesdays. Mantra: "Om Budhaya Namah". Gemstone: Emerald.

**Jupiter:** Significator of knowledge, guru, marriage. Perform Brihaspati puja on Thursdays. Mantra: "Om Brihaspataye Namah". Gemstone: Yellow Sapphire.

**Venus:** Significator of love, beauty, art, vehicles. Perform Lakshmi puja on Fridays. Mantra: "Om Shukraya Namah". Gemstone: Diamond.

**Saturn:** Significator of karma, justice, longevity. Perform Shani puja on Saturdays. Mantra: "Om Shanaischaraya Namah". Gemstone: Blue Sapphire.

**Rahu:** Significator of illusion, sudden changes, foreign lands. Avoid puja during Rahu Kaal. Mantra: "Om Rahave Namah". Gemstone: Hessonite.

**Ketu:** Significator of moksha, spirituality, mystery. Perform Ganapati puja on Tuesdays. Mantra: "Om Ketave Namah". Gemstone: Cat's Eye.

### Navagraha Puja Procedure

When performing Navagraha Puja, first worship Ganapati. Then establish the Navagraha Yantra. Offer each planet its preferred grain, flower, and naivedya. Finally, recite the Navagraha Stotra. It is advisable to perform this puja under the guidance of experienced priests.

### When to Perform Navagraha Puja?

- When starting new ventures
- Before marriage
- During house-warming ceremony
- When planetary transits change
- During illness
- When starting a business

### Conclusion

Navagraha Puja is a powerful ritual that helps gain favorable influence of all planets. Regular worship and mantra chanting bring peace, prosperity, and success in life.`,
  },
  {
    titleMr: "राहू-केतू गोचर 2026 — सर्व राशींवर होणारा प्रभाव",
    titleEn: "Rahu-Ketu Transit 2026 — Impact on All Zodiac Signs",
    cat: "ज्योतिष", catEn: "Astrology",
    summaryMr: "2026 मधील राहू-केतू गोचराचा सर्व बारा राशींवर होणारा प्रभाव आणि उपाय.",
    summaryEn: "Effects of 2026 Rahu-Ketu transit on all twelve zodiac signs and remedies.",
    contentMr: `## राहू-केतू गोचर 2026

राहू आणि केतू हे वैदिक ज्योतिषातील छाया ग्रह आहेत. हे दोन ग्रह नेहमी एकमेकांच्या विरुद्ध राशीत गोचर करतात. राहू-केतूचा गोचर दीड वर्षाने बदलतो आणि प्रत्येक बदलाचा सर्व बारा राशींवर मोठा प्रभाव पडतो.

### राहू-केतू म्हणजे काय?

राहू आणि केतू हे प्रत्यक्ष ग्रह नसून चंद्राच्या कक्षेचे दोन बिंदू आहेत. उत्तर चंद्रबिंदू (North Node) म्हणजे राहू आणि दक्षिण चंद्रबिंदू (South Node) म्हणजे केतू. हे बिंदू ग्रहणांशी संबंधित आहेत आणि त्यांचा प्रभाव अत्यंत तीव्र असतो.

### 2026 मध्ये राहू-केतूचा गोचर

2026 मध्ये राहू मीन राशीत आणि केतू कन्या राशीत गोचर करत आहे. या गोचराचा प्रभाव प्रत्येक राशीवर वेगवेगळा असतो.

### प्रत्येक राशीवर प्रभाव

**मेष:** राहू बारावे स्थानात — खर्चात वाढ, परदेशी प्रवास संभव. आध्यात्मिक प्रगती. केतू सहाव्या स्थानात — शत्रूंवर विजय.

**वृषभ:** राहू अकरावे स्थानात — आर्थिक लाभ, मित्रांकडून मदत. केतू पाचव्या स्थानात — संतान काळजी.

**मिथुन:** राहू दहावे स्थानात — करिअरमध्ये बदल, प्रसिद्धी. केतू चौथ्या स्थानात — गृहशांतीत अडथळे.

**कर्क:** राहू नवव्या स्थानात — भाग्योदय, धार्मिक प्रवास. केतू तिसऱ्या स्थानात — धैर्य वाढ.

**सिंह:** राहू आठव्या स्थानात — अचानक बदल, रहस्यमय घटना. केतू दुसऱ्या स्थानात — वाणीवर नियंत्रण.

**कन्या:** राहू सातव्या स्थानात — वैवाहिक जीवनात बदल. केतू लग्नात — आध्यात्मिक जागृती.

**तूळ:** राहू सहाव्या स्थानात — शत्रूंवर विजय, आरोग्य सुधारणा. केतू बारावे स्थानात — मोक्ष प्राप्ती.

**वृश्चिक:** राहू पाचव्या स्थानात — बौद्धिक प्रगती. केतू अकरावे स्थानात — लाभ.

**धनु:** राहू चौथ्या स्थानात — वाहन/घर खरेदी. केतू दहावे स्थानात — करिअर बदल.

**मकर:** राहू तिसऱ्या स्थानात — धैर्य वाढ, प्रवास. केतू नवव्या स्थानात — आध्यात्मिक प्रगती.

**कुंभ:** राहू दुसऱ्या स्थानात — आर्थिक लाभ. केतू आठव्या स्थानात — सावधगिरी.

**मीन:** राहू लग्नात — व्यक्तिमत्वात बदल, नवीन सुरुवात. केतू सातव्या स्थानात — भागीदारीत बदल.

### सामान्य उपाय

- राहूसाठी: गोमेद धारण करा, बुधवारी दुर्गा पूजा करा
- केतूसाठी: लहसुनिया धारण करा, गणपती पूजा करा
- दोन्हींसाठी: नवग्रह शांती पूजा करवून घ्या

### निष्कर्ष

राहू-केतूचा गोचर प्रत्येक व्यक्तीवर वेगवेगळ्या प्रकारे प्रभाव टाकतो. आपल्या कुंडलीनुसार योग्य उपाय केल्यास या गोचराचे सकारात्मक फळ मिळू शकते.`,
    contentEn: `## Rahu-Ketu Transit 2026

Rahu and Ketu are shadow planets in Vedic astrology. These two planets always transit in opposite zodiac signs. The Rahu-Ketu transit changes every one and a half years, and each change significantly impacts all twelve zodiac signs.

### What Are Rahu and Ketu?

Rahu and Ketu are not physical planets but two points of the Moon's orbit. The North Lunar Node is Rahu and the South Lunar Node is Ketu. These points are related to eclipses and their influence is extremely intense.

### Rahu-Ketu Transit in 2026

In 2026, Rahu is transiting through Pisces and Ketu through Virgo. The impact of this transit varies for each zodiac sign.

### Impact on Each Sign

**Aries:** Rahu in 12th house — increased expenses, foreign travel possible. Spiritual progress. Ketu in 6th house — victory over enemies.

**Taurus:** Rahu in 11th house — financial gains, help from friends. Ketu in 5th house — concerns about children.

**Gemini:** Rahu in 10th house — career changes, fame. Ketu in 4th house — domestic disturbances.

**Cancer:** Rahu in 9th house — rise in fortune, religious travel. Ketu in 3rd house — increased courage.

**Leo:** Rahu in 8th house — sudden changes, mysterious events. Ketu in 2nd house — control over speech.

**Virgo:** Rahu in 7th house — changes in married life. Ketu in Lagna — spiritual awakening.

**Libra:** Rahu in 6th house — victory over enemies, health improvement. Ketu in 12th house — spiritual liberation.

**Scorpio:** Rahu in 5th house — intellectual progress. Ketu in 11th house — gains.

**Sagittarius:** Rahu in 4th house — vehicle/house purchase. Ketu in 10th house — career change.

**Capricorn:** Rahu in 3rd house — increased courage, travel. Ketu in 9th house — spiritual progress.

**Aquarius:** Rahu in 2nd house — financial gains. Ketu in 8th house — exercise caution.

**Pisces:** Rahu in Lagna — personality transformation, new beginnings. Ketu in 7th house — partnership changes.

### General Remedies

- For Rahu: Wear Hessonite, perform Durga puja on Wednesdays
- For Ketu: Wear Cat's Eye, perform Ganapati puja
- For both: Get Navagraha Shanti Puja performed

### Conclusion

Rahu-Ketu transit affects each individual differently. By performing appropriate remedies according to your horoscope, you can gain positive results from this transit.`,
  },
];

// Auto-generate SEO, AEO, GEO fields from article content
function generateSeoFields(article: typeof articles[0]) {
  // Extract keywords from title
  const titleWords = article.titleEn.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const baseKeywords = [
    "vedic astrology", "horoscope", "kundli", "astrology",
    "horoscope today", "daily horoscope", "jyotish",
  ];
  const keywords = [...new Set([...titleWords, ...baseKeywords])].slice(0, 15);
  const keywordsMr = article.titleMr.split(/\s+/).filter(w => w.length > 2).slice(0, 8);

  // Generate FAQ from content headings
  const faq: { questionMr: string; questionEn: string; answerMr: string; answerEn: string }[] = [];
  const contentSections = article.contentEn.split("### ").slice(1, 5);
  const contentSectionsMr = article.contentMr.split("### ").slice(1, 5);

  for (let i = 0; i < Math.min(contentSections.length, contentSectionsMr.length, 4); i++) {
    const sectionEn = contentSections[i];
    const sectionMr = contentSectionsMr[i];
    const headingEn = sectionEn.split("\n")[0].trim();
    const headingMr = sectionMr.split("\n")[0].trim();
    const bodyEn = sectionEn.split("\n").slice(1).join(" ").replace(/\s+/g, " ").trim().substring(0, 300);
    const bodyMr = sectionMr.split("\n").slice(1).join(" ").replace(/\s+/g, " ").trim().substring(0, 300);

    if (headingEn && bodyEn) {
      faq.push({
        questionEn: headingEn.includes("?") ? headingEn : `What is ${headingEn}?`,
        questionMr: headingMr.includes("?") ? headingMr : `${headingMr} म्हणजे काय?`,
        answerEn: bodyEn.endsWith(".") ? bodyEn : bodyEn + ".",
        answerMr: bodyMr,
      });
    }
  }

  return {
    seo: {
      metaTitle: article.titleEn.substring(0, 60),
      metaDescription: article.summaryEn.substring(0, 160),
      keywords,
      keywordsMr,
    },
    faq,
  };
}

function getArticleForDate(date: string, topicIndex?: number): typeof articles[0] {
  if (topicIndex !== undefined && topicIndex >= 0 && topicIndex < articles.length) {
    return articles[topicIndex];
  }
  const dayOfYear = Math.floor((new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) / 86400000);
  return articles[dayOfYear % articles.length];
}

// GET — auto-generate daily blog (called by cron or admin)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const topicParam = searchParams.get("topic");
  const topicIndex = topicParam !== null ? parseInt(topicParam) : undefined;

  const today = new Date().toISOString().slice(0, 10);
  const article = getArticleForDate(today, topicIndex);
  const slug = `${today}-${article.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").substring(0, 60)}`;
  const filePath = path.join(BLOG_DIR, `${slug}.json`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ message: "This article already exists", slug });
  }

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  const { seo, faq } = generateSeoFields(article);
  const post = {
    slug,
    title: article.titleMr,
    titleEn: article.titleEn,
    summary: article.summaryMr,
    summaryEn: article.summaryEn,
    date: today,
    category: article.cat,
    categoryEn: article.catEn,
    content: article.contentMr,
    contentEn: article.contentEn,
    seo,
    faq,
  };

  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), "utf-8");
  return NextResponse.json({ success: true, slug, title: post.titleEn });
}

// POST — generate with specific topic selection (from admin)
export async function POST(req: NextRequest) {
  const { topicIndex } = await req.json().catch(() => ({ topicIndex: undefined }));

  const today = new Date().toISOString().slice(0, 10);
  const article = getArticleForDate(today, topicIndex);
  const slug = `${today}-${article.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").substring(0, 60)}`;
  const filePath = path.join(BLOG_DIR, `${slug}.json`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ message: "This article already exists", slug });
  }

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

  const { seo, faq } = generateSeoFields(article);
  const post = {
    slug,
    title: article.titleMr,
    titleEn: article.titleEn,
    summary: article.summaryMr,
    summaryEn: article.summaryEn,
    date: today,
    category: article.cat,
    categoryEn: article.catEn,
    content: article.contentMr,
    contentEn: article.contentEn,
    seo,
    faq,
  };

  fs.writeFileSync(filePath, JSON.stringify(post, null, 2), "utf-8");
  return NextResponse.json({ success: true, slug, title: post.titleEn });
}

// Export topic list for admin UI
export const topicList = articles.map((a, i) => ({ index: i, titleMr: a.titleMr, titleEn: a.titleEn, cat: a.catEn }));
