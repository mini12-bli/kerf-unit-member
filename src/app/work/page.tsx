"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import unitWorkData from "@/data/unitWork.json";
import { Project } from "@/types";

const unitWork = unitWorkData as Project[];
const YEARS = [2026, 2025];
type ViewMode = "Team" | "Status";
const VIEW_MODES: ViewMode[] = ["Status", "Team"];

const squadOrder: Record<string, number> = {
  커머스전시: 0, 프로모션전시: 1, 검색: 2, 웰니스: 3, "W케어": 4, 발견: 5, 주문결제: 6, 포스트오더: 7, 공통: 8,
};

const TEAM_CONFIG: { name: string; squads: string[] }[] = [
  { name: "공통", squads: ["공통", "전체"] },
  { name: "트랜잭션프로덕트팀", squads: ["주문결제", "포스트오더"] },
  { name: "버티컬서비스프로덕트팀", squads: ["웰니스", "발견", "W케어"] },
  { name: "서치프로덕트팀", squads: ["검색"] },
  { name: "디스커버리프로덕트팀", squads: ["커머스전시", "프로모션전시"] },
];
const squadColor: Record<string, string> = {
  커머스전시: "#6366f1",
  프로모션전시: "#8b5cf6",
  검색: "#10b981",
  웰니스: "#06b6d4",
  "W케어": "#f59e0b",
  발견: "#ef4444",
  주문결제: "#f97316",
  포스트오더: "#64748b",
  공통: "#94a3b8",
};

type Status = Project["status"];

type ChatMessage = {
  id: string;
  text: string;
  timestamp: string;
};

const STATUS_META: Record<Status, { label: string; dotClass: string; badgeClass: string }> = {
  검토중: { label: "REVIEW", dotClass: "bg-amber-400", badgeClass: "bg-amber-100 text-amber-700" },
  진행중: { label: "진행중", dotClass: "bg-blue-500", badgeClass: "bg-blue-100 text-blue-700" },
  완료: { label: "완료", dotClass: "bg-green-500", badgeClass: "bg-green-100 text-green-700" },
  DROP: { label: "DROP", dotClass: "bg-gray-300", badgeClass: "bg-gray-100 text-gray-400" },
};

const SQUADS = ["전체", "커머스전시", "프로모션전시", "검색", "웰니스", "W케어", "발견", "주문결제", "포스트오더", "공통"] as const;
type SquadFilter = typeof SQUADS[number];
const SQUAD_OPTIONS = SQUADS.filter((s) => s !== "전체");

const FILTER_OPTIONS = ["전체", "진행중", "검토중", "최신순"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

function formatMMDD(dateStr?: string) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-");
  if (parseInt(m) === 0) return `${y}년`;
  if (parseInt(d) === 0) return `${parseInt(m)}월`;
  return `${parseInt(m)}월${parseInt(d)}일`;
}

