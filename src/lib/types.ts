export type Project = {
  id: string;
  clientName: string;
  projectName: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFormData = {
  clientName: string;
  projectName: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string>;
};
