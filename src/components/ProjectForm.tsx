"use client";

import { FormEvent, useEffect, useState } from "react";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import type { ApiError, Project, ProjectFormData } from "@/lib/types";

const emptyForm: ProjectFormData = {
  clientName: "",
  projectName: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  startDate: "",
  dueDate: "",
};

type ProjectFormProps = {
  initial?: Project | null;
  onClose: () => void;
  onSaved: (project: Project) => void;
};

export default function ProjectForm({ initial, onClose, onSaved }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        clientName: initial.clientName,
        projectName: initial.projectName,
        description: initial.description,
        status: initial.status,
        priority: initial.priority,
        startDate: initial.startDate,
        dueDate: initial.dueDate,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setFormError("");
  }, [initial]);

  function updateField<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setErrors({});

    const localErrors: Record<string, string> = {};

    if (!form.clientName.trim()) {
      localErrors.clientName = "Client Name is required.";
    }
    if (!form.projectName.trim()) {
      localErrors.projectName = "Project Name is required.";
    }
    if (!STATUSES.includes(form.status as (typeof STATUSES)[number])) {
      localErrors.status = `Status must be one of: ${STATUSES.join(", ")}.`;
    }
    if (!PRIORITIES.includes(form.priority as (typeof PRIORITIES)[number])) {
      localErrors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
    }
    if (!form.startDate) {
      localErrors.startDate = "Start Date is required.";
    }
    if (!form.dueDate) {
      localErrors.dueDate = "Due Date is required.";
    }
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
      localErrors.dueDate = "Due Date cannot be earlier than Start Date.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(initial ? `/projects/${initial.id}` : "/projects", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        const apiError = payload as ApiError;
        setErrors(apiError.errors ?? {});
        setFormError(apiError.message || "Unable to save project.");
        return;
      }

      onSaved(payload as Project);
      onClose();
    } catch {
      setFormError("Unable to reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{initial ? "Edit Project" : "New Project"}</p>
            <h2>{initial ? "Update details" : "Create a project"}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {formError ? <p className="banner error">{formError}</p> : null}

          <label>
            <span>Client Name</span>
            <input
              value={form.clientName}
              onChange={(event) => updateField("clientName", event.target.value)}
              placeholder="Acme Digital"
            />
            {errors.clientName ? <em>{errors.clientName}</em> : null}
          </label>

          <label>
            <span>Project Name</span>
            <input
              value={form.projectName}
              onChange={(event) => updateField("projectName", event.target.value)}
              placeholder="Website redesign"
            />
            {errors.projectName ? <em>{errors.projectName}</em> : null}
          </label>

          <label>
            <span>Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Scope, goals, and notes"
            />
          </label>

          <div className="form-row">
            <label>
              <span>Status</span>
              <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status ? <em>{errors.status}</em> : null}
            </label>

            <label>
              <span>Priority</span>
              <select value={form.priority} onChange={(event) => updateField("priority", event.target.value)}>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              {errors.priority ? <em>{errors.priority}</em> : null}
            </label>
          </div>

          <div className="form-row">
            <label>
              <span>Start Date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
              {errors.startDate ? <em>{errors.startDate}</em> : null}
            </label>

            <label>
              <span>Due Date</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => updateField("dueDate", event.target.value)}
              />
              {errors.dueDate ? <em>{errors.dueDate}</em> : null}
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "Saving..." : initial ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