function StatusChip({ status, date, completedDate }: { status: Status; date?: string; completedDate?: string }) {
  const meta = STATUS_META[status];

  if (status === "진행중") {
    const label = formatMMDD(date) ?? "진행중";
    const normalized = (date ?? "").replace(/-00$/, "-01");
    const isPastDate = normalized && normalized <= new Date().toISOString().slice(0, 10);
    const badgeClass = isPastDate ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700";
    return (
      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium shrink-0 ${badgeClass}`}>
        {label}
      </span>
    );
  }

  if (status === "완료") {
    const label = completedDate ? `완료 ${formatMMDD(completedDate)}` : "완료";
    return (
      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium shrink-0 ${meta.badgeClass}`}>
        {label}
      </span>
    );
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-sm font-medium shrink-0 ${meta.badgeClass}`}>
      {meta.label}
    </span>
  );
}

function displaySquad(squad: string): string {
  return squad === "전체" ? "공통" : squad;
}

function ProjectRow({ project, onClick }: { project: Project; onClick?: () => void }) {
  const squad = project.squad;
  return (
    <li
      className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0 cursor-pointer active:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-0 min-w-0">
        {squad && (
          <span className="text-sm text-gray-400 shrink-0">[{displaySquad(squad)}]&nbsp;</span>
        )}
        <span className="text-sm text-gray-700 truncate">{project.name}</span>
        {project.milestone && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0 font-medium ml-1.5">
            {project.milestone}
          </span>
        )}
      </div>
      <StatusChip status={project.status} date={project.date} completedDate={project.completedDate} />
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
      <ul className="bg-white shadow-sm px-4">
        {projects.map((p) => (
          <ProjectRow key={p.id} project={p} />
        ))}
      </ul>
    </div>
  );
}

function ProjectChatModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const storageKey = `chat_${project.id}`;
  const squadCol = squadColor[project.squad ?? ""] ?? "#94a3b8";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setMessages(JSON.parse(stored));
    } catch {}
    requestAnimationFrame(() => setVisible(true));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function addMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `msg_${Date.now()}`, text, timestamp: new Date().toISOString() }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-250 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full md:max-w-3xl h-[92vh] md:h-[80vh] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden transition-transform duration-250 ease-out ${visible ? "translate-y-0 md:scale-100" : "translate-y-full md:scale-95"}`}
      >
        {/* 좌측: 채팅 */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* 헤더 */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-2">
              <div className="w-8 h-1 rounded-full bg-gray-200" />
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-sm shrink-0 mt-2 md:mt-0"
            >
              ✕
            </button>
            {/* 데스크톱에서만 헤더에 과제 정보 표시 */}
            <div className="hidden md:flex items-center gap-2 min-w-0 ml-3">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white shrink-0"
                style={{ backgroundColor: squadCol }}
              >
                {displaySquad(project.squad ?? "")}
              </span>
              <span className="text-sm font-bold text-gray-800 truncate">{project.name}</span>
            </div>
          </div>

          {/* 모바일 과제 정보 바 */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-0.5">{displaySquad(project.squad ?? "")}</p>
              <p className="text-sm font-bold text-gray-800 truncate">{project.name}</p>
            </div>
            <StatusChip status={project.status} date={project.date} completedDate={project.completedDate} />
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-300">히스토리를 기록해보세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const urls: string[] = msg.text.match(urlRegex) ?? [];
                  const bodyText = msg.text.replace(urlRegex, "").trim();
                  return (
                    <div key={msg.id} className="group relative bg-sky-50 rounded-2xl px-4 pt-3 pb-3">
                      {/* 작성자 + 시간 + 삭제 */}
                      <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 bg-slate-700">
                            김
                          </div>
                          <span className="text-xs font-semibold text-gray-600">김미정</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-gray-300 hover:text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity leading-none"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {/* 본문 */}
                      {bodyText && (
                        <p className={`text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed pt-2 ${urls.length > 0 ? "pb-2 border-b border-sky-100" : ""}`}>
                          {bodyText}
                        </p>
                      )}
                      {/* URL 박스 */}
                      {urls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2 text-xs text-blue-500 truncate hover:bg-white/80 transition-colors"
                        >
                          <span className="shrink-0">🔗</span>
                          <span className="truncate">{url}</span>
                        </a>
                      ))}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* 입력 */}
          <div className="flex gap-2 px-4 py-3 border-t border-gray-100 shrink-0 items-end">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addMessage();
                }
              }}
              placeholder="히스토리 추가... (Shift+Enter 줄바꿈)"
              ref={textareaRef}
              rows={1}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 text-gray-700 placeholder-gray-300 focus:outline-none resize-none overflow-hidden"
              style={{ fontSize: 16 }}
            />
            <button
              onClick={addMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center text-base disabled:opacity-30 hover:bg-slate-700 transition-all shrink-0"
            >
              ↑
            </button>
          </div>
        </div>

        {/* 우측: 과제 정보 패널 (데스크톱) */}
        <div className="hidden md:flex w-64 flex-col border-l border-gray-100 bg-gray-50 shrink-0">
          <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: squadCol }} />
          <div className="flex flex-col items-center px-5 py-6 gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: squadCol }}
            >
              {displaySquad(project.squad ?? "").slice(0, 1)}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{displaySquad(project.squad ?? "")}</p>
              <p className="text-sm font-bold text-gray-800 mt-1 leading-snug">{project.name}</p>
            </div>
          </div>
          <div className="px-4 space-y-2.5 overflow-y-auto">
            <div className="bg-white rounded-xl px-3 py-2.5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1.5">상태</p>
              <StatusChip status={project.status} date={project.date} completedDate={project.completedDate} />
            </div>
            {project.date && (
              <div className="bg-white rounded-xl px-3 py-2.5 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">목표일</p>
                <p className="text-sm font-semibold text-gray-700">{formatMMDD(project.date)}</p>
              </div>
            )}
            {project.milestone && (
              <div className="bg-white rounded-xl px-3 py-2.5 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">마일스톤</p>
                <p className="text-sm font-semibold text-gray-700">{project.milestone}</p>
              </div>
            )}
            <div className="bg-white rounded-xl px-3 py-2.5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">히스토리</p>
              <p className="text-sm font-semibold text-gray-700">{messages.length}개</p>
            </div>
          </div>
        </div>
      </div>
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
                {(["진행중", "검토중", "완료", "DROP"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      form.status === s
                        ? s === "진행중" ? "bg-blue-100 text-blue-700"
                        : s === "검토중" ? "bg-amber-100 text-amber-700"
                        : s === "완료" ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {s === "검토중" ? "REVIEW" : s}
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
  const [viewMode, setViewMode] = useState<ViewMode>("Status");
  const [squadFilter, setSquadFilter] = useState<SquadFilter>("전체");
  const [filterOption, setFilterOption] = useState<FilterOption>("전체");
  const [addedProjects, setAddedProjects] = useState<Project[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allProjects = [...unitWork, ...addedProjects];

  const shuffledTeams = useMemo(() => {
    return [...TEAM_CONFIG].sort(() => Math.random() - 0.5);
  }, [viewMode]);

  const filtered = allProjects
    .filter((p) => p.year === selectedYear)
    .filter((p) => squadFilter === "전체" || p.squad === squadFilter)
    .filter((p) => {
      if (filterOption === "진행중") return p.status === "진행중";
      if (filterOption === "검토중") return p.status === "검토중";
      return true;
    });

  const today = new Date().toISOString().slice(0, 10);

  function isPast(p: Project): boolean {
    if (p.status !== "진행중") return false;
    const d = (p.date ?? "").replace(/-00$/, "-01");
    return !!d && d <= today;
  }

  function applySort(items: Project[], forceAsc?: boolean): Project[] {
    if (forceAsc || selectedYear !== 2026) {
      return [...items].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
    }
    return [...items].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  }

  function renderContent() {
    if (filtered.length === 0) {
      return <p className="text-sm text-gray-400 text-center py-12">등록된 업무가 없습니다.</p>;
    }

    const active = filtered.filter((p) => !isPast(p) && p.status !== "완료" && p.status !== "DROP");
    const past = filtered.filter((p) => isPast(p) || p.status === "완료");
    const dropped = filtered.filter((p) => p.status === "DROP");

    if (viewMode === "Team") {
      return (
        <>
          {shuffledTeams.map(({ name: teamName, squads }) => {
            const teamProjects = filtered.filter((p) => squads.includes(p.squad ?? ""));
            if (teamProjects.length === 0) return null;
            return (
              <div key={teamName} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{teamName}</h2>
                  <span className="text-xs text-gray-400">{teamProjects.length}</span>
                </div>
                <ul className="bg-white rounded-2xl shadow-sm px-2 -mx-4">
                  {applySort(teamProjects, true).map((p) => <ProjectRow key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
                </ul>
              </div>
            );
          })}
        </>
      );
    }

    if (viewMode === "Status") {
      return (
        <>
          {active.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-blue-500" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">진행중</h3>
                <span className="text-xs text-gray-400">{active.length}</span>
              </div>
              <ul className="bg-white rounded-2xl shadow-sm px-2 -mx-4">
                {applySort(active, true).map((p) => <ProjectRow key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
              </ul>
            </div>
          )}
          {past.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-green-500" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">완료</h3>
                <span className="text-xs text-gray-400">{past.length}</span>
              </div>
              <ul className="bg-white rounded-2xl shadow-sm px-2 -mx-4">
                {applySort(past).map((p) => <ProjectRow key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
              </ul>
            </div>
          )}
          {dropped.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-gray-300" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">DROP</h3>
                <span className="text-xs text-gray-400">{dropped.length}</span>
              </div>
              <ul className="bg-white rounded-2xl shadow-sm px-2 -mx-4">
                {applySort(dropped).map((p) => <ProjectRow key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
              </ul>
            </div>
          )}
        </>
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <header className="bg-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <button
            onClick={() => router.push("/")}
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
        {selectedYear !== 2025 && (
          <div className="flex items-center justify-between mb-4 border-b border-gray-200">
            <div className="flex items-center gap-5">
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
            <button
              onClick={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
              className="pb-2.5 -mb-px transition-colors"
              style={{ color: showSearch ? "#1e293b" : "#9ca3af" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        )}

        {/* 검색창 */}
        {showSearch && (
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="과제명 또는 스쿼드 검색"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-700 placeholder-gray-300 focus:outline-none"
              style={{ fontSize: 16 }}
            />
          </div>
        )}

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

        {showSearch && searchQuery.trim() ? (
          (() => {
            const q = searchQuery.trim().toLowerCase();
            const results = allProjects.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.squad ?? "").toLowerCase().includes(q)
            );
            if (results.length === 0) {
              return <p className="text-sm text-gray-400 text-center py-12">검색 결과가 없습니다.</p>;
            }
            return (
              <ul className="bg-white rounded-2xl shadow-sm px-2 -mx-4">
                {results.map((p) => <ProjectRow key={p.id} project={p} onClick={() => setSelectedProject(p)} />)}
              </ul>
            );
          })()
        ) : renderContent()}
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

      {selectedProject && (
        <ProjectChatModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
