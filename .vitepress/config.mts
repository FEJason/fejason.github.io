import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  srcDir: './src',
  lastUpdated: true, // 最后更新时间
  markdown: {
    // lineNumbers: true, // 代码块启用行号
    image: {
      lazyLoading: true // 图片懒加载
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Docs',
        items: [
          { text: 'Vue', link: '/vue/minxin' },
          { text: 'Vue3', link: '/vue3/composables' },
          { text: 'React', link: '/react/react-ts-vite' },
          { text: 'Tools', link: '/tools/configure-multiple-ssh-keys' },
          { text: 'HtmlCss', link: '/htmlcss/flex' },
          { text: 'Nodejs', link: '/nodejs/updated-sitemap' },
          { text: 'Security', link: '/security/web-security' },
          { text: 'Flutter', link: '/flutter/01-flutter' }
        ]
      }
      // {
      //   text: '指南',
      //   items: [
      //     { text: 'Examples', link: '/markdown-examples' }
      //   ]
      // }
    ],
    // 根据页面路径显示不同的侧边栏
    sidebar: {
      '/tools/': [
        {
          text: '配置多个 SSH key',
          link: '/tools/configure-multiple-ssh-keys'
        },
        {
          text: '将本地代码提交到多个仓库地址',
          link: '/tools/commit-local-code-to-multiple-repository-addresses'
        },
        {
          text: '部署 VitePress 站点到 GitHub Pages',
          link: '/tools/github-pages.md'
        },
        { text: '阿里云验证码 2.0', link: '/tools/aliyun-captcha.md' },
        {
          text: '使用 Husky v9 实现提交前格式化代码',
          link: '/tools/husky-v9.md'
        },
        {
          text: 'Volta 使用手册',
          link: '/tools/volta.md'
        }
      ],
      '/vue/': [
        { text: '混入（minxin）', link: '/vue/minxin' },
        {
          text: '在多个浏览器标签或窗口之间共享某些 vuex mutations',
          link: '/vue/vuex-shared-mutations'
        }
      ],
      '/vue3/': [
        {
          text: '组件',
          items: [{ text: '依赖注入', link: '/vue3/provide-inject' }]
        },
        {
          text: '逻辑复用',
          items: [
            { text: '组合式函数', link: '/vue3/composables' },
            { text: '自定义指令', link: '/vue3/custom-directives' }
          ]
        }
      ],
      '/react': [
        { text: 'React 中类组件和函数式组件', link: '/react/react-component' },
        { text: 'React 组件通信', link: '/react/component-communication' },
        { text: 'React 引入 CSS 的方式', link: '/react/css-module' },
        { text: 'setState 执行机制', link: '/react/react-setState' }
      ],
      '/htmlcss/': [
        { text: 'Flex', link: '/htmlcss/flex' },
        { text: 'Flex 布局实例', link: '/htmlcss/flex-layout-example' }
      ],
      '/nodejs/': [
        {
          text: '删除 sitemap.xml 中状态为非200的URL链接',
          link: '/nodejs/updated-sitemap'
        },
        {
          text: '将项目国际化配置文件导出成 excel',
          link: '/nodejs/export-updated-locales'
        },
        {
          text: '根据产品校验过的 excel , 更新项目国际化',
          link: '/nodejs/update-locales'
        }
      ],
      '/security/': [
        { text: 'Web 常见安全问题', link: '/security/web-security' },
        { text: 'Xss 攻击案例', link: '/security/xss' }
      ],
      '/flutter/': [
        { text: '01-flutter', link: '/flutter/01-flutter' },
        {
          text: '02-flutter-Container、Text',
          link: '/flutter/02-flutter-Container、Text'
        },
        {
          text: '03-flutter_图片组件Image、本地图片、远程图片、图片剪切',
          link: '/flutter/03-flutter'
        },
        {
          text: '04-flutter Icon图标组件、自带图标和自定义图标',
          link: '/flutter/04-flutter'
        },
        { text: '05-flutter ListView 列表组件', link: '/flutter/05-flutter' },
        { text: '06-flutter-动态列表', link: '/flutter/06-flutter' },
        {
          text: '001-Gex-GetxController',
          link: '/flutter/001-Gex-GetxController'
        }
      ]
    },
    // 带有图标的社交帐户链接
    socialLinks: [{ icon: 'github', link: 'https://fejason.github.io/' }],
    outlineTitle: '页面导航', // 右侧导航标题
    docFooter: {
      prev: '上一页', // 上一页
      next: '下一页' // 下一页
    }
  },
  // Vite 配置选项
  vite: {
    server: {
      host: '0.0.0.0'
    }
  }
})
