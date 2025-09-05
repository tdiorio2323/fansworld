/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers(){return[
    {source:"/(.*)",headers:[
      {key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains; preload"},
      {key:"X-Content-Type-Options",value:"nosniff"},
      {key:"X-Frame-Options",value:"SAMEORIGIN"},
      {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
      {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"}
    ]},
    {source:"/:all*(js|css|png|jpg|jpeg|webp|avif|svg|woff2)",
     headers:[{key:"Cache-Control",value:"public, max-age=31536000, immutable"}]}
  ]}
};

export default nextConfig;
