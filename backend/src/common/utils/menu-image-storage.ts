import { unlink } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

// Resolves to backend/uploads in both src and compiled dist layouts.
export const UPLOAD_DIRECTORY = resolve(moduleDirectory, '../../../uploads');
export const MENU_ITEMS_UPLOAD_DIRECTORY = resolve(UPLOAD_DIRECTORY, 'menu-items');

export function ensureMenuItemsUploadDirectory(): void {
  mkdirSync(MENU_ITEMS_UPLOAD_DIRECTORY, { recursive: true });
}

export async function removeMenuImageFile(imageUrl?: string | null): Promise<void> {
  if (!imageUrl) return;

  const prefix = '/uploads/menu-items/';
  if (!imageUrl.startsWith(prefix)) return;

  const filename = basename(imageUrl);
  if (!filename || filename === '.' || filename === '..') return;

  try {
    await unlink(resolve(MENU_ITEMS_UPLOAD_DIRECTORY, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}
