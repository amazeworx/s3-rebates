'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface VoteCounterProps {
  initialLikes: number;
  initialDislikes: number;
  voteKey: string;
}

type VoteType = 'like' | 'dislike';

export function VoteCounter({ initialLikes, initialDislikes, voteKey }: VoteCounterProps) {
  const [likes, setLikes] = React.useState(initialLikes);
  const [dislikes, setDislikes] = React.useState(initialDislikes);
  const [userVote, setUserVote] = useLocalStorage<VoteType | null>(`vote_${voteKey}`, null);
  const [loading, setLoading] = React.useState(false);

  const handleVote = async (type: VoteType) => {
    setLoading(true);
    const prevUserVote = userVote;
    const optimisticLikes = likes;
    const optimisticDislikes = dislikes;

    // Optimistic UI update
    if (type === 'like') {
      if (prevUserVote === 'like') {
        setLikes((l) => l - 1); // Unlike
        setUserVote(null);
      } else {
        setLikes((l) => l + 1); // Like
        if (prevUserVote === 'dislike') {
          setDislikes((d) => d - 1); // Remove dislike
        }
        setUserVote('like');
      }
    } else {
      // type === 'dislike'
      if (prevUserVote === 'dislike') {
        setDislikes((d) => d - 1); // Undislike
        setUserVote(null);
      } else {
        setDislikes((d) => d + 1); // Dislike
        if (prevUserVote === 'like') {
          setLikes((l) => l - 1); // Remove like
        }
        setUserVote('dislike');
      }
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteKey, type, prevUserVote }),
      });

      if (!response.ok) {
        throw new Error('Failed to record vote');
      }
    } catch (error) {
      console.error('Error recording vote:', error);
      // Revert optimistic update on error
      setLikes(optimisticLikes);
      setDislikes(optimisticDislikes);
      setUserVote(prevUserVote);
      alert('Failed to record your vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'flex items-center gap-1 bg-white',
          userVote === 'dislike' && 'bg-destructive text-destructive-foreground hover:bg-destructive'
        )}
        onClick={() => handleVote('dislike')}
        disabled={loading}
      >
        {dislikes.toLocaleString()}
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'flex items-center gap-1 bg-white',
          userVote === 'like' && 'bg-primary text-primary-foreground hover:bg-primary'
        )}
        onClick={() => handleVote('like')}
        disabled={loading}
      >
        <ThumbsUp className="h-4 w-4" />
        {likes.toLocaleString()}
      </Button>
    </div>
  );
}
