const fs = require('fs');

async function download(name, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText + " " + url);
    const buf = await res.arrayBuffer();
    fs.writeFileSync(`public/images/hero/${name}`, Buffer.from(buf));
    console.log(`Downloaded ${name} (${Math.round(buf.byteLength / 1024)} KB)`);
  } catch (err) {
    console.error(`Failed ${name}:`, err.message);
  }
}

async function main() {
  await download('hero-2.webp', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?fm=webp&q=60&w=1200');
  await download('hero-3.webp', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?fm=webp&q=50&w=1000');
  await download('hero-4.webp', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?fm=webp&q=60&w=1200');
  
  await download('seating.webp', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0d1?fm=webp&q=60&w=800');
  await download('storage.webp', 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?fm=webp&q=60&w=800'); 
  await download('workstations.webp', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?fm=webp&q=60&w=800'); 
  await download('soft-seating.webp', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?fm=webp&q=60&w=800');
}
main();
