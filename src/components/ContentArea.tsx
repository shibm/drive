import React from 'react';
import { 
  ChevronRight, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  MoreVertical, 
  Star, 
  Download, 
  Trash2, 
  Share2, 
  Folder, 
  Eye,
  Info
} from 'lucide-react';
import { DriveItem, ViewMode, SortField, SortOrder, NavSection } from '../types/drive';
import { FileTypeIcon } from './FileTypeIcon';
import { formatBytes, formatDate } from '../utils/formatters';

interface ContentAreaProps {
  currentSection: NavSection;
  currentFolderId: string | null;
  folderPath: { id: string | null; name: string }[];
  items: DriveItem[];
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onNavigateToFolder: (folderId: string | null) => void;
  onToggleStar: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onRestoreItem: (itemId: string) => void;
  onPermanentDeleteItem: (itemId: string) => void;
  onPreviewItem: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  selectedItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDraggingOver: boolean;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  currentSection,
  currentFolderId,
  folderPath,
  items,
  viewMode,
  onToggleViewMode,
  sortField,
  sortOrder,
  onSortChange,
  onNavigateToFolder,
  onToggleStar,
  onDeleteItem,
  onRestoreItem,
  onPermanentDeleteItem,
  onPreviewItem,
  onShareItem,
  selectedItemId,
  onSelectItem,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggingOver,
}) => {
  const folders = items.filter((item) => item.type === 'folder');
  const files = items.filter((item) => item.type === 'file');

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'shared-with-me':
        return 'Shared with me';
      case 'recent':
        return 'Recent items';
      case 'starred':
        return 'Starred';
      case 'trash':
        return 'Trash';
      case 'storage':
        return 'Storage Breakdown';
      default:
        return 'My Drive';
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full bg-white overflow-hidden relative ${
        isDraggingOver ? 'ring-4 ring-blue-500 ring-inset bg-blue-50/20' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => onSelectItem(null)}
    >
      {/* Drag & Drop Overlay Alert */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-blue-500 flex flex-col items-center">
            <Folder className="w-12 h-12 text-blue-600 animate-bounce mb-2" />
            <span className="text-base font-semibold text-neutral-800">
              Drop files here to upload to {folderPath[folderPath.length - 1]?.name || 'My Drive'}
            </span>
            <span className="text-xs text-neutral-500 mt-1">
              Supports chunked parallel local uploads (No S3 required)
            </span>
          </div>
        </div>
      )}

      {/* Breadcrumbs & View Toggle Controls */}
      <div className="px-6 py-3 border-b border-neutral-200/80 flex items-center justify-between gap-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-base font-medium text-neutral-700 overflow-x-auto py-1">
          {currentSection !== 'my-drive' ? (
            <span className="text-neutral-900 font-semibold">{getSectionTitle()}</span>
          ) : (
            folderPath.map((crumb, idx) => {
              const isLast = idx === folderPath.length - 1;
              return (
                <React.Fragment key={crumb.id || 'root'}>
                  {idx > 0 && <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFolder(crumb.id);
                    }}
                    className={`px-2 py-1 rounded-lg transition-colors truncate max-w-[200px] ${
                      isLast
                        ? 'text-neutral-900 font-semibold bg-neutral-100/60'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 border border-neutral-200/60">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-neutral-800 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white shadow-xs text-neutral-800 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Sort button */}
          <button
            onClick={() => onSortChange(sortField === 'name' ? 'updatedAt' : sortField === 'updatedAt' ? 'size' : 'name')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              Sort: {sortField === 'name' ? 'Name' : sortField === 'updatedAt' ? 'Modified' : 'Size'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area (Folders & Files) */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3 text-neutral-400">
              <Folder className="w-8 h-8" />
            </div>
            <p className="text-neutral-700 font-medium text-sm">This folder is empty</p>
            <p className="text-neutral-500 text-xs mt-1">
              Drag and drop files here, or use the '+ New' button to add files.
            </p>
          </div>
        ) : (
          <>
            {/* Folders Section (Only in folder/my-drive views) */}
            {folders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Folders ({folders.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {folders.map((folder) => {
                    const isSelected = selectedItemId === folder.id;
                    return (
                      <div
                        key={folder.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(folder.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          onNavigateToFolder(folder.id);
                        }}
                        className={`group p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/70 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileTypeIcon type="folder" folderColor={folder.color} className="w-6 h-6 shrink-0" />
                          <span className="text-sm font-medium text-neutral-800 truncate">
                            {folder.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStar(folder.id);
                            }}
                            className={`p-1 rounded-md hover:bg-neutral-200/80 ${
                              folder.starred ? 'text-amber-500 opacity-100' : 'text-neutral-400'
                            }`}
                          >
                            <Star className="w-4 h-4" fill={folder.starred ? 'currentColor' : 'none'} />
                          </button>
                          {currentSection === 'trash' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestoreItem(folder.id);
                              }}
                              className="p-1 rounded-md hover:bg-neutral-200/80 text-emerald-600 text-xs font-medium"
                              title="Restore"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(folder.id);
                              }}
                              className="p-1 rounded-md hover:bg-neutral-200/80 text-neutral-400 hover:text-red-500"
                              title="Move to trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Files ({files.length})
                </h3>

                {viewMode === 'grid' ? (
                  /* Grid Card View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => {
                      const isSelected = selectedItemId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(file.id);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            onPreviewItem(file);
                          }}
                          className={`group rounded-2xl border flex flex-col overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-500/20 shadow-md'
                              : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                          }`}
                        >
                          {/* File Preview Banner */}
                          <div className="h-32 bg-neutral-100 flex items-center justify-center relative overflow-hidden group-hover:bg-neutral-200/60 transition-colors">
                            {file.contentUrl ? (
                              <img
                                src={file.contentUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : file.textPreview ? (
                              <div className="p-3 text-[10px] font-mono text-neutral-600 line-clamp-6 select-none opacity-80">
                                {file.textPreview}
                              </div>
                            ) : (
                              <FileTypeIcon
                                type="file"
                                mimeType={file.mimeType}
                                name={file.name}
                                className="w-14 h-14 opacity-75"
                              />
                            )}

                            {/* Floating Action Buttons */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs p-1 rounded-lg shadow-xs">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPreviewItem(file);
                                }}
                                className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                                title="Quick Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleStar(file.id);
                                }}
                                className={`p-1 rounded ${
                                  file.starred ? 'text-amber-500' : 'text-neutral-500 hover:text-amber-500'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5" fill={file.starred ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShareItem(file);
                                }}
                                className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                                title="Share"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* File Details Footer */}
                          <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-neutral-100">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileTypeIcon
                                type="file"
                                mimeType={file.mimeType}
                                name={file.name}
                                className="w-5 h-5 shrink-0"
                              />
                              <div className="truncate">
                                <p className="text-sm font-medium text-neutral-800 truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-[11px] text-neutral-400">
                                  {formatBytes(file.size)} • {formatDate(file.updatedAt)}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentSection === 'trash') {
                                  onPermanentDeleteItem(file.id);
                                } else {
                                  onDeleteItem(file.id);
                                }
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={currentSection === 'trash' ? 'Delete forever' : 'Move to trash'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Detailed Table / List View */
                  <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 text-xs font-semibold">
                          <th className="py-2.5 px-4">Name</th>
                          <th className="py-2.5 px-4 hidden md:table-cell">Owner</th>
                          <th className="py-2.5 px-4 hidden sm:table-cell">Last modified</th>
                          <th className="py-2.5 px-4">File size</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {files.map((file) => {
                          const isSelected = selectedItemId === file.id;
                          return (
                            <tr
                              key={file.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectItem(file.id);
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                onPreviewItem(file);
                              }}
                              className={`group cursor-pointer transition-colors ${
                                isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-neutral-50'
                              }`}
                            >
                              <td className="py-3 px-4 flex items-center gap-3">
                                <FileTypeIcon
                                  type="file"
                                  mimeType={file.mimeType}
                                  name={file.name}
                                  className="w-5 h-5 shrink-0"
                                />
                                <span className="text-neutral-800 truncate max-w-xs">{file.name}</span>
                                {file.starred && (
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                )}
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell text-neutral-500 text-xs">
                                me
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell text-neutral-500 text-xs">
                                {formatDate(file.updatedAt)}
                              </td>
                              <td className="py-3 px-4 text-neutral-500 text-xs">
                                {formatBytes(file.size)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onPreviewItem(file);
                                    }}
                                    className="p-1 rounded hover:bg-neutral-200 text-neutral-600"
                                    title="Preview"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onShareItem(file);
                                    }}
                                    className="p-1 rounded hover:bg-neutral-200 text-neutral-600"
                                    title="Share"
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (currentSection === 'trash') {
                                        onRestoreItem(file.id);
                                      } else {
                                        onDeleteItem(file.id);
                                      }
                                    }}
                                    className="p-1 rounded hover:bg-neutral-200 text-neutral-500 hover:text-red-500"
                                    title={currentSection === 'trash' ? 'Restore' : 'Move to trash'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
