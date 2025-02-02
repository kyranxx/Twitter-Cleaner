import React, { useMemo } from 'react';
import { Loader, MessageSquare, Twitter } from 'lucide-react';

const Card = ({ className = '', ...props }) => (
  <div
    className={`bg-white rounded-xl border shadow-sm ${className}`}
    {...props}
  />
);

const Checkbox = ({ className = '', ...props }) => (
  <input
    type="checkbox"
    className={`h-4 w-4 rounded border-gray-300 text-[var(--primary)] 
                focus:ring-[var(--primary)] cursor-pointer ${className}`}
    {...props}
  />
);

const TwitterStats = ({ 
  isLoading,
  stats,
  selection,
  onSelectionChange,
  hasError
}) => {
  const totalItems = useMemo(() => 
    stats.tweets + stats.comments
  , [stats]);

  const isAllSelected = useMemo(() => 
    selection.tweets && selection.comments && totalItems > 0
  , [selection, totalItems]);

  const isPartiallySelected = useMemo(() => 
    (selection.tweets || selection.comments) && !isAllSelected
  , [selection, isAllSelected]);

  const handleSelectAll = (checked) => {
    onSelectionChange('tweets', checked);
    onSelectionChange('comments', checked);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="divide-y">
      {/* Header with Select All */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={isAllSelected}
              ref={node => {
                if (node) {
                  node.indeterminate = isPartiallySelected;
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              disabled={hasError || totalItems === 0}
            />
            <span className="font-medium">Select All</span>
          </div>
          <span className="text-sm text-gray-500">
            Total Items: {totalItems.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 divide-x">
        {/* Tweets */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={selection.tweets}
                onChange={(e) => onSelectionChange('tweets', e.target.checked)}
                disabled={hasError || stats.tweets === 0}
              />
              <div className="flex items-center gap-1.5">
                <Twitter className="h-5 w-5 text-[var(--primary)]" />
                <span className="font-medium">Tweets</span>
              </div>
            </div>
            <span className="font-medium">{stats.tweets.toLocaleString()}</span>
          </div>
          {stats.tweets > 0 && (
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] transition-all duration-500"
                style={{ 
                  width: `${(stats.tweets / totalItems) * 100}%`,
                  opacity: selection.tweets ? 1 : 0.5
                }}
              />
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={selection.comments}
                onChange={(e) => onSelectionChange('comments', e.target.checked)}
                disabled={hasError || stats.comments === 0}
              />
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
                <span className="font-medium">Comments</span>
              </div>
            </div>
            <span className="font-medium">{stats.comments.toLocaleString()}</span>
          </div>
          {stats.comments > 0 && (
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--primary)] transition-all duration-500"
                style={{ 
                  width: `${(stats.comments / totalItems) * 100}%`,
                  opacity: selection.comments ? 1 : 0.5
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {totalItems === 0 && !hasError && (
        <div className="p-6 text-center text-gray-500">
          No tweets or comments found
        </div>
      )}
    </Card>
  );
};

export default TwitterStats;
