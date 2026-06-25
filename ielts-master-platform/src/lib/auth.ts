import type { Role, User } from "@/lib/types";

export const demoUsers: Record<Role, User> = {
  student: {
    id: "student_demo",
    name: "Demo Student",
    email: "student@ieltsmaster.local",
    role: "student",
    avatar: "DS",
  },
  teacher: {
    id: "teacher_demo",
    name: "Demo Teacher",
    email: "teacher@ieltsmaster.local",
    role: "teacher",
    avatar: "DT",
  },
  admin: {
    id: "admin_demo",
    name: "Demo Admin",
    email: "admin@ieltsmaster.local",
    role: "admin",
    avatar: "DA",
  },
};

export function canAccess(userRole: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(userRole);
}

export function getDemoUser(role: Role = "student") {
  return demoUsers[role];
}
