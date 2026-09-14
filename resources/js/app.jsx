import React from 'react';
import { createRoot } from 'react-dom/client';
import ProjectTracker from './components/ProjectTracker';

const el = document.getElementById('app');

if (el) {
    createRoot(el).render(
        <React.StrictMode>
            <ProjectTracker />
        </React.StrictMode>,
    );
}
