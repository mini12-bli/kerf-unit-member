export interface Task {
  id: string;
  description: string;
  tag?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "검토중" | "진행중" | "완료" | "DROP";
  year?: number;
  team?: string;
  squad?: string;
  milestone?: string;
  expectedMonth?: string;
  completedDate?: string;
  date?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: "휴가" | "출장" | "미팅" | "성과" | "기타";
}

export interface Member {
  id: string;
  teamId: string;
  name: string;
  role: "leader" | "member";
  position: string;
  joinedAt?: string;
  avatarUrl?: string;
  tasks: Task[];
  projects: Project[];
  events: Event[];
}

export interface Team {
  id: string;
  name: string;
  members: Member[];
}
