const fs = require('fs')
const path = require('path')

const logoComponentPath = path.join(__dirname, 'src/components/yc/Logo.tsx')
const faviconPath = path.join(__dirname, 'public/favicon.svg')

const content = fs.readFileSync(logoComponentPath, 'utf-8')

// Extract SVG inner content
const svgMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
if (svgMatch) {
    let innerSvg = svgMatch[1]
    
    // Replace React specific syntax with standard SVG
    innerSvg = innerSvg.replace(/style={{[^}]+}}/g, 'style="font-family: ArialMT, Arial; font-size: 210.5px; fill: currentColor;"')
    innerSvg = innerSvg.replace(/className={[^}]+}/g, '')
    
    const svgCode = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3604.7 2277.51">
  <style>
    @media (prefers-color-scheme: light) { svg { color: black; } }
    @media (prefers-color-scheme: dark) { svg { color: white; } }
  </style>
  ${innerSvg}
</svg>`

    fs.writeFileSync(faviconPath, svgCode)
    console.log('Successfully generated public/favicon.svg')
} else {
    console.log('Failed to extract SVG from Logo.tsx')
}
