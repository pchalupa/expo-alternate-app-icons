const toPascalCase = (text: string)=> text
  .replace(/[\s\-_]+/g, ' ')
  .replace(/([A-Z])/g, ' $1')
  .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
  .replace(/\s+/g, '');

const toSnakeCase = (text: string) => text
  .replace(/([A-Z])/g, '_$1')
  .replace(/[\s\-]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .toLowerCase();

export { toPascalCase, toSnakeCase };