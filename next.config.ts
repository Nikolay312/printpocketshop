const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // existing config (unchanged)
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
});
