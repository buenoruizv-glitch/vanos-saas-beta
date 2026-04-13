import type { UserRole } from "@/types/roles";

export function homeForRole(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "empresa") return "/empresa";
  if (role === "cliente") return "/cliente";
  return "/";
}
