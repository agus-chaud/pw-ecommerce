/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Caché del optimizador en producción (segundos). SVG se sirve sin optimizar desde componentes.
    minimumCacheTTL: 86_400,
  },
};

export default nextConfig;
