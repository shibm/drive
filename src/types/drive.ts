export interface DriveItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null; // null represents Root ("My Drive")
  size: number; // bytes
  mimeType?: string;
  starred: boolean;
  trashed: boolean;
  trashedAt?: string;
  createdAt: string;
  updatedAt: string;
  sharedWith: SharePermission[];
  color?: string; // for folder badges
  contentUrl?: string; // data URL or mock file preview
  textPreview?: string; // text/markdown snippet
}

export interface SharePermission {
  email: string;
  role: 'viewer' | 'commenter' | 'editor';
  addedAt: string;
}

export type ViewMode = 'grid' | 'list';

export type NavSection = 'my-drive' | 'shared-with-me' | 'recent' | 'starred' | 'trash' | 'storage';

export type SortField = 'name' | 'updatedAt' | 'size';
export type SortOrder = 'asc' | 'desc';

export interface StorageStats {
  usedBytes: number;
  totalBytes: number; // e.g. 15 GB = 15 * 1024 * 1024 * 1024
}
