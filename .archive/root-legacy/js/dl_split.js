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
  // ergomonic task chair
  await download('chairs.webp', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0d1?fm=webp&q=60&w=800');
  // conference guest chair
  await download('other-seating.webp', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?fm=webp&q=60&w=800'); 
}
main();
