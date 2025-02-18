# Container 容器组件
- 一个具有边框、背景、填充等特性的容器，可以包含其它 Widget

名称 | 功能
|--|--|
alignment | 子元素在容器内的对齐方式
decoration | 装饰：边框、圆角、阴影、渐变
margin | 外边距
padding | 内边距
transform | 类似 CSS 3D变化
height | 高度
width | 宽度
child | 容器子元素

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('AppBar'),
        ),
        body: Column(
          children: [
            MyApp(),
            MyButton(),
          ],
        ),
      ),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Center( // Center 不能使用 const，Container 不是常量构造函数
      child: Container(
        width: 100,
        height: 100,
        margin: EdgeInsets.fromLTRB(0, 20, 0, 0),
        alignment: Alignment.center, // 对齐
        // 装饰：圆角、渐变
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 86, 154, 255), // 背景色
          border: Border.all(
            color: Colors.yellow,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(12), // 圆角
          // 投影
          boxShadow: [
            BoxShadow(
              color: Colors.blue,
              blurRadius: 12
            )
          ],
          // 背景色圆形渐变
          // gradient: const RadialGradient(
          //   colors: [
          //     Colors.red, Colors.yellow
          //   ]
          // ),
          // 背景色线性渐变
          gradient: const LinearGradient(
            colors: [
              Colors.red, Colors.yellow
            ]
          )
        ),
        child: Text(
          'Container',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
          ),
        ),
      ),
    );
  }
}

class MyButton extends StatelessWidget {
  const MyButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      width: 200,
      height: 40,
      // transform: Matrix4.translationValues(10, 0, 0), // 位移
      // transform: Matrix4.rotationZ(0.2), // 旋转
      margin: EdgeInsets.fromLTRB(0, 20, 0, 0),
      decoration: BoxDecoration(
        color: Colors.blue,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Text(
        '确认',
        style: TextStyle(
          color: Colors.white,
          fontSize: 18
        ),
      ),
    );
  }
}
```


## Text 组件
- 显示文本的 Widget，允许你自定义字体、颜色、大小等样式

名称 | 功能
|--|--|
textAlign | 文本对齐方式
textDirection | 文本方向
overflow | 文字超出屏幕之后的处理方式
textScaleFactor | 字体显示倍率
maxLines | 文字显示最大行数
style | 字体的样式设置

style

名称 | 功能
|--|--|
decoration | 文字装饰线(none、lineThrough 删除线、overline 上划线、underline 下划线)
decorationColor | 文字装饰线颜色
decorationStyle | 文字装饰线风格([dashed, dotted] 虚线，double 两根线，solid 一根实现、wavy 波浪线)
wordSpacing | 单词间隙