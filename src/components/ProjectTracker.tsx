"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProjectForm from "@/components/ProjectForm";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import type { Project } from "@/lib/types";

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status: string) {
  return `status-pill status-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

function priorityClass(priority: string) {
  return `priority-dot priority-${priority.toLowerCase()}`;
}

export default function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("dueDate");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    params.set("sort", sort);
    params.set("order", order);
    return params.toString();
  }, [search, status, priority, sort, order]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/projects?${query}`);
      if (!response.ok) {
        throw new Error("Failed to load projects.");
      }
      const data = (await response.json()) as Project[];
      setProjects(data);
    } catch {
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadProjects();
    }, 200);

    return () => clearTimeout(timer);
  }, [loadProjects]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setFormOpen(true);
  }

  function handleSaved(project: Project) {
    setProjects((prev) => {
      const exists = prev.some((item) => item.id === project.id);
      if (exists) {
        return prev.map((item) => (item.id === project.id ? project : item));
      }
      return [project, ...prev];
    });
    void loadProjects();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete project.");
      }
      setProjects((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Unable to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="brand">PulseDesk</p>
          <h1>Client Project Tracker</h1>
          <p className="lede">
            Keep every engagement visible—from first kickoff through final delivery.
          </p>
        </div>
        <button type="button" className="btn primary" onClick={openCreate}>
          New Project
        </button>
      </header>

      <section className="toolbar">
        <input
          className="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search clients, projects, or notes"
        />

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="dueDate">Sort by due date</option>
          <option value="startDate">Sort by start date</option>
          <option value="clientName">Sort by client</option>
          <option value="projectName">Sort by project</option>
          <option value="priority">Sort by priority</option>
          <option value="status">Sort by status</option>
        </select>

        <button
          type="button"
          className="btn ghost"
          onClick={() => setOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        >
          {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </section>

      {error ? <p className="banner error">{error}</p> : null}

      <section className="list-panel">
        <div className="list-meta">
          <h2>Projects</h2>
          <span>{projects.length} total</span>
        </div>

        {loading ? (
          <p className="empty">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Create your first client project to start tracking progress.</p>
            <button type="button" className="btn primary" onClick={openCreate}>
              Create Project
            </button>
          </div>
        ) : (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.id} className="project-row">
                <div className="project-main">
                  <div className="project-title-row">
                    <h3>{project.projectName}</h3>
                    <span className={statusClass(project.status)}>{project.status}</span>
                  </div>
                  <p className="client">{project.clientName}</p>
                  {project.description ? <p className="desc">{project.description}</p> : null}
                  <div className="meta-row">
                    <span className={priorityClass(project.priority)}>{project.priority} priority</span>
                    <span>
                      {formatDate(project.startDate)} → {formatDate(project.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="row-actions">
                  <button type="button" className="btn ghost" onClick={() => openEdit(project)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={deletingId === project.id}
                    onClick={() => {
                      if (window.confirm(`Delete "${project.projectName}"?`)) {
                        void handleDelete(project.id);
                      }
                    }}
                  >
                    {deletingId === project.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {formOpen ? (
        <ProjectForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      ) : null}
    </div>
  );
}
