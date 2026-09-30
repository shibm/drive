import React from 'react';
import { X, Download, Star, ExternalLink, Calendar, HardDrive, FileText } from 'lucide-react';
import { DriveItem } from '../types/drive';
import { FileTypeIcon } from './FileTypeIcon';
import { formatBytes, formatDate } from '../utils/formatters';

interface FilePreviewModalProps {
  item: DriveItem | null;
  onClose: () => void;
  onToggleStar: (id: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  item,
  onClose,
  onToggleStar,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <div className="flex items-center gap-3 min-w-0">
            <FileTypeIcon
              type="file"
              mimeType={item.mimeType}
              name={item.name}
              className="w-5 h-5 shrink-0"
            />
            <span className="font-medium text-sm text-neutral-100 truncate">{item.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStar(item.id)}
              className={`p-2 rounded-lg hover:bg-neutral-800 transition-colors ${
                item.starred ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
              }`}
              title="Star"
            >
              <Star className="w-4 h-4" fill={item.starred ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                alert(`Downloaded "${item.name}" directly from local block storage stream.`);
              }}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Preview */}
        <div className="flex-1 bg-neutral-950 p-6 flex items-center justify-center overflow-auto">
          {item.contentUrl ? (
            <img
              src={item.contentUrl}
              alt={item.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : item.textPreview ? (
            <div className="w-full h-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl p-6 font-mono text-xs text-neutral-300 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {item.textPreview}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                <FileTypeIcon
                  type="file"
                  mimeType={item.mimeType}
                  name={item.name}
                  className="w-10 h-10 text-neutral-400"
                />
              </div>
              <h4 className="text-base font-semibold text-neutral-200">{item.name}</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-md">
                No inline web renderer for this binary format ({item.mimeType || 'unknown'}). File is safely stored in local block storage.
              </p>
              <button
                onClick={() => alert(`Direct download initiated for ${item.name}`)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download raw bytes ({formatBytes(item.size)})
              </button>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
              Size: {formatBytes(item.size)}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              Modified: {formatDate(item.updatedAt)}
            </span>
          </div>
          <span className="font-mono text-[11px] text-neutral-500">
            Inode: {item.id}
          </span>
        </div>
      </div>
    </div>
  );
};
