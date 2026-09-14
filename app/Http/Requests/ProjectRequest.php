<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'client_name' => $this->input('client_name', $this->input('clientName')),
            'project_name' => $this->input('project_name', $this->input('projectName')),
            'description' => $this->input('description', ''),
            'status' => $this->input('status'),
            'priority' => $this->input('priority'),
            'start_date' => $this->input('start_date', $this->input('startDate')),
            'due_date' => $this->input('due_date', $this->input('dueDate')),
        ]);
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'project_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:Planning,In Progress,On Hold,Completed'],
            'priority' => ['required', 'in:Low,Medium,High'],
            'start_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_name.required' => 'Client Name is required.',
            'project_name.required' => 'Project Name is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: Planning, In Progress, On Hold, Completed.',
            'priority.required' => 'Priority is required.',
            'priority.in' => 'Priority must be one of: Low, Medium, High.',
            'start_date.required' => 'Start Date is required.',
            'start_date.date' => 'Start Date must be a valid date.',
            'due_date.required' => 'Due Date is required.',
            'due_date.date' => 'Due Date must be a valid date.',
            'due_date.after_or_equal' => 'Due Date cannot be earlier than Start Date.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        $errors = [];

        foreach ($validator->errors()->messages() as $field => $messages) {
            $key = match ($field) {
                'client_name' => 'clientName',
                'project_name' => 'projectName',
                'start_date' => 'startDate',
                'due_date' => 'dueDate',
                default => $field,
            };
            $errors[$key] = $messages[0];
        }

        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $errors,
        ], 422));
    }
}
