"use client";
import { Member } from "@/types";
import TaskList from "./TaskList";
import ProjectList from "./ProjectList";
import EventTimeline from "./EventTimeline";
import { useEffect } from "react";

interface Props {
  member: Member;
  teamName: string;
  onClose: () => void;
}

export default function ProfileModal({ member, teamName, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 모달 패널 */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {member.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {member.role === "leader" && <span>👑</span>}
                <h2 className="text-xl font-bold">{member.name}</h2>
              </div>
              <p className="text-indigo-200 text-sm mt-0.5">{member.position}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{teamName}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {member.role === "leader" ? "팀장" : "팀원"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <TaskList tasks={member.tasks} />
          <div className="border-t border-gray-100" />
          <ProjectList projects={member.projects} />
          <div className="border-t border-gray-100" />
          <EventTimeline events={member.events} />
        </div>
      </div>
    </div>
  );
}
