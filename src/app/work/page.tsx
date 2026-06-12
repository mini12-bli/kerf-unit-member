"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import unitWorkData from "@/data/unitWork.json";
import { Project } from "@/types";

const unitWork = unitWorkData as Project[];
const YEARS = [2026, 2025];
type ViewMode = "스쿼드별" | "진행상황별";
const VIEW_MODES: ViewMode[] = ["스쿼드별", "진행상황별"];

const squadOrder: Record<string, number> = {
  커머스전시: 0, 프로모션전시: 1, 검색: 2, 웰니스: 3, "W케어": 4, 발견: 5, 주문결제: 6, 포스트오더: 7,
};
const squadColor: Record<string, string> = {
  커머스전시: "#6366f1",
  프로모션전시: "#8b5cf6",
  검색: "#10b981",
  웰니스: "#06b6d4",
  "W케어": "#f59e0b",
  발견: "#ef4444",
  주문결제: "#f97316",
  포스트오더: "#64748b",
};

type Status = Project["status"];

const STATUS_META: Record<Status, { label: string; dotClass: string; badgeClass: string }> = {
  검토중: { label: "검토중", dotClass: "bg-gray-400", badgeClass: "bg-gray-100 text-gray-500" },
  진행중: { label: "진행중", dotClass: "bg-blue-500", badgeClass: "bg-blue-100 text-blue-700" },
  완료: { label: "완료", dotClass: "bg-green-500", badgeClass: "bg-green-100 text-green-700" },
};

const SQUADS = ["전체", "커머스전시", "프로모션전시", "검색", "웰니스", "W케어", "발견", "주문결제", "포스트오더"] as const;
type SquadFilter = typeof SQUADS[number];
const SQUAD_OPTIONS = SQUADS.filter((s) => s !== "전체");

const FILTER_OPTIONS = ["전체", "진행중", "검토중", "최신순"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

function StatusChip({ status, completedDate }: { status: Status; completedDate?: string }) {
  if (status === "완료" && completedDate) {
    const [, m, d] = completedDate.split("-");
    return (
      <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 bg-green-100 text-green-700">
        {`${parseInt(m)}.${parseInt(d)}`}
      </span>
    );
  }
  const meta = STATUS_META[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${meta.badgeClass}`}>
      {meta.label}
    </span>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const squad = project.squad;
  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-0 min-w-0">
        {squad && (
          <span className="text-sm text-gray-400 shrink-0">[{squad}]&nbsp;</span>
        )}
        <span className="text-sm text-gray-700 truncate">{project.name}</span>
        {project.milestone && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 font-medium ml-1.5">
            {project.milestone}
          </span>
        )}
      </div>
      <StatusChip status={project.status} completedDate={project.completedDate} />
    </li>
  );
}

function FlatList({ projects }: { projects: Project[] }) {
  return (
    <ul className="bg-white rounded-2xl shadow-sm px-4">
      {projects.map((p) => (
        <ProjectRow key={p.id} project={p} />
      ))}
    </ul>
  );
}

function StatusSection({ status, projects }: { status: Status; projects: Project[] }) {
  const meta = STATUS_META[status];
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dotClass}`} />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{status}</h3>
        <span className="text-xs text-gray-400">{projects.length}</span>
      </div>
      <ul className="bg-white rounded-2xl shadow-sm px-4">
        {projects.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}
      </ul>
    </div>
  );
}

interface AddFormData {
  squad: string;
  name: string;
  status: Status;
  completedDate: string;
}

