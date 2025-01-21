import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trash2, Loader, LogOut } from 'lucide-react';

const DeleteOptions = ({ 
  isDeleting,
  progress,
  selection,
  onDelete,
  onLogout 
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action will permanently delete all selected items.
          This cannot be undone.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Button
          onClick={onDelete}
          variant="destructive"
          className="w-full"
          disabled={isDeleting || (!selection.tweets && !selection.comments)}
        >
          {isDeleting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Deleting... {progress}%
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
          disabled={isDeleting}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DeleteOptions;
