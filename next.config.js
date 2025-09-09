const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Производительность и компиляция
  poweredByHeader: false,

  // Разрешенные источники для разработки (исправляет CORS предупреждения)
  allowedDevOrigins: [
    '3000-fcwbrntpkvqespbvkcwefbrgacdczhrl.preview.same-app.com',
    '*.same-app.com'
  ],

  // Экспериментальные настройки для оптимизации
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Оптимизация webpack
  webpack: (config, { dev, isServer }) => {
    // Аудио файлы
    config.module.rules.push({
      test: /\.(mp3|wav)$/,
      type: 'asset/resource',
    });

    // Оптимизация для продакшена
    if (!dev && !isServer) {
      // Удаление console.log в продакшене
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((minimizer) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.minimizer = {
              compress: {
                drop_console: true,
              },
            };
          }
        });
      }

      // Split chunks оптимизация
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 20,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }

    return config;
  },

  // Настройки для статического экспорта
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  distDir: process.env.STATIC_EXPORT === 'true' ? 'out' : '.next',
  trailingSlash: true,

  // Оптимизация изображений
  images: {
    unoptimized: true,
    domains: ['localhost', 'raw.githubusercontent.com', 'images.unsplash.com', 'ugc.same-assets.com'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ugc.same-assets.com',
      }
    ],
  },

  // Compression и кэширование
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Компрессия для статического экспорта
  compress: true,
}

module.exports = withBundleAnalyzer(nextConfig)
