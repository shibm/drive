import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { ShareModal } from './components/ShareModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { NewFolderModal } from './components/NewFolderModal';
import { UploadStatusPanel, UploadTask } from './components/UploadStatusPanel';
import { ArchitectureModal } from './components/ArchitectureModal';
import { DriveItem, NavSection, ViewMode, SortField, SortOrder, SharePermission } from './types/drive';
import { INITIAL_ITEMS } from './data/mockDrive';
import { getFileCategory } from './utils/formatters';

const STORAGE_KEY = 'google_drive_app_items_v1';
const TOTAL_STORAGE = 15 * 1024 * 1024 * 1024; // 15 GB

export default function App() {
  // Items state (saved in LocalStorage to persist changes)
  const [items, setItems] = useState<DriveItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ITEMS;
  });

  // UI state
  const [currentSection, setCurrentSection] = useState<NavSection>('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Modals state
  const [shareItem, setShareItem] = useState<DriveItem | null>(null);
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Calculate used bytes
  const usedBytes = items
    .filter((i) => !i.trashed)
    .reduce((acc, curr) => acc + (curr.size || 0), 0);

  // Calculate breadcrumb trail for current folder
  const getFolderPath = () => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: 'My Drive' }];
    if (!currentFolderId) return path;

    const findFolder = (id: string): DriveItem | undefined => items.find((i) => i.id === id);

    let curr = findFolder(currentFolderId);
    const crumbs: { id: string | null; name: string }[] = [];

    while (curr) {
      crumbs.unshift({ id: curr.id, name: curr.name });
      if (curr.parentId) {
        curr = findFolder(curr.parentId);
      } else {
        break;
      }
    }

    return [...path, ...crumbs];
  };

  // Filtered & Sorted items
  const displayedItems = items
    .filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const matchesName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesContent = item.textPreview?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesName && !matchesContent) return false;
      }

      // File type category filter
      if (activeFilter) {
        if (item.type === 'folder') return false;
        const cat = getFileCategory(item.mimeType, item.name);
        if (cat !== activeFilter) return false;
      }

      // Section filtering
      if (currentSection === 'trash') {
        return item.trashed;
      }

      // Other sections exclude trashed items
      if (item.trashed) return false;

      if (currentSection === 'starred') {
        return item.starred;
      }

      if (currentSection === 'recent') {
        return item.type === 'file';
      }

      if (currentSection === 'shared-with-me') {
        return item.sharedWith.length > 0;
      }

      if (currentSection === 'storage') {
        return item.type === 'file';
      }

      // Default 'my-drive': filter by current active folder
      return item.parentId === currentFolderId;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'updatedAt') {
        comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      // When in 'storage' view, always sort biggest files first
      if (currentSection === 'storage') {
        return b.size - a.size;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Action handlers
  const handleToggleStar = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, starred: !item.starred } : item))
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, trashed: true, trashedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const handleRestoreItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, trashed: false } : item))
    );
  };

  const handlePermanentDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCreateFolder = (name: string, color?: string) => {
    const newFolder: DriveItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parentId: currentFolderId,
      size: 0,
      starred: false,
      trashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sharedWith: [],
      color: color || '#4285F4',
    };
    setItems((prev) => [newFolder, ...prev]);
  };

  const handleUpdatePermissions = (itemId: string, permissions: SharePermission[]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, sharedWith: permissions } : item))
    );
    if (shareItem && shareItem.id === itemId) {
      setShareItem({ ...shareItem, sharedWith: permissions });
    }
  };

  // Upload simulation with progress chunking
  const handleFilesChosen = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    Array.from(fileList).forEach((file) => {
      const taskId = `task-${Date.now()}-${Math.random()}`;
      const newTask: UploadTask = {
        id: taskId,
        name: file.name,
        size: file.size,
        progress: 10,
        status: 'uploading',
      };

      setUploadTasks((prev) => [newTask, ...prev]);

      // Read text preview or image preview if small
      let previewText = '';
      let contentUrl = '';

      if (file.type.startsWith('image/')) {
        contentUrl = URL.createObjectURL(file);
      }

      // Simulate chunked upload progress
      let currentProgress = 15;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 15;
        if (currentProgress >= 100) {
          clearInterval(interval);

          setUploadTasks((tasks) =>
            tasks.map((t) => (t.id === taskId ? { ...t, progress: 100, status: 'completed' } : t))
          );

          // Add file to items list
          const newItem: DriveItem = {
            id: `file-${Date.now()}`,
            name: file.name,
            type: 'file',
            parentId: currentFolderId,
            size: file.size,
            mimeType: file.type || 'application/octet-stream',
            starred: false,
            trashed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sharedWith: [],
            contentUrl: contentUrl || undefined,
            textPreview:
              file.size < 50000 && !file.type.startsWith('image/')
                ? `Uploaded file content: ${file.name}\nSize: ${file.size} bytes\nMIME: ${file.type}\nStatus: Saved to local NVMe storage block.`
                : undefined,
          };

          setItems((prev) => [newItem, ...prev]);
        } else {
          setUploadTasks((tasks) =>
            tasks.map((t) => (t.id === taskId ? { ...t, progress: currentProgress } : t))
          );
        }
      }, 200);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesChosen(e.dataTransfer.files);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden text-neutral-900 font-sans antialiased">
      {/* Hidden File Input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFilesChosen(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onOpenArchitectureModal={() => setArchitectureOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(section) => {
            setCurrentSection(section);
            if (section === 'my-drive') {
              setCurrentFolderId(null);
            }
          }}
          onNewFolder={() => setNewFolderOpen(true)}
          onUploadFile={() => fileInputRef.current?.click()}
          usedBytes={usedBytes}
          totalBytes={TOTAL_STORAGE}
          onOpenArchitectureModal={() => setArchitectureOpen(true)}
        />

        {/* Central File & Folder Content View */}
        <ContentArea
          currentSection={currentSection}
          currentFolderId={currentFolderId}
          folderPath={getFolderPath()}
          items={displayedItems}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field) => {
            if (sortField === field) {
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
              setSortField(field);
              setSortOrder('asc');
            }
          }}
          onNavigateToFolder={(folderId) => {
            setCurrentFolderId(folderId);
            setSelectedItemId(null);
          }}
          onToggleStar={handleToggleStar}
          onDeleteItem={handleDeleteItem}
          onRestoreItem={handleRestoreItem}
          onPermanentDeleteItem={handlePermanentDelete}
          onPreviewItem={(item) => setPreviewItem(item)}
          onShareItem={(item) => setShareItem(item)}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDraggingOver={isDraggingOver}
        />
      </div>

      {/* Modals & Floating Components */}
      <ShareModal
        item={shareItem}
        onClose={() => setShareItem(null)}
        onUpdatePermissions={handleUpdatePermissions}
      />

      <FilePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onToggleStar={handleToggleStar}
      />

      <NewFolderModal
        isOpen={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      <ArchitectureModal
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      <UploadStatusPanel
        tasks={uploadTasks}
        onDismissTask={(id) => setUploadTasks((t) => t.filter((item) => item.id !== id))}
        onClearAll={() => setUploadTasks([])}
      />
    </div>
  );
}
