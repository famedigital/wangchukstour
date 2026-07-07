import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/content - Public endpoint to fetch active page content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('type'); // 'about', 'contact', 'faq', 'travel-info'

    if (!pageType) {
      return NextResponse.json({ error: 'Page type is required' }, { status: 400 });
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch (error) {
      console.error('Supabase connection error, using default content:', error);
      return NextResponse.json({
        content: getDefaultContent(pageType),
        metadata: {}
      });
    }

    // Fetch active page content
    const { data, error } = await supabase
      .from('content_pages')
      .select('content, metadata')
      .eq('page_type', pageType)
      .eq('is_active', true)
      .single();

    if (error) {
      // If no content found or any error, return default structure
      console.log('Database error or no content found, using default content:', error.message);
      return NextResponse.json({
        content: getDefaultContent(pageType),
        metadata: {}
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching public content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get default content structure
function getDefaultContent(pageType: string) {
  const defaults: Record<string, any> = {
    about: {
      hero: {
        title: 'About Us',
        subtitle: 'Discover the Last Shangri-La',
        backgroundImage: 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782911267/tigernest_paro_wdenqu.jpg'
      },
      story: {
        title: 'Our Story',
        content: 'Wangchuk Tours & Treks is your gateway to experiencing the authentic beauty of Bhutan.'
      },
      values: [
        { title: 'Authentic Experiences', description: 'Genuine cultural experiences' },
        { title: 'Sustainable Tourism', description: 'Responsible travel practices' },
        { title: 'Personalized Service', description: 'Customized journeys' },
        { title: 'Expert Local Guides', description: 'Knowledgeable Bhutanese guides' }
      ],
      statistics: [
        { number: '500+', label: 'Happy Travelers' },
        { number: '15+', label: 'Years Experience' },
        { number: '50+', label: 'Unique Tours' },
        { number: '100%', label: 'Bhutanese Owned' }
      ],
      timeline: [],
      team: []
    },
    contact: {
      hero: {
        title: 'Contact Us',
        subtitle: 'We\'re here to help you plan your perfect Bhutanese adventure',
        backgroundImage: 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg'
      },
      contactInfo: {
        email: 'info@wangchuktour.com',
        phone: '+975 17643416',
        address: 'Thimphu, Bhutan',
        whatsapp: '+97517643416'
      },
      officeHours: {
        weekdays: '9:00 AM - 6:00 PM',
        saturdays: '10:00 AM - 4:00 PM',
        sundays: 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/wangchuktours',
        instagram: 'https://instagram.com/wangchuktours'
      },
      formFields: {
        showName: true,
        showEmail: true,
        showPhone: true,
        showTravelDates: true,
        showGroupSize: true,
        showMessage: true,
        requiredFields: ['name', 'email', 'message']
      }
    },
    faq: {
      hero: {
        title: 'Frequently Asked Questions',
        subtitle: 'Find answers to common questions about traveling to Bhutan',
        backgroundImage: 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782911267/tigernest_paro_wdenqu.jpg'
      },
      categories: ['General', 'Safety', 'Preparation', 'Booking']
    },
    'travel-info': {
      hero: {
        title: 'Travel Information',
        subtitle: 'Essential tips and information for your Bhutan journey'
      },
      sections: []
    }
  };

  return defaults[pageType] || {};
}