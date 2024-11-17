/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // todo: be secure here, it's fine for now.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async headers() {
        return {
            source: "/(.*)",
            headers: [
                {
                    key: "Strict-Transport-Security",
                    value: "max-age=31536000; includeSubDomains; preload",
                },
                {
                    key: "X-Frame-Options",
                    value: "DENY",
                },
                {
                    key: "X-Content-Type-Options",
                    value: "nosniff",
                },
                {
                    key: "Referrer-Policy",
                    value: "strict-origin-when-cross-origin",
                },
            ],
        };
    }
};

export default nextConfig;
