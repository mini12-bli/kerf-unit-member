import { Project } from "@/types";

const statusStyle: Record<Project["status"], string> = {
  진행중: "bg-blue-100 text-blue-700",
  완료: "bg-green-100 text-green-700",
  검토중: "bg-amber-100 text-amber-700",
  DROP: "bg-gray-100 text-gray-400",
};

const statusDot: Record<Project["status"], string> = {
  진행중: "bg-blue-500",
  완료: "bg-green-500",
  검토중: "bg-amber-400",
  DROP: "bg-gray-300",
};

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">프로젝트</h3>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[project.status]}`} />
              <span className="text-sm text-gray-700 truncate">{project.name}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyle[project.status]}`}>
              {project.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
