import React from 'react';
import { 
  Folder, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Archive, 
  Code, 
  File as FileIcon 
} from 'lucide-react';
import { getFileCategory } from '../utils/formatters';

interface FileTypeIconProps {
  type: 'file' | 'folder';
  mimeType?: string;
  name?: string;
  className?: string;
  folderColor?: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  type,
  mimeType,
  name,
  className = 'w-6 h-6',
  folderColor,
}) => {
  if (type === 'folder') {
    return (
      <Folder 
        className={className} 
        style={{ color: folderColor || '#4285F4' }} 
        fill={folderColor ? `${folderColor}33` : '#4285f426'} 
      />
    );
  }

  const category = getFileCategory(mimeType, name);

  switch (category) {
    case 'image':
      return <ImageIcon className={`${className} text-rose-500`} />;
    case 'video':
      return <Video className={`${className} text-red-600`} />;
    case 'audio':
      return <Music className={`${className} text-amber-500`} />;
    case 'sheet':
      return <FileSpreadsheet className={`${className} text-emerald-600`} />;
    case 'doc':
      return <FileText className={`${className} text-blue-600`} />;
    case 'pdf':
      return <FileText className={`${className} text-rose-600`} />;
    case 'code':
      return <Code className={`${className} text-cyan-600`} />;
    case 'archive':
      return <Archive className={`${className} text-orange-500`} />;
    default:
      return <FileIcon className={`${className} text-slate-500`} />;
  }
};
