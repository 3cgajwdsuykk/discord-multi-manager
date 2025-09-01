/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['discord.js', 'ws', 'opus', 'sodium', 'libsodium-wrappers', 'prism-media', 'ffmpeg-static']
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
  // Vercel deployment optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig
