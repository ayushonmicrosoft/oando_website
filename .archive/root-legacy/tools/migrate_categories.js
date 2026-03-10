import { supabase } from './lib/db';

async function migrate() {
    console.log('Starting migration...');

    // 1. Create new categories
    const newCategories = [
        { id: 'chairs', name: 'Chairs', description: 'Task, executive, and visitor chairs' },
        { id: 'other-seating', name: 'Other Seating', description: 'Conference, guest, and stool seating' }
    ];

    for (const cat of newCategories) {
        const { error } = await supabase.from('categories').upsert(cat);
        if (error) console.error(`Error inserting category ${cat.id}:`, error.message);
        else console.log(`Category ${cat.id} ensured.`);
    }

    // 2. Move products to 'chairs'
    const { data: chairsUpdated, error: chairsError } = await supabase
        .from('products')
        .update({ category_id: 'chairs', category: 'chairs' })
        .or('name.ilike.%task%,name.ilike.%executive%,name.ilike.%fluid%,name.ilike.%visitor%,name.ilike.%arvo%,name.ilike.%sway%,name.ilike.%halo%,name.ilike.%myel%')
        .eq('category_id', 'seating');

    // Also catch any that might have old oando-seating ID
    await supabase
        .from('products')
        .update({ category_id: 'chairs', category: 'chairs' })
        .or('name.ilike.%task%,name.ilike.%executive%,name.ilike.%fluid%,name.ilike.%visitor%,name.ilike.%arvo%,name.ilike.%sway%,name.ilike.%halo%,name.ilike.%myel%')
        .eq('category_id', 'oando-seating');

    if (chairsError) console.error('Error updating chairs:', chairsError.message);
    else console.log('Chairs updated.');

    // 3. Move products to 'other-seating'
    const { data: othersUpdated, error: othersError } = await supabase
        .from('products')
        .update({ category_id: 'other-seating', category: 'other-seating' })
        .or('name.ilike.%conference%,name.ilike.%guest%,name.ilike.%stool%,name.ilike.%cafe%,name.ilike.%sleek%,name.ilike.%training%,name.ilike.%flip%,name.ilike.%crox%,name.ilike.%nordic%')
        .eq('category_id', 'seating');

    await supabase
        .from('products')
        .update({ category_id: 'other-seating', category: 'other-seating' })
        .or('name.ilike.%conference%,name.ilike.%guest%,name.ilike.%stool%,name.ilike.%cafe%,name.ilike.%sleek%,name.ilike.%training%,name.ilike.%flip%,name.ilike.%crox%,name.ilike.%nordic%')
        .eq('category_id', 'oando-seating');

    if (othersError) console.error('Error updating other seating:', othersError.message);
    else console.log('Other seating updated.');

    console.log('Migration complete.');
}

migrate();
