import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeProject } from "@/lib/serialize";
import { formatValidationErrors, projectSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const priority = searchParams.get("priority")?.trim() ?? "";
  const sort = searchParams.get("sort")?.trim() ?? "dueDate";
  const order = searchParams.get("order")?.trim() === "desc" ? "desc" : "asc";

  const where: Prisma.ProjectWhereInput = {};

  if (search) {
    where.OR = [
      { clientName: { contains: search } },
      { projectName: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  const allowedSort = ["dueDate", "startDate", "clientName", "projectName", "priority", "status", "createdAt"];
  const sortField = allowedSort.includes(sort) ? sort : "dueDate";

  const projects = await prisma.project.findMany({
    where,
    orderBy: { [sortField]: order },
  });

  return NextResponse.json(projects.map(serializeProject));
}

export async function POST(request: NextRequest) {
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

  const project = await prisma.project.create({
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

  return NextResponse.json(serializeProject(project), { status: 201 });
}
