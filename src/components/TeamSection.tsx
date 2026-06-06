"use client";
import { Team, Member } from "@/types";
import MemberCard from "./MemberCard";

interface Props {
  team: Team;
  onMemberClick: (member: Member, teamName: string) => void;
}

export default function TeamSection({ team, onMemberClick }: Props) {
  const leader = team.members.find((m) => m.role === "leader");
  const members = team.members.filter((m) => m.role === "member");

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
        <span className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {team.members.length}명
        </span>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {/* 팀장 카드: col-span-full로 전 너비 */}
        {leader && (
          <MemberCard
            member={leader}
            teamName={team.name}
            onClick={(m) => onMemberClick(m, team.name)}
          />
        )}
        {/* 팀원 카드 */}
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            teamName={team.name}
            onClick={(member) => onMemberClick(member, team.name)}
          />
        ))}
      </div>
    </section>
  );
}
