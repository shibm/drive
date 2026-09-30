import React, { useState } from 'react';
import { Share2, Copy, Check, Users, Shield, X } from 'lucide-react';
import { DriveItem, SharePermission } from '../types/drive';

interface ShareModalProps {
  item: DriveItem | null;
  onClose: () => void;
  onUpdatePermissions: (itemId: string, permissions: SharePermission[]) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  onClose,
  onUpdatePermissions,
}) => {
  if (!item) return null;

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer');
  const [copied, setCopied] = useState(false);

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) return;

    const newPerm: SharePermission = {
      email: inviteEmail.trim(),
      role: inviteRole,
      addedAt: new Date().toISOString(),
    };

    onUpdatePermissions(item.id, [...item.sharedWith, newPerm]);
    setInviteEmail('');
  };

  const handleRemoveCollaborator = (email: string) => {
    onUpdatePermissions(
      item.id,
      item.sharedWith.filter((p) => p.email !== email)
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `?share=${item.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">
                Share "{item.name}"
              </h3>
              <p className="text-xs text-neutral-500">Access control & collaborator permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Person Input */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleAddCollaborator} className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Add people, groups, or emails"
              className="flex-1 px-3.5 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="px-3 py-2 border border-neutral-300 rounded-xl text-sm bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button
              type="submit"
              disabled={!inviteEmail}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-xs"
            >
              Send
            </button>
          </form>

          {/* People with access list */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
              People with access
            </h4>
            <div className="space-y-2.5">
              {/* Owner */}
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                    ME
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">You (Owner)</p>
                    <p className="text-xs text-neutral-500">owner@drive.internal</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-500 font-medium">Owner</span>
              </div>

              {/* Shared Collaborators */}
              {item.sharedWith.map((user) => (
                <div key={user.email} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium flex items-center justify-center">
                      {user.email.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{user.email}</p>
                      <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCollaborator(user.email)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Copy Link */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-700 text-xs font-medium hover:bg-neutral-100 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link copied!' : 'Copy link'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
