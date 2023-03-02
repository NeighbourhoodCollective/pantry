const { withTsGql } = require('@ts-gql/next');
/** @type {import('next').NextConfig} */
module.exports = withTsGql({
  publicRuntimeConfig: {
    backend: process.env.BACKEND,
    stripeKey: process.env.STRIPE_KEY,
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    publicUrl: process.env.PUBLIC_URL,
    supportEmail: process.env.SUPPORT_EMAIL,
  },
  experimental: {
    scrollRestoration: true,
    appDir: true,
    serverComponentsExternalPackages: ['graphql'],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:auth*',
        destination: `${process.env.BACKEND_BASE_URL}/admin/api/auth/:auth*`,
      },
      {
        source: '/api/graphql',
        destination: `${process.env.BACKEND_BASE_URL}/api/graphql`,
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
