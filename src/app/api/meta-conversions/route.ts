import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventData, userData } = body;

    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '3298001353725548';
    const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta Conversions API access token not configured.' },
        { status: 500 }
      );
    }

    const payload = {
      data: [
        {
          event_name: eventName || 'PageView',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: request.headers.get('referer') || '',
          user_data: {
            client_ip_address: request.headers.get('x-forwarded-for') || '',
            client_user_agent: request.headers.get('user-agent') || '',
            ...userData,
          },
          custom_data: eventData || {},
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
