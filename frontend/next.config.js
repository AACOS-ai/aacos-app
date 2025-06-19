/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // תמיכה ב־RTL אם יש צורך:
  i18n: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
      localeDetection: false,
  },
  // אם אתה עושה שימוש ב־images משרתים חיצוניים:
  images: {
    domains: ['your-image-domain.com'],
  },
  // הוספת env ל־Next
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // הוסף עוד משתנים כאן אם דרוש
  },
};

module.exports = nextConfig;
