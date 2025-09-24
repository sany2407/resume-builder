import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('pdf-parse');
    }
    return config;
  },
  // React 19 compatibility configurations
  experimental: {
    // Add other experimental features here if needed
  },
  // Add custom webpack configuration for React 19 compatibility
  env: {
    REACT_19_COMPAT: 'true',
  },
};

export default nextConfig;
