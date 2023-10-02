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
