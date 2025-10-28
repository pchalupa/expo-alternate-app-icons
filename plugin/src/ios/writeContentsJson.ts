import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function writeContentsJson(
  filename: string,
  assetPath: string,
  width: number,
  height: number,
): Promise<void> {
  const path = join(assetPath, 'Contents.json');
  const payload = JSON.stringify(
    {
      images: [
        {
          filename,
          idiom: 'universal',
          platform: 'ios',
          size: `${width}x${height}`,
        },
      ],
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

export async function writeVariantsContentsJson(
  filenames: Record<string, string>,
  assetPath: string,
  width: number,
  height: number,
) {
  const path = join(assetPath, 'Contents.json');
  const payload = JSON.stringify(
    {
      images: Object.entries(filenames).map(([type, name]) => ({
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
