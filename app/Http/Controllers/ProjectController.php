<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Project::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search) {
                $builder
                    ->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $allowedSort = [
            'dueDate' => 'due_date',
            'startDate' => 'start_date',
            'clientName' => 'client_name',
            'projectName' => 'project_name',
            'priority' => 'priority',
            'status' => 'status',
            'createdAt' => 'created_at',
            'due_date' => 'due_date',
            'start_date' => 'start_date',
            'client_name' => 'client_name',
            'project_name' => 'project_name',
            'created_at' => 'created_at',
        ];

        $sortInput = (string) $request->query('sort', 'dueDate');
        $sort = $allowedSort[$sortInput] ?? 'due_date';
        $order = $request->query('order') === 'desc' ? 'desc' : 'asc';

        $projects = $query->orderBy($sort, $order)->get();

        return ProjectResource::collection($projects);
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $project = Project::create([
            'client_name' => $request->validated('client_name'),
            'project_name' => $request->validated('project_name'),
            'description' => $request->validated('description') ?? '',
            'status' => $request->validated('status'),
            'priority' => $request->validated('priority'),
            'start_date' => $request->validated('start_date'),
            'due_date' => $request->validated('due_date'),
        ]);

        return (new ProjectResource($project))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Project $project): ProjectResource
    {
        return new ProjectResource($project);
    }

    public function update(ProjectRequest $request, Project $project): ProjectResource
    {
        $project->update([
            'client_name' => $request->validated('client_name'),
            'project_name' => $request->validated('project_name'),
            'description' => $request->validated('description') ?? '',
            'status' => $request->validated('status'),
            'priority' => $request->validated('priority'),
            'start_date' => $request->validated('start_date'),
            'due_date' => $request->validated('due_date'),
        ]);

        return new ProjectResource($project);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
