/**
 * Image Optimization Script
 * Converts PNG images to optimized WebP format
 *
 * Usage: node scripts/optimize-images.js
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function optimizeImage(inputPath, outputPath, quality = 80) {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Input file not found: ${inputPath}`)
      return
    }

    // Get original file size
    const originalSize = fs.statSync(inputPath).size

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality, effort: 6 }) // effort 6 = good balance between size and speed
      .toFile(outputPath)

    // Get optimized file size
    const optimizedSize = fs.statSync(outputPath).size
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1)

    console.log(
      `✅ ${path.basename(inputPath)}: ` +
      `${(originalSize / 1024).toFixed(0)} KB → ` +
      `${(optimizedSize / 1024).toFixed(0)} KB ` +
      `(-${savings}%)`
    )

    return { originalSize, optimizedSize, savings }
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message)
  }
}

async function main() {
  console.log('🖼️  Image Optimization Starting...\n')

  const publicDir = path.join(__dirname, '..', 'public')

  const images = [
    {
      input: path.join(publicDir, 'screenshot.png'),
      output: path.join(publicDir, 'screenshot.webp'),
      quality: 85, // Higher quality for product screenshots
    },
    {
      input: path.join(publicDir, 'og-image.png'),
      output: path.join(publicDir, 'og-image.webp'),
      quality: 90, // High quality for social media
    },
    {
      input: path.join(publicDir, 'twitter-image.png'),
      output: path.join(publicDir, 'twitter-image.webp'),
      quality: 90, // High quality for social media
    },
    {
      input: path.join(publicDir, 'unicorn-example.png'),
      output: path.join(publicDir, 'unicorn-example.webp'),
      quality: 85,
    },
    {
      input: path.join(publicDir, 'unicorn-logo.png'),
      output: path.join(publicDir, 'unicorn-logo.webp'),
      quality: 90,
    },
    {
      input: path.join(publicDir, 'r-logo.png'),
      output: path.join(publicDir, 'r-logo.webp'),
      quality: 90, // Logo needs high quality
    },
  ]

  let totalOriginal = 0
  let totalOptimized = 0

  for (const img of images) {
    const result = await optimizeImage(img.input, img.output, img.quality)
    if (result) {
      totalOriginal += result.originalSize
      totalOptimized += result.optimizedSize
    }
  }

  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1)

  console.log('\n📊 Summary:')
  console.log(`   Original:  ${(totalOriginal / 1024).toFixed(0)} KB`)
  console.log(`   Optimized: ${(totalOptimized / 1024).toFixed(0)} KB`)
  console.log(`   Savings:   -${totalSavings}%`)
  console.log('\n✨ Optimization complete!')
  console.log('\n⚠️  Next steps:')
  console.log('   1. Update image references in index.html (.png → .webp)')
  console.log('   2. Update JSON-LD structured data')
  console.log('   3. Test social media preview images')
  console.log('   4. Consider adding WebP with PNG fallback for better browser support')
}

// Check if sharp is installed
try {
  require.resolve('sharp')
  main()
} catch (error) {
  console.error('❌ sharp is not installed!')
  console.error('   Run: npm install --save-dev sharp')
  process.exit(1)
}
