import { Task } from "@/types";

const tagColors: Record<string, string> = {
  전략: "bg-purple-100 text-purple-700",
  보고: "bg-blue-100 text-blue-700",
  리서치: "bg-cyan-100 text-cyan-700",
  분석: "bg-teal-100 text-teal-700",
  아키텍처: "bg-orange-100 text-orange-700",
  관리: "bg-yellow-100 text-yellow-700",
  백엔드: "bg-green-100 text-green-700",
  프론트엔드: "bg-pink-100 text-pink-700",
  데이터: "bg-indigo-100 text-indigo-700",
  QA: "bg-red-100 text-red-700",
  모바일: "bg-lime-100 text-lime-700",
  브랜드: "bg-fuchsia-100 text-fuchsia-700",
  시스템: "bg-violet-100 text-violet-700",
  UX: "bg-sky-100 text-sky-700",
  UI: "bg-rose-100 text-rose-700",
  그래픽: "bg-amber-100 text-amber-700",
  패키지: "bg-emerald-100 text-emerald-700",
  SNS: "bg-blue-100 text-blue-700",
  광고: "bg-orange-100 text-orange-700",
  CRM: "bg-teal-100 text-teal-700",
  PR: "bg-pink-100 text-pink-700",
  프로세스: "bg-slate-100 text-slate-700",
  계약: "bg-gray-100 text-gray-700",
  물류: "bg-yellow-100 text-yellow-700",
  CS: "bg-green-100 text-green-700",
  총무: "bg-purple-100 text-purple-700",
  법무: "bg-red-100 text-red-700",
  지원: "bg-cyan-100 text-cyan-700",
  구매: "bg-lime-100 text-lime-700",
  IT: "bg-indigo-100 text-indigo-700",
  인사: "bg-rose-100 text-rose-700",
};

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">주요 업무</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-2">
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-700 flex-1">{task.description}</span>
            {task.tag && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${tagColors[task.tag] ?? "bg-gray-100 text-gray-600"}`}>
                {task.tag}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
