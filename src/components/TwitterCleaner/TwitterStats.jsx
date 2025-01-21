import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader } from 'lucide-react';

const TwitterStats = ({ 
  isLoading,
  stats,
  selection,
  onSelectionChange
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your Twitter data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selection.tweets}
            onCheckedChange={(checked) => 
              onSelectionChange('tweets', checked)
            }
          />
          <span>Tweets</span>
        </div>
        <span className="font-medium">{stats.tweets.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selection.comments}
            onCheckedChange={(checked) => 
              onSelectionChange('comments', checked)
            }
          />
          <span>Comments</span>
        </div>
        <span className="font-medium">{stats.comments.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TwitterStats;
