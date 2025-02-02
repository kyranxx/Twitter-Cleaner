import React, { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Trash2, Loader, LogOut, AlertTriangle } from 'lucide-react';

const Button = ({ children, variant = 'default', className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded font-medium ${
      variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700'
        : variant === 'outline'
        ? 'border border-gray-300 hover:bg-gray-50'
        : 'bg-primary text-white hover:bg-primary/90'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Alert = ({ children, variant = 'default', className = '', ...props }) => (
  <div
    className={`rounded-lg border p-4 ${
      variant === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

const AlertTitle = ({ children, className = '', ...props }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h5>
);

const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
    {children}
  </div>
);

const DeleteOptions = ({ 
  isDeleting,
  progress,
  selection,
  onDelete,
  onLogout,
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
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            This action will permanently delete all selected items from your Twitter account.
            This action cannot be undone.
          </p>
          {(selection.tweets || selection.comments) && (
            <p className="font-medium">
              You have selected to delete {selectedItems}.
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Button
          onClick={() => setShowConfirmDialog(true)}
          variant="destructive"
          className="w-full relative"
          disabled={isDeleting || (!selection.tweets && !selection.comments) || disabled}
        >
          {isDeleting ? (
            <>
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Deleting... {progress}%</span>
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected Items
            </>
          )}
        </Button>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full"
          disabled={isDeleting || disabled}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <AlertDialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              Are you absolutely sure?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 space-y-2">
              <p>
                This action cannot be undone. This will permanently delete the selected
                items from your Twitter account.
              </p>
              {(selection.tweets || selection.comments) && (
                <p className="font-medium text-red-600">
                  You are about to delete {selectedItems}.
                </p>
              )}
            </AlertDialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default DeleteOptions;
