export function createDate(dateStr: string) {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
}

export function formatDate(date?: Date) {
    return date
        ? date.toLocaleString('nl-NL', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
          })
        : 'Not set';
}
