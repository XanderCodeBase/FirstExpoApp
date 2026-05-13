export type Task = {
    id: string;
    title: string;
    description: string | null;
    is_completed: boolean | null;
    due_date: string | null;
    start_date: string | null;
    life_domains: string | null;
    priority: number | null;
    position: number | null;
    user_id: string;
    created_at: string | null;
    updated_at: string | null;
};
