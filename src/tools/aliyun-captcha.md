# 阿里云验证码 2.0

## 什么是验证码 2.0

验证码 2.0 是阿里云推出的新一代验证码产品，广泛地应用在账号注册、短信发送、票务预订、信息查询、免费下载、论坛发帖、在线投票等交互模块，通过简单、安全、多样的交互逻辑，提供区分机器脚本和自然人的验证服务，能够缓解及防止计算机程序模拟人类用户来滥用网络资源，在提升网站资源不被恶意程序访问的防御能力的同时，保持真实的用户体验。

## 产品优势

相比较验证码 1.0 版本，验证码 2.0 具有如下优势：

All in One：一次集成无需更新代码，自动迭代攻防能力和验证码形态。

支持行为和语义多种验证码形态：从推理逻辑、设备数据、交互行为模型等多维度完成立体防护。

个性化配置：支持 Web、H5、iOS、Android 和微信小程序的多客户端接入。

完善的容灾方案：保障业务 99.99%高可用。

最大的特点：必须通过调用服务端接口才能知道选择的图形是否正确, 在 1.0 是不需要调用后端接口的。

## Web 和 H5 客户端接入

官方 Demo

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="data-spm" />
    <!--1.在引入阿里云验证码JS脚本的位置之前，或者在html的head标签最前的位置添加一个script脚本，里面保存一个含有region和prefix参数的全局变量AliyunCaptchaConfig即可-->
    <script>
      window.AliyunCaptchaConfig = {
        // 必填，验证码示例所属地区，支持中国内地（cn）、新加坡（sgp）
        region: "cn",
        // 必填，身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
        prefix: "xxxxxx",
      };
    </script>
    <!--2.集成主JS-->
    <script
      type="text/javascript"
      src="https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js"
    ></script>
  </head>

  <body>
    <!-- 预留的验证码页面元素，用于配置初始化函数中的element参数 -->
    <div id="captcha-element"></div>
    <button id="button" class="login-btn">登录</button>

    <!--3.新建一个<script>标签，用于调用验证码初始化函数initAliyunCaptcha-->
    <script type="text/javascript">
      var captcha;
      // 弹出式，除region和prefix以外的参数
      window.initAliyunCaptcha({
          // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
          SceneId: 'c9h3****',
          // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
          mode: 'popup',
          // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
          element: '#captcha-element',
          // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
          button: '#button',
          // 业务请求(带验证码校验)回调函数，无需修改
          captchaVerifyCallback: captchaVerifyCallback,
          // 业务请求结果回调函数，无需修改
          onBizResultCallback: onBizResultCallback,
          // 绑定验证码实例函数，无需修改
          getInstance: getInstance,
          // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
          slideStyle: {
              width: 360,
              height: 40,
          },
          // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
          language: 'cn',
      });
      // 获取实例
      function getInstance(instance) {
          captcha = instance
      }
      function captchaVerifyCallback(captchaVerifyParam) {
        // 1.向后端发起业务请求，获取验证码验证结果和业务结果
        // const result = await xxxx('http://您的业务请求地址', {
        //     captchaVerifyParam: captchaVerifyParam, // 验证码参数
        //     yourBizParam... // 业务参数
        // });
        // return {
        //  captchaResult: true, // 验证码验证是否通过，boolean类型，必选
        //  bizResult: true, // 业务验证是否通过，boolean类型，可选；若为无业务验证结果的场景，bizResult可以为空
        // }
        console.log(captchaVerifyParam);
        return {
            captchaResult: true,
            bizResult: true,
        }
      }

      // 业务请求验证结果回调函数
      function onBizResultCallback(bizResult) {
          if (bizResult === true) {
              // 如果业务验证通过，跳转到对应页面。此处以跳转到https://www.aliyun.com/页面为例
              window.location.href = 'https://www.aliyun.com/';
          } else {
              // 如果业务验证不通过，给出不通过提示。此处不通过提示为业务验证不通过！
              alert('业务验证不通过！');
          }
      }
    </script>
  </body>
</html>
```

通过以上官方Demo, 我们需要思考, 在项目中如何封装使用？
1. 封装组件, 需要传递一个回调钩子供子组件调用（类似 element 的 upload 组件中的 before-upload 上传文件之前的钩子，若返回 false 或者返回 Promise 且被 reject，则停止上传。）
2. 定义一个效验验证码的方法
  - 弹出验证码弹窗
  - 返回 Promise（是否验证通过）

```vue
<template>
  <!-- 验证码渲染区域 -->
  <div :id="elementId"></div>
  <!-- 设置一个隐藏元素 -->
  <!-- <div id="captcha-button" style="display: none;"></div> -->
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import useUserStore from '@/store/modules/user'
const user = useUserStore()
const { lang } = storeToRefs(user)

const props = defineProps({
  // 验证码场景ID
  sceneId: {
    type: String,
    default: 'b48q584b'
  },
  // 验证码身份标识
  prefix: {
    type: String,
    default: 'cl48k0'
  },
  // 效验验证码钩子, 参数为captchaVerifyParam, 返回 Promise
  onCallback: {
    type: Function,
    required: true
  }
})

