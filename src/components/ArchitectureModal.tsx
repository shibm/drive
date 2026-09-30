import React, { useState } from 'react';
import { X, Layers, Database, HardDrive, ShieldCheck, Cpu, Code2, Server } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'db' | 'localstorage'>('overview');

  return (
    <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Next.js Full-Stack Architecture Guide
              </h2>
              <p className="text-xs text-neutral-500">
                Medium-Scale Google Drive with Local Disk Storage & Zero AWS/S3 Dependencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-200 text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 px-6 bg-white gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Server className="w-4 h-4" />
            System Blueprint
          </button>
          <button
            onClick={() => setActiveTab('localstorage')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'localstorage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            No-S3 Local Storage
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Next.js App Router (API Routes)
          </button>
          <button
            onClick={() => setActiveTab('db')}
            className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'db'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Database className="w-4 h-4" />
            PostgreSQL Inode Schema
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm text-neutral-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <Server className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Frontend + Backend</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Single Next.js codebase. React Server Components + Client interactivity, with API Route handlers (`/app/api/*`) for streaming file I/O.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Local Disk Storage</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Zero S3 bucket costs. Files are written to server NVMe/SSD storage directory with hash verification and atomic file moves.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 mb-1">Postgres Inodes</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Adjacency tree model with `parent_id`. Moving a folder with 10,000 files is an instantaneous $O(1)$ single-row update.
                  </p>
                </div>
              </div>

              {/* Dataflow diagram box */}
              <div className="p-5 bg-neutral-900 text-neutral-200 rounded-2xl font-mono text-xs overflow-x-auto">
                <p className="text-neutral-400 mb-2">// File Upload Lifecycle (Next.js Local Storage)</p>
                <p>1. [Client UI] ── (File Drop) ──&gt; Fast chunking & mime detection</p>
                <p>2. [Client UI] ── POST /api/upload ──&gt; Next.js Node.js Stream</p>
                <p>3. [Next.js Route] ── fs.createWriteStream('./storage/&lt;uuid&gt;') ──&gt; Local Disk</p>
                <p>4. [Next.js Route] ── INSERT INTO inodes (name, parent_id, size) ──&gt; PostgreSQL</p>
                <p>5. [Client UI] ── Instant optimistic UI update in React state</p>
              </div>
            </div>
          )}

          {activeTab === 'localstorage' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs">
                <span className="font-bold">Why local disk storage is awesome for medium scale:</span>
                <p className="mt-1">
                  You don't need AWS accounts, credit cards, or IAM permissions. A standard VPS with 500GB SSD handles tens of thousands of files with zero egress or S3 API request fees.
                </p>
              </div>

              <div className="p-4 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <p className="text-emerald-400">// Next.js Server Handler: src/app/api/upload/route.ts</p>
                <p className="text-neutral-400">import &#123; NextRequest, NextResponse &#125; from 'next/server';</p>
                <p className="text-neutral-400">import fs from 'node:fs/promises';</p>
                <p className="text-neutral-400">import path from 'node:path';</p>
                <p className="text-neutral-400">import crypto from 'node:crypto';</p>
                <br />
                <p>export async function POST(req: NextRequest) &#123;</p>
                <p className="pl-4">const formData = await req.formData();</p>
                <p className="pl-4">const file = formData.get('file') as File;</p>
                <p className="pl-4">const parentId = formData.get('parentId') as string | null;</p>
                <br />
                <p className="pl-4">// 1. Generate unique file storage key</p>
                <p className="pl-4">const storageKey = crypto.randomUUID();</p>
                <p className="pl-4">const uploadDir = path.join(process.cwd(), 'uploads');</p>
                <p className="pl-4">await fs.mkdir(uploadDir, &#123; recursive: true &#125;);</p>
                <br />
                <p className="pl-4">// 2. Stream byte buffer to local disk</p>
                <p className="pl-4">const bytes = await file.arrayBuffer();</p>
                <p className="pl-4">await fs.writeFile(path.join(uploadDir, storageKey), Buffer.from(bytes));</p>
                <br />
                <p className="pl-4">// 3. Save Inode record in DB</p>
                <p className="pl-4">const item = await db.items.create(&#123;</p>
                <p className="pl-8">name: file.name,</p>
                <p className="pl-8">size: file.size,</p>
                <p className="pl-8">mimeType: file.type,</p>
                <p className="pl-8">storageKey,</p>
                <p className="pl-8">parentId,</p>
                <p className="pl-4">&#125;);</p>
                <br />
                <p className="pl-4">return NextResponse.json(item);</p>
                <p>&#125;</p>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-800">Next.js REST Endpoints</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                  <span className="font-mono font-bold text-blue-600">GET /api/items</span>
                  <p className="text-neutral-500 mt-1">
                    Fetches files and folders with query params: `?parentId=root&filter=images&search=project`
                  </p>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                  <span className="font-mono font-bold text-emerald-600">POST /api/folders</span>
                  <p className="text-neutral-500 mt-1">
                    Creates a new directory inode with customizable badge color and parent pointer.
                  </p>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                  <span className="font-mono font-bold text-amber-600">PATCH /api/items/:id</span>
                  <p className="text-neutral-500 mt-1">
                    Fast $O(1)$ rename, folder move (`newParentId`), star/unstar, and soft delete.
                  </p>
                </div>
                <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                  <span className="font-mono font-bold text-purple-600">GET /api/download/:id</span>
                  <p className="text-neutral-500 mt-1">
                    Streams raw binary bytes directly from local filesystem with `Content-Disposition: attachment`.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-900 text-neutral-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <p className="text-blue-400">-- PostgreSQL High-Performance Drive Schema</p>
                <p>CREATE TABLE drive_items (</p>
                <p className="pl-4">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
                <p className="pl-4">name VARCHAR(255) NOT NULL,</p>
                <p className="pl-4">type VARCHAR(10) NOT NULL CHECK (type IN ('file', 'folder')),</p>
                <p className="pl-4">parent_id UUID REFERENCES drive_items(id) ON DELETE CASCADE,</p>
                <p className="pl-4">size_bytes BIGINT DEFAULT 0,</p>
                <p className="pl-4">mime_type VARCHAR(100),</p>
                <p className="pl-4">storage_path TEXT, -- path on local disk</p>
                <p className="pl-4">is_starred BOOLEAN DEFAULT FALSE,</p>
                <p className="pl-4">is_trashed BOOLEAN DEFAULT FALSE,</p>
                <p className="pl-4">created_at TIMESTAMPTZ DEFAULT NOW(),</p>
                <p className="pl-4">updated_at TIMESTAMPTZ DEFAULT NOW()</p>
                <p>);</p>
                <br />
                <p className="text-emerald-400">-- Instant lookup index for folder contents</p>
                <p>CREATE INDEX idx_items_parent_active ON drive_items(parent_id) WHERE is_trashed = FALSE;</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-white flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Next.js App Router Architecture: Zero S3 Vendor Lock-in
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
