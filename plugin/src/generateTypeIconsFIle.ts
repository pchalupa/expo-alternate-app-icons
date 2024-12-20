import path from 'path';
import fs from 'fs';

/**
 * Generates a TypeScript file containing the `AlternateAppIcons` type.
 * @param iconNames Array of icon names to include in the type definition.
 */
export function generateTypeIconsFile(iconNames: string[]): void {
  // Path to the file to be generated
  const typeFilePath = path.resolve(__dirname, '../../src', 'AlternateAppIconsType.ts');

  // Content of the TypeScript file
  const typeFileContent = `
/**
 * Auto-generated file. Do not edit manually.
 */
export type AlternateAppIcons = ${iconNames.map((name) => `'${name}'`).join(' | ')};
`;

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(typeFilePath), { recursive: true });

  // Write the file with the generated content
  fs.writeFileSync(typeFilePath, typeFileContent.trim());
}
