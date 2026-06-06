"use client";
import { Member } from "@/types";

interface Props {
  member: Member;
  teamName: string;
  onClick: (member: Member) => void;
}

export default function MemberCard({ member, teamName, onClick }: Props) {
  const isLeader = member.role === "leader";

  return (
    <div
      onClick={() => onClick(member)}
      className={`cursor-pointer rounded-2xl p-4 transition-all hover:shadow-lg hover:-translate-y-0.5
        ${isLeader
          ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md col-span-full"
          : "bg-white border border-gray-100 text-gray-800 shadow-sm"
        }`}
    >
      <div className={`flex items-center gap-3 ${isLeader ? "justify-start" : "flex-col text-center"}`}>
        {/* 아바타 */}
        <div className={`rounded-full flex items-center justify-center font-bold shrink-0
          ${isLeader
            ? "w-14 h-14 text-xl bg-white/20 text-white"
            : "w-12 h-12 text-base bg-indigo-50 text-indigo-600"
          }`}>
          {member.name[0]}
        </div>

        <div className={isLeader ? "flex-1" : ""}>
          <div className="flex items-center gap-2 justify-center">
            {isLeader && <span className="text-lg">👑</span>}
            <p className={`font-bold ${isLeader ? "text-lg" : "text-sm"}`}>{member.name}</p>
          </div>
          <p className={`text-sm mt-0.5 ${isLeader ? "text-indigo-200" : "text-gray-500"}`}>
            {member.position}
          </p>
          {isLeader && (
            <span className="mt-2 inline-block text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
              {teamName}
            </span>
          )}
        </div>

        {/* 프로젝트 수 배지 (팀원 카드) */}
        {!isLeader && member.projects.length > 0 && (
          <div className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
            프로젝트 {member.projects.length}건
          </div>
        )}
      </div>
    </div>
  );
}
