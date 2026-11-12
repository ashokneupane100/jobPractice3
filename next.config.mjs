import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  outputFileTracingRoot: projectRoot,
  // NOTE: `experimental.agentFeedback` and `partialPrefetching` are not
  // supported by Next 16.1.6 (build warns "Unrecognized key(s)"). Removed so
  // production builds are clean. `cacheComponents` is the supported flag.
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
