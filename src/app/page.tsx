"use client";
import { useState } from "react";
import teamsData from "@/data/teams.json";
import { Team, Member } from "@/types";
import TeamSection from "@/components/TeamSection";
import ProfileModal from "@/components/ProfileModal";

const teams = teamsData as Team[];

const teamColors: Record<string, string> = {
  team_00: "#1e293b",
  team_01: "#6366f1",
  team_02: "#10b981",
  team_03: "#f59e0b",
  team_04: "#ef4444",
};

function scrollToTeam(teamId: string) {
  const el = document.getElementById(teamId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState<{ member: Member; teamName: string } | null>(null);
  const [workFolderOpen, setWorkFolderOpen] = useState(false);

  const totalMembers = teams.reduce((acc, t) => acc + t.members.length, 0);
  const teamCount = teams.length - 1;

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">C</div>
            <h1 className="text-base font-bold text-gray-900">커머스프로덕트유닛</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* 페이지 타이틀 + 통계 */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">유닛 구성</h2>
            <span className="text-sm text-gray-400">총 {totalMembers}명 · {teamCount}개 팀</span>
          </div>
        </div>

        {/* 팀 인덱스 — 클릭 시 해당 섹션으로 스크롤 */}
        <div className="flex items-center gap-5 mb-10">
          {teams.slice(1).map((team) => (
            <button
              key={team.id}
              onClick={() => scrollToTeam(team.id)}
              className="flex items-center gap-1.5 group"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                style={{ backgroundColor: teamColors[team.id] }}
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-800 group-hover:font-medium transition-colors">
                {team.name}
              </span>
            </button>
          ))}
        </div>

        {/* 유닛장 단독 섹션 */}
        {(() => {
          const unitTeam = teams.find((t) => t.id === "team_00");
          const leader = unitTeam?.members[0];
          if (!leader) return null;
          return (
            <div className="mb-12 pb-10 border-b-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 rounded-full bg-slate-800" />
                <h3 className="text-lg font-bold text-gray-800">{unitTeam?.name}</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                {/* 유닛장 카드 */}
                <div className="cursor-pointer group" onClick={() => setSelectedMember({ member: leader, teamName: unitTeam?.name ?? "" })}>
                  <div className="relative w-full aspect-[4/3]">
                    <div className="absolute top-0 left-0 w-2/5 h-[14%] rounded-t-lg bg-slate-700" style={{ zIndex: 1 }} />
                    <div className="absolute bottom-0 left-0 right-0 top-[10%] rounded-xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all bg-gradient-to-br from-slate-800 to-slate-600" style={{ zIndex: 1 }}>
                      <div className="absolute inset-x-3 top-2 h-1/3 rounded-lg bg-white/20" />
                      <div className="absolute top-2 right-2 text-base drop-shadow z-10">⭐</div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/15" />
                      </div>
                    </div>
                    <img
                      src="/mijung-nobg.png"
                      alt="김미정"
                      className="absolute object-contain pointer-events-none group-hover:-translate-y-1 transition-transform duration-300"
                      style={{
                        height: "78%",
                        bottom: "0px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 2,
                        filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                    <span className="text-sm text-gray-700 font-medium">{leader.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-0.5 block">{leader.position}</span>
                </div>

                {/* 업무 폴더 */}
                <div className="cursor-pointer group" onClick={() => setWorkFolderOpen(true)}>
                  <div className="relative w-full aspect-[4/3]">
                    <div className="absolute top-0 left-0 w-2/5 h-[14%] rounded-t-lg bg-indigo-700" style={{ zIndex: 1 }} />
                    <div className="absolute bottom-0 left-0 right-0 top-[10%] rounded-xl shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all bg-gradient-to-br from-indigo-600 to-indigo-400" style={{ zIndex: 1 }}>
                      <div className="absolute inset-x-3 top-2 h-1/3 rounded-lg bg-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl drop-shadow z-10">📋</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-sm text-gray-700 font-medium">업무</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 4개 팀 */}
        {teams.filter((t) => t.id !== "team_00").map((team) => (
          <TeamSection
            key={team.id}
            team={team}
            teamColor={teamColors[team.id] ?? "#6366f1"}
            onMemberClick={(member, teamName) => setSelectedMember({ member, teamName })}
          />
        ))}
      </div>

      {selectedMember && (
        <ProfileModal
          member={selectedMember.member}
          teamName={selectedMember.teamName}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {workFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setWorkFolderOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full rounded-t-3xl shadow-2xl bg-white flex flex-col h-[calc(100vh-64px)]" onClick={(e) => e.stopPropagation()}>
            <div className="shrink-0 px-6 pt-4 pb-5 rounded-t-3xl bg-indigo-600">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/40" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-white/70">커머스프로덕트 유닛</span>
                <button onClick={() => setWorkFolderOpen(false)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors text-sm">✕</button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">📋</div>
                <h2 className="text-xl font-bold text-white">업무</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white flex items-center justify-center">
              <p className="text-sm text-gray-400">등록된 업무가 없습니다.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
