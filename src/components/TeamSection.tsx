"use client";
import { Team, Member } from "@/types";
import MemberCard from "./MemberCard";

interface Props {
  team: Team;
  teamColor: string;
  onMemberClick: (member: Member, teamName: string) => void;
}

export default function TeamSection({ team, teamColor, onMemberClick }: Props) {
  return (
    <section id={team.id} className="mb-14 scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColor }} />
        <h2 className="text-lg font-bold text-gray-800">{team.name}</h2>
        <span className="text-sm text-gray-400">{team.members.length}명</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
        {team.members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            teamName={team.name}
            teamColor={teamColor}
            onClick={(member) => onMemberClick(member, team.name)}
          />
        ))}
      </div>
    </section>
  );
}
