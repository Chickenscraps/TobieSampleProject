import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    // Call Gemini API
    const { answer, sourcesUsed } = await askGemini(message);

    // Log to Supabase (non-blocking)
    const logPromise = supabase.from('chat_transcripts').insert({
      session_id: sessionId || 'anonymous',
      user_message: message,
      bot_response: answer,
      sources_used: sourcesUsed,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Also upsert the session record
    const sessionPromise = supabase.from('chat_sessions').upsert(
      {
        session_id: sessionId || 'anonymous',
        status: 'active',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    );

    // Fire and forget the logging — don't block the response
    Promise.all([logPromise, sessionPromise]).catch((err) => {
      console.error('Failed to log chat transcript:', err);
    });

    return NextResponse.json({ answer, sourcesUsed });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Something went wrong. Please try again or contact HR at 800-890-5420.',
        answer: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment, or contact HR directly at 800-890-5420 for immediate assistance.',
      },
      { status: 500 }
    );
  }
}