// 加载阿里云验证码脚本
const loadScript = () => {
  if (document.getElementById('aliyun-captcha-config') === null) {
    // 在加载阿里云验证码脚本之前，插入自定义脚本
    const configScript = document.createElement('script')
    configScript.id = 'aliyun-captcha-config'
    configScript.textContent = `
      window.AliyunCaptchaConfig = {
        region: '${lang.value.includes('zh') ? 'cn' : 'sgp'}',
        prefix: '${props.prefix}'
      }
    `
    document.head.insertBefore(configScript, document.head.firstChild)
  }

  if (document.getElementById('aliyun-captcha') === null) {
    const script = document.createElement('script')
    script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'
    script.id = 'aliyun-captcha'
    script.onload = () => {
      initCaptcha()
    }
    script.onerror = () => {
      console.error('阿里验证码脚本加载失败')
    }
    document.head.appendChild(script)
  }

  if (window.initAliyunCaptcha) {
    initCaptcha()
  }
}

// 给验证码渲染区域一个随机ID
const elementId = ref('')
elementId.value = 'captcha-mount-' + Math.random().toString(36).slice(2, 9)

// 初始化验证码
const initCaptcha = () => {
  window.initAliyunCaptcha({
    SceneId: props.sceneId,
    mode: 'popup',
    element: `#${elementId.value}`,
    // button: '#captcha-button'
    button: null,
    captchaVerifyCallback: captchaVerifyCallback,
    onBizResultCallback: onBizResultCallback,
    getInstance: instance => {
      window.captcha = instance
    },
    slideStyle: {
      width: 360,
      height: 40
    },
    language: lang.value.includes('zh')
      ? 'cn'
      : lang.value.includes('ar')
      ? 'ar'
      : 'en'
  })
}

// 销毁验证码
const destroyCaptcha = () => {
  window.captcha = null
  document.getElementById('aliyunCaptcha-mask')?.remove()
  document.getElementById('aliyunCaptcha-window-popup')?.remove()
}

// 效验验证码, 返回 Promise
let promiseStatus = null
const validateCaptcha = () => {
  window.captcha?.show() // 调用实例方法触发验证码弹窗(配置 button: null)

  // 触发button元素的点击事件，触发验证码弹窗(需要配置 button: '#captcha-button')
  // document.getElementById('captcha-button').click()

  return new Promise((resolve, reject) => {
    promiseStatus = { resolve, reject }
  })
}

// 验证码回调函数
const captchaVerifyCallback = async captchaVerifyParam => {
  try {
    await props.onCallback(captchaVerifyParam)
    return {
      captchaResult: true,
      bizResult: true
    }
  } catch (error) {
    return {
      captchaResult: false,
      bizResult: false
    }
  }
}

// 业务结果回调函数
const onBizResultCallback = bizResult => {
  if (bizResult) {
    promiseStatus.resolve()
    window.captcha?.refresh()
  } else {
    promiseStatus.reject()
  }
}

onMounted(() => {
  loadScript()
})

onBeforeUnmount(() => {
  destroyCaptcha()
})

defineExpose({
  validateCaptcha
})
</script>

```

遇到的问题：
- 阿里云验证码2.0不支持单个页面注册多个验证码实例，多次调用初始化方法会重复添加元素和注册事件，造成验证表现异常（只有一个实例生效）。
- 一个页面有多处用到验证码怎么处理？ 官方文档没有说明, 最后在常见问题找到说明。

  - 方法1：使用弹出式模式（popup），将传入initAliyunCaptcha方法的button元素设置为一个隐藏元素，然后在需要触发验证码的元素上绑定相关事件（一般为点击事件），在事件回调函数中用JavaScript触发上述button元素的点击事件，即可触发验证码弹窗，整个页面共享一个验证码实例。

  - 方法2：将验证码封装为一个组件，在需要调用的地方使用，初始化相关参数可作为props传入，验证流程完毕后需要将验证码组件卸载（从dom中移除）。

```vue
<script setup>

const loadScript = () => {
  
  // 全局使用一个实例
  + if (window.captcha) {
  +  return
  + }

  if (window.initAliyunCaptcha) {
    initCaptcha()
  }
}

</script>
```

父组件使用：

```vue
<template>
  <el-button link @click="handleGetCode">
    {{ sendcodeValue }}
  </el-button>

  <AliyunCaptcha ref="captchaRef" :on-callback="handleCallback" />
</template>

<script setup>

const captchaRef = ref(null)

// 效验验证码钩子
const handleCallback = (captchaVerifyParam) => {
  if (tabIndex.value === 0) {
    return sendEmailCode({
      email: emailForm.email,
      type: 2, 
      data: captchaVerifyParam
    })
  } else {
    return sendSmsCode({
      phoneCode: phoneForm.phoneCode,
      phone: phoneForm.phone,
      type: 2,
      data: captchaVerifyParam
    })
  }
}

// 获取验证码
const handleGetCode = async () => {
  // 效验验证码
  await captchaRef.value.validateCaptcha()

  // 效验成功, 后续操作(倒计时...)
  countDown(60)
}

</script>

```