function AddProjectModal({ year, onClose, onAdd }: {
  year: number;
  onClose: () => void;
  onAdd: (p: Project) => void;
}) {
  const [form, setForm] = useState<AddFormData>({
    squad: SQUAD_OPTIONS[0],
    name: "",
    status: "진행중",
    completedDate: "",
  });
  const [visible, setVisible] = useState(false);

  useState(() => { requestAnimationFrame(() => setVisible(true)); });

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: form.name.trim(),
      status: form.status,
      year,
      squad: form.squad,
      date: new Date().toISOString().slice(0, 10),
      ...(form.status === "완료" && form.completedDate ? { completedDate: form.completedDate } : {}),
    };
    onAdd(newProject);
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-250 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className={`relative w-full bg-white rounded-t-3xl shadow-2xl transition-transform duration-250 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-6 pb-8 pt-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">과제 등록</h2>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* 스쿼드 */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">스쿼드</label>
              <select
                value={form.squad}
                onChange={(e) => setForm((f) => ({ ...f, squad: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                {SQUAD_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 과제명 */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">과제명</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="과제명을 입력하세요"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {/* 상태 */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">상태</label>
              <div className="flex gap-2">
                {(["진행중", "검토중", "완료"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      form.status === s
                        ? s === "진행중" ? "bg-blue-100 text-blue-700" : s === "검토중" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 완료날짜 (완료 선택 시) */}
            {form.status === "완료" && (
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">완료날짜</label>
                <input
                  type="date"
                  value={form.completedDate}
                  onChange={(e) => setForm((f) => ({ ...f, completedDate: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [viewMode, setViewMode] = useState<ViewMode>("스쿼드별");
  const [squadFilter, setSquadFilter] = useState<SquadFilter>("전체");
  const [filterOption, setFilterOption] = useState<FilterOption>("전체");
  const [addedProjects, setAddedProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const allProjects = [...unitWork, ...addedProjects];

  const filtered = allProjects
    .filter((p) => p.year === selectedYear)
    .filter((p) => squadFilter === "전체" || p.squad === squadFilter)
    .filter((p) => {
      if (filterOption === "진행중") return p.status === "진행중";
      if (filterOption === "검토중") return p.status === "검토중";
      return true;
    });

  function applySort(items: Project[]): Project[] {
    if (filterOption === "최신순") return [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    return items;
  }

  function renderContent() {
    if (filtered.length === 0) {
      return <p className="text-sm text-gray-400 text-center py-12">등록된 업무가 없습니다.</p>;
    }

    if (viewMode === "스쿼드별") {
      const base = [...filtered].sort((a, b) => {
        const sa = a.squad ?? "기타";
        const sb = b.squad ?? "기타";
        const squadDiff = (squadOrder[sa] ?? 99) - (squadOrder[sb] ?? 99);
        if (squadDiff !== 0) return squadDiff;
        const statusOrd: Record<Status, number> = { 진행중: 0, 검토중: 1, 완료: 2 };
        return statusOrd[a.status] - statusOrd[b.status];
      });
      return <FlatList projects={applySort(base)} />;
    }

    if (viewMode === "진행상황별") {
      const statuses: Status[] = ["진행중", "검토중", "완료"];
      return statuses
        .filter((s) => filtered.some((p) => p.status === s))
        .map((s) => (
          <StatusSection
            key={s}
            status={s}
            projects={applySort(filtered.filter((p) => p.status === s))}
          />
        ));
    }
  }

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

      <div className="max-w-6xl mx-auto px-6 pt-5 pb-24">
        {/* 뷰 모드 탭 */}
        <div className="flex items-center gap-5 mb-4 border-b border-gray-200">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="pb-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
              style={{
                color: viewMode === mode ? "#1e293b" : "#9ca3af",
                borderBottomColor: viewMode === mode ? "#1e293b" : "transparent",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* 필터 드롭다운 */}
        <div className="flex justify-end gap-2 mb-4">
          <select
            value={squadFilter}
            onChange={(e) => setSquadFilter(e.target.value as SquadFilter)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            {SQUADS.map((s) => (
              <option key={s} value={s}>{s === "전체" ? "스쿼드 전체" : s}</option>
            ))}
          </select>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value as FilterOption)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            {FILTER_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {renderContent()}
      </div>

      {/* 플로팅 등록 버튼 */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center text-2xl z-40"
      >
        +
      </button>

      {showAddModal && (
        <AddProjectModal
          year={selectedYear}
          onClose={() => setShowAddModal(false)}
          onAdd={(p) => setAddedProjects((prev) => [...prev, p])}
        />
      )}
    </main>
  );
}
