import { z } from "zod";
import { PRIORITIES, STATUSES } from "./constants";

export const projectSchema = z
  .object({
    clientName: z
      .string({ error: "Client Name is required." })
      .trim()
      .min(1, "Client Name is required."),
    projectName: z
      .string({ error: "Project Name is required." })
      .trim()
      .min(1, "Project Name is required."),
    description: z.string().trim().optional().default(""),
    status: z.enum(STATUSES, {
      error: `Status must be one of: ${STATUSES.join(", ")}.`,
    }),
    priority: z.enum(PRIORITIES, {
      error: `Priority must be one of: ${PRIORITIES.join(", ")}.`,
    }),
    startDate: z
      .string({ error: "Start Date is required." })
      .min(1, "Start Date is required.")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Start Date must be a valid date.",
      }),
    dueDate: z
      .string({ error: "Due Date is required." })
      .min(1, "Due Date is required.")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Due Date must be a valid date.",
      }),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.dueDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["dueDate"],
        message: "Due Date cannot be earlier than Start Date.",
      });
    }
  });

export type ProjectInput = z.infer<typeof projectSchema>;

export function formatValidationErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return {
    message: "Validation failed.",
    errors: fieldErrors,
  };
}
