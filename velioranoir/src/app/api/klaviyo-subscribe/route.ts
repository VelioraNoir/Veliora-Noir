// src/app/api/klaviyo-subscribe/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'website' } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Get Klaviyo credentials from environment
    const klaviyoPrivateKey = process.env.KLAVIYO_PRIVATE_KEY;
    const klaviyoListId = process.env.KLAVIYO_LIST_ID;

    if (!klaviyoPrivateKey || !klaviyoListId) {
      console.error('Missing Klaviyo credentials');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Create or update profile in Klaviyo
    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${klaviyoPrivateKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-06-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: email,
            properties: {
              source: source,
              brand: 'Veliora Noir',
              subscription_date: new Date().toISOString(),
              presale_interest: true
            }
          }
        }
      })
    });

    let profileId;
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      profileId = profileData.data.id;
    } else {
      // Profile might already exist, try to get it
      const existingProfileResponse = await fetch(
        `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${email}")`,
        {
          headers: {
            'Authorization': `Klaviyo-API-Key ${klaviyoPrivateKey}`,
            'revision': '2024-06-15'
          }
        }
      );
      
      if (existingProfileResponse.ok) {
        const existingData = await existingProfileResponse.json();
        if (existingData.data.length > 0) {
          profileId = existingData.data[0].id;
        }
      }
    }

    if (!profileId) {
      throw new Error('Failed to create or find profile');
    }

    // Subscribe to list
    const subscriptionResponse = await fetch(
      `https://a.klaviyo.com/api/lists/${klaviyoListId}/relationships/profiles/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${klaviyoPrivateKey}`,
          'Content-Type': 'application/json',
          'revision': '2024-06-15'
        },
        body: JSON.stringify({
          data: [{
            type: 'profile',
            id: profileId
          }]
        })
      }
    );

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      console.error('Klaviyo subscription error:', errorText);
      throw new Error('Failed to subscribe to list');
    }

    // Track custom event for presale interest
    await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${klaviyoPrivateKey}`,
        'Content-Type': 'application/json',
        'revision': '2024-06-15'
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            profile: {
              email: email
            },
            metric: {
              name: 'Newsletter Signup'
            },
            properties: {
              source: source,
              brand: 'Veliora Noir',
              presale_launch: '2024-07-10',
              signup_page: 'homepage'
            },
            time: new Date().toISOString()
          }
        }
      })
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      klaviyo_profile_id: profileId
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}