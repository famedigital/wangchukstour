require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = 'sb_publishable_MqZ5yaGAk5xptfpSM1iKmg_D7TP6zeO';

console.log('Checking current hero slides...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHeroSlides() {
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('slide_order', { ascending: true });

    console.log('Hero slides found:', data ? data.length : 0);

    if (data && data.length > 0) {
      console.log('\n📊 Current Hero Slides:');
      data.forEach((slide) => {
        console.log(`\nSlide ${slide.slide_order}: ${slide.title}`);
        console.log('  Image URL:', slide.image_url);
        console.log('  Image Public ID:', slide.image_public_id);
      });
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkHeroSlides();