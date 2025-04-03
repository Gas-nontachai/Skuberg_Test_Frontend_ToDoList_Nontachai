export type Task = {
    task_id: string;
    text: string;
    category: string;
    completed: boolean;
    createdAt: Date | string;
    completedAt?: Date | string;
}; 