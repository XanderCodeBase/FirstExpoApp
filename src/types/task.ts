export type Task = {
    id: string;
    title: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
    start_date?: string;
    life_domains?: string; // comma-separated or JSON string
    priority: number;
    position?: number;
    user_id: string;
    created_at: string;
    updated_at: string;
};
