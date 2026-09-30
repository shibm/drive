import React from 'react';
import { 
  HardDrive, 
  Users, 
  Clock, 
  Star, 
  Trash2, 
  Cloud, 
  Plus, 
  FolderPlus, 
  Upload, 
  Layers 
} from 'lucide-react';
import { NavSection } from '../types/drive';
import { formatBytes } from '../utils/formatters';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onNewFolder: () => void;
  onUploadFile: () => void;
  usedBytes: number;
  totalBytes: number;
  onOpenArchitectureModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  onNewFolder,
  onUploadFile,
  usedBytes,
  totalBytes,
  onOpenArchitectureModal,
}) => {
  const [newMenuOpen, setNewMenuOpen] = React.useState(false);
  const newMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setNewMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const percentage = Math.min(100, Math.round((usedBytes / totalBytes) * 100));

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'my-drive', label: 'My Drive', icon: <HardDrive className="w-5 h-5" /> },
    { id: 'shared-with-me', label: 'Shared with me', icon: <Users className="w-5 h-5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
    { id: 'starred', label: 'Starred', icon: <Star className="w-5 h-5" /> },
    { id: 'trash', label: 'Trash', icon: <Trash2 className="w-5 h-5" /> },
    { id: 'storage', label: 'Storage Details', icon: <Cloud className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-neutral-50/70 border-r border-neutral-200/80 flex flex-col h-full select-none">
      {/* Top Action "+ New" Button */}
      <div className="p-4 relative" ref={newMenuRef}>
        <button
          onClick={() => setNewMenuOpen(!newMenuOpen)}
          className="flex items-center gap-3 px-5 py-3.5 bg-white border border-neutral-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all text-neutral-800 font-medium text-sm hover:bg-neutral-50 active:scale-98"
        >
          <Plus className="w-5 h-5 text-indigo-600 font-bold" />
          <span>New</span>
        </button>

        {newMenuOpen && (
          <div className="absolute top-18 left-4 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setNewMenuOpen(false);
                onNewFolder();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-neutral-500" />
              <span>New folder</span>
            </button>
            <div className="h-px bg-neutral-200 my-1" />
            <button
              onClick={() => {
                setNewMenuOpen(false);
                onUploadFile();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Upload className="w-4 h-4 text-neutral-500" />
              <span>File upload</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100/70 text-blue-900 font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-200/50'
              }`}
            >
              <span className={isActive ? 'text-blue-700' : 'text-neutral-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* System Architecture Callout */}
        <div className="pt-4">
          <button
            onClick={onOpenArchitectureModal}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-indigo-700 bg-indigo-50/80 border border-indigo-200 hover:bg-indigo-100 transition-all text-left"
          >
            <Layers className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>Next.js Architecture Blueprint</span>
          </button>
        </div>
      </nav>

      {/* Storage Gauge */}
      <div className="p-4 border-t border-neutral-200/70 bg-white/40">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-neutral-600">
          <Cloud className="w-4 h-4 text-blue-600" />
          <span>Storage</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-neutral-500 mb-2">
          {formatBytes(usedBytes)} of {formatBytes(totalBytes)} used ({percentage}%)
        </p>
        <button
          onClick={() => onSelectSection('storage')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          Manage storage
        </button>
      </div>
    </aside>
  );
};
