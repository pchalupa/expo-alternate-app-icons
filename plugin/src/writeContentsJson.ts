import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function writeContentsJson(
  filename: string | Record<string, string>,
  assetPath: string,
  width: number,
  height: number,
): Promise<void> {
  const path = join(assetPath, 'Contents.json');
  const payload = JSON.stringify(
    {
      images:
        typeof filename === 'string'
          ? [
              {
                filename,
                idiom: 'universal',
                platform: 'ios',
                size: `${width}x${height}`,
              },
            ]
          : Object.entries(filename).map(([type, name]) => ({
              filename: name,
              idiom: 'universal',
              platform: 'ios',
              size: `${width}x${height}`,
              appearances:
                type !== 'light'
                  ? [
                      {
                        appearance: 'luminosity',
                        value: type,
                      },
                    ]
                  : undefined,
            })),
      info: {
        author: 'expo',
        version: 1,
      },
    },
    null,
    2,
  );

  await writeFile(path, payload, 'utf-8');
}
