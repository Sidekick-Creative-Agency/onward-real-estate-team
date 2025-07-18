export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // camelCase to snake_case
    .replace(/[\s\-]+/g, '_') // spaces and hyphens to underscores
    .toLowerCase()
}
