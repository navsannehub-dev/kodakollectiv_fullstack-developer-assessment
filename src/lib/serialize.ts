import type { Project } from "@prisma/client";

export function serializeProject(project: Project) {
  return {
    id: project.id,
    clientName: project.clientName,
    projectName: project.projectName,
    description: project.description,
    status: project.status,
    priority: project.priority,
    startDate: project.startDate.toISOString().slice(0, 10),
    dueDate: project.dueDate.toISOString().slice(0, 10),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
