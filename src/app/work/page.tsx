"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import unitWorkData from "@/data/unitWork.json";
import { Project } from "@/types";
import ProjectList from "@/components/ProjectList";

const unitWork = unitWorkData as Project[];
const YEARS = [2026, 2025];

export default function WorkPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2026);

  const filtered = unitWork.filter((p) => p.year === selectedYear);

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm shrink-0"
          >
            ←
          </button>
          <div className="flex items-center gap-6">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className="text-base font-bold transition-colors"
                style={{ color: selectedYear === year ? "#ffffff" : "rgba(255,255,255,0.35)" }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {filtered.length > 0 ? (
          <ProjectList projects={filtered} />
        ) : (
          <p className="text-sm text-gray-400 text-center py-12">등록된 업무가 없습니다.</p>
        )}
      </div>
    </main>
  );
}
