"use client";
import { Member } from "@/types";

interface Props {
  member: Member;
  teamName: string;
  teamColor: string;
  onClick: (member: Member) => void;
}

const dotColor: Record<string, string> = {
  team_00: "#1e293b",
  team_01: "#6366f1",
  team_02: "#10b981",
  team_03: "#f59e0b",
  team_04: "#ef4444",
};

function isNewbie(joinedAt?: string): boolean {
  if (!joinedAt) return false;
  const diff = Date.now() - new Date(joinedAt).getTime();
  return diff >= 0 && diff < 100 * 24 * 60 * 60 * 1000;
}

function isIncoming(joinedAt?: string): boolean {
  if (!joinedAt) return false;
  return new Date(joinedAt).getTime() > Date.now();
}

function formatJoinDate(joinedAt: string): string {
  const d = new Date(joinedAt);
  return `${d.getMonth() + 1}.${d.getDate()} 입사예정`;
}

export default function MemberCard({ member, teamColor, onClick }: Props) {
  const isLeader = member.role === "leader";
  const newbie = isNewbie(member.joinedAt);
  const incoming = isIncoming(member.joinedAt);
  const dot = dotColor[member.teamId] ?? "#6366f1";
  const hasPhoto = !!member.avatarUrl;

  const folderBg = incoming
    ? "linear-gradient(145deg, #cbd5e1dd, #94a3b8aa)"
    : `linear-gradient(145deg, ${teamColor}dd, ${teamColor}aa)`;

  return (
    <div
      onClick={() => onClick(member)}
      className="cursor-pointer flex flex-col items-center group select-none"
    >
      {/* 폴더 아이콘 */}
      <div className={`relative w-full aspect-[4/3] ${incoming ? "opacity-60" : ""}`}>
        {/* 폴더 탭 */}
        <div
          className="absolute top-0 left-0 w-2/5 h-[14%] rounded-t-lg"
          style={{ background: incoming ? "#94a3b8" : teamColor, filter: "brightness(0.85)" }}
        />
        {/* 폴더 몸통 */}
        <div
          className="absolute bottom-0 left-0 right-0 top-[10%] rounded-xl shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1"
          style={{ background: folderBg }}
        >
          <div className="absolute inset-x-3 top-2 h-1/3 rounded-lg bg-white/20" />

          {/* 뱃지 */}
          {isLeader && <div className="absolute top-2 right-2 text-base drop-shadow z-10">👑</div>}

          {incoming && <div className="absolute top-2 right-2 text-base drop-shadow z-10">📅</div>}

          {/* 아바타 이니셜 (사진 없을 때) */}
          {!hasPhoto && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold bg-white/25 text-white shadow-inner">
                {member.name[0]}
              </div>
            </div>
          )}

          {/* 아바타 원 (사진 있을 때 뒤에 은은하게) */}
          {hasPhoto && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/15" />
            </div>
          )}
        </div>

        {/* 사진 (있을 때만) — 폴더 중앙에 흑백으로 */}
        {hasPhoto && (
          <img
            src={member.avatarUrl}
            alt={member.name}
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
        )}
      </div>

      {/* 이름 + 도트 */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: incoming ? "#94a3b8" : dot }} />
        <span className={`text-sm font-medium truncate max-w-[80px] ${incoming ? "text-gray-400" : "text-gray-700"}`}>
          {member.name}{newbie && !isLeader ? " 🌱" : ""}
        </span>
      </div>

      {incoming && member.joinedAt ? (
        <span className="text-xs text-indigo-400 mt-0.5 font-medium">{formatJoinDate(member.joinedAt)}</span>
      ) : member.position ? (
        <span className="text-xs text-gray-400 mt-0.5">{member.position}</span>
      ) : null}
    </div>
  );
}
