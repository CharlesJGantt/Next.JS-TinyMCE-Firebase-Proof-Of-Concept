import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  future: {
    webpack5: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), "node_modules/tinymce"),
            to: path.join(process.cwd(), "public/assets/libs/tinymce"),
          },
        ],
      })
    );
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};

export default nextConfig;
