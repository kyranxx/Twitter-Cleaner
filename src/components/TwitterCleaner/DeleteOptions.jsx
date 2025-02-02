import React, { useState } from 'react';
import { Trash2, Loader, AlertTriangle } from 'lucide-react';

const DeleteOptions = ({ 
  isDeleting,
  progress,
  selection,
  onDelete,
  disabled,
  hasError
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const selectedCount = {
    tweets: selection.tweets ? "all tweets" : "",
    comments: selection.comments ? "all comments" : ""
  };

  const selectedItems = Object.values(selectedCount)
    .filter(Boolean)
    .join(" and ");

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    onDelete();
  };

  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium text-yellow-800">Warning</h3>
            <p className="text-sm text-yellow-700">
              This action will permanently delete all selected items from your Twitter account.
              This action cannot be undone.
            </p>
            {(selection.tweets || selection.comments) && (
              <p className="text-sm font-medium text-yellow-800 mt-2">
                You have selected to delete {selectedItems}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => setShowConfirmDialog(true)}
        disabled={isDeleting || (!selection.tweets && !selection.comments) || disabled}
        className="w-full bg-[var(--destructive)] text-white rounded-lg py-2.5 px-4 font-medium
                   hover:bg-[var(--destructive)]/90 transition-colors relative overflow-hidden
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <>
            <div className="flex items-center justify-center space-x-2">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Deleting... {progress}%</span>
            </div>
            <div 
              className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Delete Selected Items</span>
          </div>
        )}
      </button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-semibold">Are you absolutely sure?</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                This action cannot be undone. This will permanently delete the selected
                items from your Twitter account.
              </p>
              {(selection.tweets || selection.comments) && (
                <p className="font-medium text-[var(--destructive)]">
                  You are about to delete {selectedItems}.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--destructive)] text-white rounded-lg font-medium
                         hover:bg-[var(--destructive)]/90 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteOptions;
