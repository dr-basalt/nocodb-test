/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: []
  },
  images: {
    domains: ['nocodb-iwgg808ggoko0g8co8scscs4.dr.hosting.infra.ori3com.cloud']
  }
}

module.exports = nextConfig