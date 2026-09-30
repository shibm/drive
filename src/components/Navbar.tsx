import React from 'react';
import { Search, SlidersHorizontal, HelpCircle, Settings, X, HardDrive } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string | null;
  onSelectFilter: (type: string | null) => void;
  onOpenArchitectureModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  onOpenArchitectureModal,
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const filterRef = React.useRef<HTMLDivElement>(null);

  const filterOptions = [
    { label: 'All items', value: null },
    { label: 'Documents', value: 'doc' },
    { label: 'Spreadsheets', value: 'sheet' },
    { label: 'Presentations / PDF', value: 'pdf' },
    { label: 'Photos & Images', value: 'image' },
    { label: 'Code & Scripts', value: 'code' },
    { label: 'Archives (Zip/Tar)', value: 'archive' },
  ];

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-4 border-b border-neutral-200/80 bg-white flex items-center justify-between gap-4 z-30 select-none">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5 min-w-[220px]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-sm">
          <HardDrive className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-800 text-lg tracking-tight flex items-center gap-1.5">
            Drive
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Next.js Fullstack
            </span>
          </span>
        </div>
      </div>

      {/* Omnibox Search Bar */}
      <div className="flex-1 max-w-2xl relative" ref={filterRef}>
        <div className="flex items-center bg-neutral-100 hover:bg-neutral-200/70 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/20 border border-transparent focus-within:border-blue-400 rounded-full px-4 py-2 transition-all">
          <Search className="w-5 h-5 text-neutral-500 mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in Drive (files, folders, code, documents)..."
            className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 hover:bg-neutral-200 rounded-full text-neutral-500 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={`p-1.5 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors ${
              activeFilter ? 'bg-blue-100 text-blue-700' : ''
            }`}
            title="Filter search"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter dropdown */}
        {filterMenuOpen && (
          <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Filter by Type
            </div>
            {filterOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  onSelectFilter(opt.value);
                  setFilterMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-neutral-100 ${
                  activeFilter === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-neutral-700'
                }`}
              >
                <span>{opt.label}</span>
                {activeFilter === opt.value && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Utility Buttons & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenArchitectureModal}
          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-medium text-neutral-700 flex items-center gap-1.5 border border-neutral-200 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-neutral-500" />
          <span>Architecture Docs</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-xs flex items-center justify-center shadow-inner ml-2">
          ME
        </div>
      </div>
    </header>
  );
};
