import { defineConfig } from 'umi';

export default defineConfig({

  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: 'http://public-api-v1.aspirantzhang.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  fastRefresh: {},
  base: '/app',
  publicPath: '/app/',
  webpack5: {},
  mfsu: {},
  dynamicImport: {},
});
