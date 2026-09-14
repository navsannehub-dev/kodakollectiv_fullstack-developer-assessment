import { useEffect, useState } from 'react';
import { PRIORITIES, STATUSES, api } from '../lib';

const emptyForm = {
    clientName: '',
    projectName: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
};

export default function ProjectForm({ initial, onClose, onSaved }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initial) {
            setForm({
                clientName: initial.clientName,
                projectName: initial.projectName,
                description: initial.description ?? '',
                status: initial.status,
                priority: initial.priority,
                startDate: initial.startDate,
                dueDate: initial.dueDate,
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
        setFormError('');
    }, [initial]);

    function updateField(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setFormError('');
        setErrors({});

        const localErrors = {};

        if (!form.clientName.trim()) {
            localErrors.clientName = 'Client Name is required.';
        }
        if (!form.projectName.trim()) {
            localErrors.projectName = 'Project Name is required.';
        }
        if (!STATUSES.includes(form.status)) {
            localErrors.status = `Status must be one of: ${STATUSES.join(', ')}.`;
        }
        if (!PRIORITIES.includes(form.priority)) {
            localErrors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}.`;
        }
        if (!form.startDate) {
            localErrors.startDate = 'Start Date is required.';
        }
        if (!form.dueDate) {
            localErrors.dueDate = 'Due Date is required.';
        }
        if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
            localErrors.dueDate = 'Due Date cannot be earlier than Start Date.';
        }

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            setSubmitting(false);
            return;
        }

        try {
            const project = await api(initial ? `/projects/${initial.id}` : '/projects', {
                method: initial ? 'PUT' : 'POST',
                body: JSON.stringify(form),
            });
            onSaved(project);
            onClose();
        } catch (error) {
            setErrors(error.payload?.errors ?? {});
            setFormError(error.message || 'Unable to save project.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="drawer-backdrop" onClick={onClose}>
            <aside className="drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
                <div className="drawer-head">
                    <div>
                        <p className="eyebrow">{initial ? 'Edit Project' : 'New Project'}</p>
                        <h2>{initial ? 'Update details' : 'Create a project'}</h2>
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
                            onChange={(event) => updateField('clientName', event.target.value)}
                            placeholder="Acme Digital"
                        />
                        {errors.clientName ? <em>{errors.clientName}</em> : null}
                    </label>

                    <label>
                        <span>Project Name</span>
                        <input
                            value={form.projectName}
                            onChange={(event) => updateField('projectName', event.target.value)}
                            placeholder="Website redesign"
                        />
                        {errors.projectName ? <em>{errors.projectName}</em> : null}
                    </label>

                    <label>
                        <span>Description</span>
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(event) => updateField('description', event.target.value)}
                            placeholder="Scope, goals, and notes"
                        />
                    </label>

                    <div className="form-row">
                        <label>
                            <span>Status</span>
                            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
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
                            <select value={form.priority} onChange={(event) => updateField('priority', event.target.value)}>
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
                                onChange={(event) => updateField('startDate', event.target.value)}
                            />
                            {errors.startDate ? <em>{errors.startDate}</em> : null}
                        </label>

                        <label>
                            <span>Due Date</span>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(event) => updateField('dueDate', event.target.value)}
                            />
                            {errors.dueDate ? <em>{errors.dueDate}</em> : null}
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn primary" disabled={submitting}>
                            {submitting ? 'Saving...' : initial ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    );
}
