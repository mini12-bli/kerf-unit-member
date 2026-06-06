"use client";
import { Member } from "@/types";
import TaskList from "./TaskList";
import ProjectList from "./ProjectList";
import EventTimeline from "./EventTimeline";
import { useEffect, useState } from "react";

interface Props {
  member: Member;
  teamName: string;
  onClose: () => void;
}

const teamColor: Record<string, string> = {
  team_00: "#1e293b",
  team_01: "#6366f1",
  team_02: "#10b981",
  team_03: "#f59e0b",
  team_04: "#ef4444",
};

export default function ProfileModal({ member, teamName, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const color = teamColor[member.teamId] ?? "#6366f1";

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* 배경 딤 */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* 바텀 시트 */}
      <div
        className={`relative w-full rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out max-h-[85vh] ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* 헤더 (핸들 포함, 색상 통일) */}
        <div className="shrink-0 px-6 pt-4 pb-5 rounded-t-3xl" style={{ backgroundColor: color }}>
          {/* 핸들 바 */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-white/40" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{teamName}</span>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {member.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {member.role === "leader" && <span className="text-base">👑</span>}
                <h2 className="text-xl font-bold text-white">{member.name}</h2>
              </div>
              {member.position && (
                <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{member.position}</p>
              )}
              <span className="mt-2 inline-block text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                {member.role === "leader" ? "팀장" : "팀원"}
              </span>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {member.tasks.length > 0 && (
            <>
              <TaskList tasks={member.tasks} />
              <div className="border-t border-gray-100" />
            </>
          )}
          {member.projects.length > 0 && (
            <>
              <ProjectList projects={member.projects} />
              <div className="border-t border-gray-100" />
            </>
          )}
          {member.events.length > 0 ? (
            <EventTimeline events={member.events} />
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">등록된 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
