"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useLang } from "@/lib/astrology/language-context";

interface Props {
  chartContext: Record<string, unknown>;
}

export function KundliChatDrawer({ chartContext }: Props) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/kundli-chat",
      body: { chartContext, lang },
    }),
    onError: (err) => setErrorMsg(err.message || "Chat error"),
  });

  const busy = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const suggestions = [
    t("माझा सध्याचा दशाफल काय सांगतो?", "What does my current dasha indicate?", "मेरा वर्तमान दशाफल क्या कहता है?"),
    t("विवाहाचा शुभकाळ कधी?", "When is an auspicious time for marriage?", "विवाह का शुभ समय कब है?"),
    t("नोकरी / करिअरसाठी काय उपाय?", "What remedies for career growth?", "करियर के लिए क्या उपाय?"),
    t("माझ्या कुंडलीतील सर्वात बलवान ग्रह?", "Strongest planet in my chart?", "मेरी कुंडली का सबसे बलवान ग्रह?"),
  ];

  const handleSend = (text: string) => {
    if (!text.trim() || busy) return;
    setErrorMsg("");
    sendMessage({ text });
    setInput("");
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg px-5 py-3 text-white font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform print:hidden"
          style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}
        >
          <span>✨</span>
          {t("पत्रिकेबद्दल विचारा", "Ask about your kundli", "पत्रिका के बारे में पूछें")}
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex sm:items-end sm:justify-end print:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full sm:w-[420px] h-full sm:h-[600px] sm:mr-6 sm:mb-6 sm:rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}>
              <div>
                <div className="font-bold text-sm">{t("कुंडली सल्लागार", "Kundli Consultant", "कुंडली सलाहकार")}</div>
                <div className="text-[10px] opacity-80">{t("आपल्या पत्रिकेवर आधारित AI सल्ला", "AI guidance based on your chart", "आपकी पत्रिका पर आधारित AI सलाह")}</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white text-xl leading-none hover:opacity-75">×</button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.length === 0 && (
                <div className="text-center text-stone-500 text-xs py-8">
                  <p className="mb-3">{t("प्रश्न विचारून सुरुवात करा", "Start by asking a question", "प्रश्न पूछकर शुरू करें")}</p>
                  <div className="flex flex-col gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="text-left text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg hover:border-[#5c1a1a] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#5c1a1a] text-white rounded-br-sm"
                        : "bg-white text-stone-800 border border-stone-200 rounded-bl-sm"
                    }`}
                  >
                    {m.parts
                      .filter((p) => p.type === "text")
                      .map((p, i) => (
                        <span key={i}>{"text" in p ? p.text : ""}</span>
                      ))}
                  </div>
                </div>
              ))}

              {busy && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-500">
                    <span className="inline-block animate-pulse">●●●</span>
                  </div>
                </div>
              )}

              {(errorMsg || error) && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md px-3 py-2">
                  {errorMsg || error?.message}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="border-t border-stone-200 p-3 flex gap-2 bg-white"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("प्रश्न लिहा...", "Type a question...", "प्रश्न लिखें...")}
                disabled={busy}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5c1a1a] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="px-4 py-2 text-white text-sm font-semibold rounded-md disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}
              >
                {t("पाठवा", "Send", "भेजें")}
              </button>
            </form>
            <div className="px-3 pb-2 text-[10px] text-stone-400 bg-white">
              {t("मर्यादा: दररोज २० संदेश", "Limit: 20 messages/day", "सीमा: रोज़ २० संदेश")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
