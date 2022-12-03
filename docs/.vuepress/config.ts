import { defaultTheme } from 'vuepress-webpack';
import { webpackBundler } from '@vuepress/bundler-webpack';

module.exports = {
  title: 'Brisk',
  base: '/brisk/',
  description: 'Brisk系列：基于nodejs的系列库',
  theme: defaultTheme({
    // 默认主题配置
    logo: '/img/logo.svg',
    navbar: [
      { text: 'brisk-ts-extend', link: '/brisk-ts-extend/' },
      { text: 'brisk-log', link: '/brisk-log/' },
      { text: 'brisk-ioc', link: '/brisk-ioc/' },
      { text: 'brisk-controller', link: '/brisk-controller/' },
      { text: 'brisk-orm', link: '/brisk-orm/' },
      { text: 'eslint-config-brisk', link: '/eslint-config-brisk/' },
    ],

    //displayAllHeaders: true, // 默认值：false
    sidebar: {
      '/brisk-ts-extend/': [
        '/brisk-ts-extend/README.md',
        '/brisk-ts-extend/runtime.md',
        '/brisk-ts-extend/decorator.md',
      ],
      '/brisk-log/': [
        '/brisk-log/README.md',
        '/brisk-log/logger.md',
        '/brisk-log/configuration.md',
      ],
      '/eslint-config-brisk/': [
        '/eslint-config-brisk/README.md',
        '/eslint-config-brisk/ts-rules.md',
        '/eslint-config-brisk/js-rules.md',
      ],
    }
  } as any),
}
