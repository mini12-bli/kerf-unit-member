"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SnackItem {
  id: string;
  text: string;
  done: boolean;
}

const INITIAL_ITEMS: SnackItem[] = [];

export default function SnackPage() {
  const router = useRouter();
  const [items, setItems] = useState<SnackItem[]>(INITIAL_ITEMS);
  const [input, setInput] = useState("");

  function addItem() {
    const text = input.trim();
    if (!text) return;
    setItems((prev) => [...prev, { id: `snack_${Date.now()}`, text, done: false }]);
    setInput("");
  }

  function toggleItem(id: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm shrink-0"
          >
            ←
          </button>
          <span className="text-white font-bold text-base">🍩 간식</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-24">
        {/* 입력 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="간식 추가하기"
            className="flex-1 text-base border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400"
            style={{ fontSize: 16 }}
          />
          <button
            onClick={addItem}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            추가
          </button>
        </div>

        {/* 리스트 */}
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">간식을 추가해보세요 🍪</p>
        ) : (
          <ul className="bg-white rounded-2xl shadow-sm">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 last:border-0"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    item.done
                      ? "border-slate-800 bg-slate-800"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {item.done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-sm ${item.done ? "line-through text-gray-300" : "text-gray-700"}`}>
                  {item.text}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-300 hover:text-gray-500 text-lg leading-none shrink-0"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 완료 카운트 */}
        {items.length > 0 && (
          <p className="text-xs text-gray-400 text-right mt-3">
            {items.filter((i) => i.done).length}/{items.length} 완료
          </p>
        )}
      </div>
    </main>
  );
}
