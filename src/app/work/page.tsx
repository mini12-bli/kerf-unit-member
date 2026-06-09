"use client";
import { useRouter } from "next/navigation";
import unitWorkData from "@/data/unitWork.json";
import { Project } from "@/types";
import ProjectList from "@/components/ProjectList";

const unitWork = unitWorkData as Project[];

export default function WorkPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">📋</div>
            <div>
              <p className="text-xs text-white/60">커머스프로덕트 유닛</p>
              <h1 className="text-base font-bold text-white">업무</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {unitWork.length > 0 ? (
          <ProjectList projects={unitWork} />
        ) : (
          <p className="text-sm text-gray-400 text-center py-12">등록된 업무가 없습니다.</p>
        )}
      </div>
    </main>
  );
}
