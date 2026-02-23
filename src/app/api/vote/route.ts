import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export async function GET(request: NextRequest) {
  try {
    const voteKey = request.nextUrl.searchParams.get('voteKey');
    if (!voteKey) {
      return NextResponse.json({ error: 'voteKey is required' }, { status: 400 });
    }

    const likes = (await redis.get(`${voteKey}:likes`)) || 0;
    const dislikes = (await redis.get(`${voteKey}:dislikes`)) || 0;

    return NextResponse.json({ likes: Number(likes), dislikes: Number(dislikes) });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { voteKey, type, prevUserVote } = await request.json();

    if (!voteKey || !type) {
      return NextResponse.json({ error: 'voteKey and type are required' }, { status: 400 });
    }

    let likesChange = 0;
    let dislikesChange = 0;

    if (type === 'like') {
      if (prevUserVote === 'like') {
        likesChange = -1; // User unliked
      } else {
        likesChange = 1; // User liked
        if (prevUserVote === 'dislike') {
          dislikesChange = -1; // User changed from dislike to like
        }
      }
    } else {
      // type === 'dislike'
      if (prevUserVote === 'dislike') {
        dislikesChange = -1; // User undisliked
      } else {
        dislikesChange = 1; // User disliked
        if (prevUserVote === 'like') {
          likesChange = -1; // User changed from like to dislike
        }
      }
    }

    if (likesChange !== 0) {
      await redis.incrby(`${voteKey}:likes`, likesChange);
    }
    if (dislikesChange !== 0) {
      await redis.incrby(`${voteKey}:dislikes`, dislikesChange);
    }

    const updatedLikes = (await redis.get(`${voteKey}:likes`)) || 0;
    const updatedDislikes = (await redis.get(`${voteKey}:dislikes`)) || 0;

    return NextResponse.json({ likes: Number(updatedLikes), dislikes: Number(updatedDislikes) });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}
