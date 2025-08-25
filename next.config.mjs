export default {
  async redirects() {
    return [
      { source: "/:path*.html", destination: "/:path*", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
  images: { unoptimized: true },
  output: "export",
};
