import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trash2, Loader, LogOut, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This action cannot be undone. This will permanently delete the selected
                items from your Twitter account.
              </p>
              {(selection.tweets || selection.comments) && (
                <p className="font-medium text-destructive">
                  You are about to delete {selectedItems}.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteOptions;
