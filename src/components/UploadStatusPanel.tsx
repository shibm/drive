import React from 'react';
import { CheckCircle2, Loader2, X, FileUp } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

export interface UploadTask {
  id: string;
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: 'uploading' | 'completed' | 'failed';
}

interface UploadStatusPanelProps {
  tasks: UploadTask[];
  onDismissTask: (id: string) => void;
  onClearAll: () => void;
}

export const UploadStatusPanel: React.FC<UploadStatusPanelProps> = ({
  tasks,
  onDismissTask,
  onClearAll,
}) => {
  if (tasks.length === 0) return null;

  const inProgressCount = tasks.filter((t) => t.status === 'uploading').length;

  return (
    <div className="fixed bottom-6 right-6 w-84 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          {inProgressCount > 0 ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>
            {inProgressCount > 0
              ? `Uploading ${inProgressCount} item${inProgressCount > 1 ? 's' : ''}...`
              : `${tasks.length} uploads complete`}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-neutral-400 hover:text-white p-1 rounded"
          title="Clear list"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Task List */}
      <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 p-2">
        {tasks.map((task) => (
          <div key={task.id} className="p-2 text-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-neutral-800 truncate" title={task.name}>
                {task.name}
              </span>
              <span className="text-[11px] text-neutral-500 shrink-0">
                {task.status === 'uploading' ? `${task.progress}%` : formatBytes(task.size)}
              </span>
            </div>

            {/* Progress bar */}
            {task.status === 'uploading' && (
              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-150"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            )}

            {task.status === 'completed' && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to local disk storage (0 S3 cost)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
