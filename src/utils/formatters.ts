export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export function getFileCategory(mimeType?: string, name?: string): 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'sheet' | 'code' | 'archive' | 'other' {
  if (!mimeType && name) {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'mkv', 'mov', 'webm'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) return 'audio';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx', 'odt', 'txt', 'rtf'].includes(ext || '')) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'sheet';
    if (['js', 'ts', 'tsx', 'jsx', 'json', 'sql', 'py', 'go', 'rs', 'html', 'css', 'md'].includes(ext || '')) return 'code';
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext || '')) return 'archive';
  }

  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType?.startsWith('video/')) return 'video';
  if (mimeType?.startsWith('audio/')) return 'audio';
  if (mimeType?.includes('pdf')) return 'pdf';
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') || mimeType?.includes('csv')) return 'sheet';
  if (mimeType?.includes('word') || mimeType?.includes('document') || mimeType?.includes('text/markdown')) return 'doc';
  if (mimeType?.includes('json') || mimeType?.includes('text/javascript') || mimeType?.includes('text/plain')) return 'code';
  if (mimeType?.includes('zip') || mimeType?.includes('gzip') || mimeType?.includes('tar')) return 'archive';

  return 'other';
}
