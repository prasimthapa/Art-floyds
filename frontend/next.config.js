const { withAxiom } = await import('next-axiom');

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
        images: {
                dangerouslyAllowSVG: true,
                remotePatterns: [
                        {
                                hostname: 'aceternity.com',
                        },
                        {
                                hostname: 'us-east-1.storage.xata.sh',
                        },
                        {
                                hostname: 'lh3.googleusercontent.com',
                        },
                ],
        },
};

export default withAxiom(config);
