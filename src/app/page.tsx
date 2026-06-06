"use client";
import { useState } from "react";
import teamsData from "@/data/teams.json";
import { Team, Member } from "@/types";
import TeamSection from "@/components/TeamSection";
import ProfileModal from "@/components/ProfileModal";

const teams = teamsData as Team[];

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState<{ member: Member; teamName: string } | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">TeamSync</h1>
            <p className="text-xs text-gray-400 mt-0.5">사내 구성원 디렉토리</p>
          </div>
          <div className="text-sm text-gray-400">
            총 <span className="font-semibold text-gray-700">{teams.reduce((acc, t) => acc + t.members.length, 0)}명</span>
            {" · "}
            <span className="font-semibold text-gray-700">{teams.length}</span>개 팀
          </div>
        </div>
      </header>

      {/* 팀 섹션 목록 */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {teams.map((team) => (
          <TeamSection
            key={team.id}
            team={team}
            onMemberClick={(member, teamName) => setSelectedMember({ member, teamName })}
          />
        ))}
      </div>

      {/* 프로필 모달 */}
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
