import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Evita que o Next escolha um lockfile de nível superior como raiz do workspace.
  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;
