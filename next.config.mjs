const config = {
  async redirects() {
    return [
      { source: "/:path*.html", destination: "/:path*", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
  images: { unoptimized: true },
  // Avoid incorrect monorepo/workspace root inference during builds
  outputFileTracingRoot: process.cwd(),
}

export default config;
