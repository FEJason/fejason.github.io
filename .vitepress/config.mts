import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "My Awesome Project",
  description: "A VitePress Site",
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
          { text: 'Nodejs', link: '/nodejs/updated-sitemap' }
        ]
      },
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
        { text: '配置多个 SSH key', link: '/tools/configure-multiple-ssh-keys' },
        { text: '将本地代码提交到多个仓库地址', link: '/tools/commit-local-code-to-multiple-repository-addresses' },
        { text: '部署 VitePress 站点到 GitHub Pages', link: '/tools/github-pages.md'}
      ],
      '/vue/': [
        { text: '混入（minxin）' , link: '/vue/minxin' },
        { text: '在多个浏览器标签或窗口之间共享某些 vuex mutations' , link: '/vue/vuex-shared-mutations' }
      ],
      '/vue3/': [
        {
          text: '组件',
          items: [
            { text: '依赖注入', link: '/vue3/provide-inject' }
          ]
        },
        {
          text: '逻辑复用',
          items: [
            { text: '组合式函数' , link: '/vue3/composables' },
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
        { text: 'Flex' , link: '/htmlcss/flex' },
        { text: 'Flex 布局实例' , link: '/htmlcss/flex-layout-example' },
      ],
      '/nodejs/': [
        { text: '删除 sitemap.xml 中状态为非200的URL链接' , link: '/nodejs/updated-sitemap' }
      ],
    },
    // 带有图标的社交帐户链接
    socialLinks: [
      { icon: 'github', link: 'https://fejason.github.io/' }
    ],
    outlineTitle: '页面导航', // 右侧导航标题
    docFooter: {
      prev: '上一页', // 上一页
      next: '下一页'  // 下一页
    }
  },
  // Vite 配置选项
  vite: {
    server: {
      host: '0.0.0.0'
    }
  }
})
