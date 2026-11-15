import { AppDataSource } from "../data-source";
import { TaskEntity } from "../entities/Task";
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskQuery,
    TaskListResult,
    TaskStats
} from "../types/task.types";

function toTask(entity: TaskEntity): Task {
    return {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        status: entity.status,
        priority: entity.priority,
        ...(entity.dueDate
            ? { dueDate: entity.dueDate.toISOString().slice(0, 10) }
            : {}),
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString()
    };
}

export async function getAllTasks(query: TaskQuery): Promise<TaskListResult> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || "createdAt";
    const order = query.order === "asc" ? "ASC" : "DESC";

    const queryBuilder = repository.createQueryBuilder("task");

    if (query.status) {
        queryBuilder.andWhere("task.status = :status", {
            status: query.status
        });
    }

    if (query.priority) {
        queryBuilder.andWhere("task.priority = :priority", {
            priority: query.priority
        });
    }

    if (query.search) {
        queryBuilder.andWhere(
            "(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)",
            { search: `%${query.search.toLowerCase()}%` }
        );
    }

    if (sortBy === "priority") {
        queryBuilder.orderBy(
            "CASE task.priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END",
            order
        );
    } else if (sortBy === "title") {
        queryBuilder.orderBy("task.title", order);
    } else if (sortBy === "dueDate") {
        queryBuilder.orderBy("task.dueDate IS NULL", order);
        queryBuilder.addOrderBy("task.dueDate", order);
    } else {
        queryBuilder.orderBy("task.createdAt", order);
    }

    queryBuilder.addOrderBy("task.id", "ASC");
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return {
        tasks: entities.map(toTask),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function getTaskById(id: string): Promise<Task | null> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const task = await repository.findOneBy({ id });

    return task ? toTask(task) : null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const task = repository.create({
        title: input.title.trim(),
        description: input.description?.trim() ?? "",
        status: input.status ?? "pending",
        priority: input.priority ?? "medium",
        dueDate: input.dueDate ? new Date(input.dueDate) : null
    });

    const savedTask = await repository.save(task);

    return toTask(savedTask);
}

export async function updateTask(
    id: string,
    input: UpdateTaskInput
): Promise<Task | null> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const task = await repository.findOneBy({ id });

    if (!task) {
        return null;
    }

    if (input.title !== undefined) {
        task.title = input.title.trim();
    }

    if (input.description !== undefined) {
        task.description = input.description.trim();
    }

    if (input.status !== undefined) {
        task.status = input.status;
    }

    if (input.priority !== undefined) {
        task.priority = input.priority;
    }

    if (input.dueDate !== undefined) {
        task.dueDate = input.dueDate === null
            ? null
            : new Date(input.dueDate);
    }

    const savedTask = await repository.save(task);

    return toTask(savedTask);
}

export async function updateTaskStatus(
    id: string,
    status: Task["status"]
): Promise<Task | null> {
    return updateTask(id, { status });
}

export async function deleteTask(id: string): Promise<boolean> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const result = await repository.delete({ id });

    return (result.affected ?? 0) > 0;
}

export async function getTaskStats(): Promise<TaskStats> {
    const repository = AppDataSource.getRepository(TaskEntity);

    const [total, statusRows, priorityRows] = await Promise.all([
        repository.count(),
        repository
            .createQueryBuilder("task")
            .select("task.status", "status")
            .addSelect("COUNT(*)", "count")
            .groupBy("task.status")
            .getRawMany<{ status: Task["status"]; count: string }>(),
        repository
            .createQueryBuilder("task")
            .select("task.priority", "priority")
            .addSelect("COUNT(*)", "count")
            .groupBy("task.priority")
            .getRawMany<{ priority: Task["priority"]; count: string }>()
    ]);

    const stats: TaskStats = {
        total,
        byStatus: {
            pending: 0,
            "in-progress": 0,
            completed: 0
        },
        byPriority: {
            low: 0,
            medium: 0,
            high: 0
        }
    };

    for (const row of statusRows) {
        stats.byStatus[row.status] = Number(row.count);
    }

    for (const row of priorityRows) {
        stats.byPriority[row.priority] = Number(row.count);
    }

    return stats;
}
