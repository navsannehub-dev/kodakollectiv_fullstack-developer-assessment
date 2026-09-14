import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProject } from "@/lib/serialize";
import { formatValidationErrors, projectSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(serializeProject(project));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatValidationErrors(parsed.error), {
      status: 422,
    });
  }

  const data = parsed.data;

  const project = await prisma.project.update({
    where: { id },
    data: {
      clientName: data.clientName,
      projectName: data.projectName,
      description: data.description ?? "",
      status: data.status,
      priority: data.priority,
      startDate: new Date(data.startDate),
      dueDate: new Date(data.dueDate),
    },
  });

  return NextResponse.json(serializeProject(project));
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ message: "Project deleted successfully." });
}
