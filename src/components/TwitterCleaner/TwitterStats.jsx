import React, { useMemo } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Loader, MessageSquare, Twitter, Check } from 'lucide-react';

const Card = ({ className = '', ...props }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
);

const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${className}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = 'Checkbox';

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
        <div className="space-y-4">
          <div className="flex justify-center">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            disabled={hasError || totalItems === 0}
          />
          <span className="font-medium">Select All</span>
        </div>
        <span className="text-sm text-gray-500">
          Total Items: {totalItems.toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selection.tweets}
                onCheckedChange={(checked) => 
                  onSelectionChange('tweets', checked)
                }
                disabled={hasError || stats.tweets === 0}
              />
              <div className="flex items-center gap-1.5">
                <Twitter className="w-4 h-4 text-primary" />
                <span>Tweets</span>
              </div>
            </div>
            <span className="font-medium">{stats.tweets.toLocaleString()}</span>
          </div>
          {stats.tweets > 0 && (
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ 
                  width: `${(stats.tweets / totalItems) * 100}%`,
                  opacity: selection.tweets ? 1 : 0.5
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selection.comments}
                onCheckedChange={(checked) => 
                  onSelectionChange('comments', checked)
                }
                disabled={hasError || stats.comments === 0}
              />
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Comments</span>
              </div>
            </div>
            <span className="font-medium">{stats.comments.toLocaleString()}</span>
          </div>
          {stats.comments > 0 && (
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ 
                  width: `${(stats.comments / totalItems) * 100}%`,
                  opacity: selection.comments ? 1 : 0.5
                }}
              />
            </div>
          )}
        </div>
      </div>

      {totalItems === 0 && !hasError && (
        <div className="text-center text-gray-500 py-2">
          No tweets or comments found
        </div>
      )}
    </Card>
  );
};

export default TwitterStats;
