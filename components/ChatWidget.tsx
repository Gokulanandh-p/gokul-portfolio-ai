"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string; ts: number };

const DEFAULT_SUGGESTIONS = [
  "Tell me about Gokul",
  "What skills does he have?",
  "What roles is he looking for?",
  "Show projects",
  "How can I contact him?"
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"compact" | "expanded">("compact");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I’m Gokul AI. Ask me about Gokul’s background, skills, projects, or how to contact him.",
      ts: Date.now()
    }
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const suggestions = useMemo(() => DEFAULT_SUGGESTIONS, []);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, mode]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open, mode]);

  function clearChat() {
    setMsgs([
      {
        role: "assistant",
        text: "Chat cleared ✅ Ask me anything about Gokul.",
        ts: Date.now()
      }
    ]);
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMsgs((m) => [...m, { role: "user", text: trimmed, ts: Date.now() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      const data = await res.json();
      const reply = String(data?.reply ?? "No reply.");
      setMsgs((m) => [...m, { role: "assistant", text: reply, ts: Date.now() }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: "Network error. Please try again.", ts: Date.now() }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const isExpanded = mode === "expanded";
  const width = isExpanded ? "w-[560px]" : "w-[380px]";
  const height = isExpanded ? "h-[680px]" : "h-[560px]";

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full px-4 py-3 shadow-lg bg-black text-white hover:opacity-90 active:scale-[0.99]"
          aria-label="Open chat"
        >
          Ask Gokul AI
        </button>
      ) : (
        <div
          className={`${width} ${height} bg-white text-black rounded-2xl shadow-2xl border overflow-hidden flex flex-col`}
          role="dialog"
          aria-label="Gokul AI chat"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                GA
              </div>
              <div>
                <div className="font-semibold leading-tight">Gokul AI</div>
                <div className="text-xs text-gray-500 leading-tight">
                  Profile-based answers • Powered by Gemini
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                title="Clear chat"
                disabled={loading}
              >
                Clear
              </button>

              <button
                onClick={() => setMode((m) => (m === "compact" ? "expanded" : "compact"))}
                className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                title={isExpanded ? "Compact" : "Expand"}
              >
                {isExpanded ? "Compact" : "Expand"}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                title="Close"
              >
                Close
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 border-b bg-white">
            <div className="text-xs text-gray-600 mb-2">Try one of these:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={loading}
                  className="text-xs px-2 py-1 rounded-full border bg-white text-black hover:bg-gray-100 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto px-4 py-4 space-y-3 bg-white">
            {msgs.map((m, i) => (
              <div key={m.ts + i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed " +
                    (m.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black border border-gray-200")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-gray-100 text-black border border-gray-200">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                    <span className="text-gray-500 text-xs ml-1">Typing…</span>
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm bg-white text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Ask something… (Enter to send, Shift+Enter for new line)"
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:opacity-90 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-[11px] text-gray-500">
              Tip: Ask “What roles is he looking for?” or “Summarize his experience in 3 bullets.”
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
