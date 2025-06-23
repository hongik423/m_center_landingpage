import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: isGitHubPages,
  ...(isGitHubPages && { distDir: 'out' }),
  images: {
    unoptimized: isGitHubPages,
  },
  basePath: isGitHubPages ? '/m_center_landingpage' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/m_center_landingpage' : '',
  },
  eslint: {
    ignoreDuringBuilds: isGitHubPages,
  },
  typescript: {
    ignoreBuildErrors: isGitHubPages,
  },
};

export default nextConfig;
