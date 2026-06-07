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
              <div className="cursor-pointer group" style={{ width: "160px" }} onClick={() => setSelectedMember({ member: leader, teamName: unitTeam?.name ?? "" })}>
                <div className="relative" style={{ width: "160px", height: "120px" }}>
                  {/* 폴더 탭 */}
                  <div className="absolute top-0 left-0 w-2/5 h-[13%] rounded-t-lg bg-slate-700" style={{ zIndex: 1 }} />
                  {/* 폴더 몸통 */}
                  <div className="absolute bottom-0 left-0 right-0 top-[9%] rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:-translate-y-0.5 transition-all bg-gradient-to-br from-slate-800 to-slate-600" style={{ zIndex: 1 }}>
                    <div className="absolute inset-x-4 top-3 h-[30%] rounded-xl bg-white/10" />
                    <div className="absolute top-3 right-4 text-2xl drop-shadow-lg">⭐</div>
                    {/* 아바타 원 (인물 뒤 흐릿하게) */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "10px" }}>
                      <div className="w-14 h-14 rounded-full bg-white/15" />
                    </div>
                  </div>
                  {/* 인물 사진 — 폴더 중앙에 크게 */}
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
    </main>
  );
}
