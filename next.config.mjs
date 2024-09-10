/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "assets-cdn.trustwallet.com",
            port: "",
            pathname: "/**"
          },
          {
            protocol: "https",
            hostname: "raw.githubusercontent.com",
            port: "",
            pathname: "/trustwallet/assets/**"
          },
          {
            protocol: "https",
            hostname: "tokens-data.1inch.io",
            port: "",
            pathname: "/**"
          },
          {
            protocol: "https",
            hostname: "coin-images.coingecko.com",
            port: "",
            pathname: "/**"
          },
        ]
      },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
