
export function fileTypeBelongTo(file: File): boolean {
    return ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
}