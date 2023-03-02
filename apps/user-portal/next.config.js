const { withTsGql } = require('@ts-gql/next');
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
module.exports = withTsGql({
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
  publicRuntimeConfig: {
    backend: process.env.BACKEND,
    stripeKey: process.env.STRIPE_KEY,
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    publicUrl: process.env.PUBLIC_URL,
    supportEmail: process.env.SUPPORT_EMAIL,
  },
  transpilePackages: ["@opensaas-clubhouse/backend"],
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:auth*',
        destination: `${process.env.BACKEND_BASE_URL}/admin/api/auth/:auth*`,
      },
      {
        source: '/admin/:admin*',
        destination: `${process.env.BACKEND_BASE_URL}/admin/:admin*`,
      },
      {
        source: '/api/stripe-webhook',
        destination: `${process.env.BACKEND_BASE_URL}/api/stripe-webhook`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pantry',
        permanent: false,
      },
    ];
  },
});
