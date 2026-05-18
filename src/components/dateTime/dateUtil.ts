import { format } from 'date-fns';

export function createDate(dateStr: string) {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
}

export type IOSMode = 'date' | 'time' | 'datetime' | 'countdown';

export function formatDate(mode: IOSMode, date?: Date) {
    if (!date) return 'Not set';

    switch (mode) {
        case 'time':
            return format(date, 'HH:mm');
        case 'date':
            return format(date, 'EEEE, d MMMM yy');
        default:
            return format(date, 'dd/MM/yyyy HH:mm');
    }
}
