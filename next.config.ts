import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {                     
    remotePatterns:[                          // remotePatterns is an array of objects that define the remote domains from which images are allowed to be optimized.
      {
        protocol: 'https',
        hostname: "placehold.co",
      },
      {
        protocol: 'https',
        hostname: "m.media-amazon.com",
        port: "",
      },
      {
        protocol: 'https',
        hostname: "ik.imagekit.io",
        port: "",
      }
    ],
  },
};

export default nextConfig;
