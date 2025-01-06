
## 第一个应用

实现一个水平垂直居中的文本，给文本设置颜色、字体大小

入口文件 lib/main.dart

```dart
import 'package:flutter/material.dart';

// main 函数是 Dart 程序的入口点
void main() {
  // 这里的 runApp 函数用于启动应用程序并传递给它一个 Widget，该 Widget 将作为应用的根节点
  runApp(
    const Center(
      child: Text(
        'Hello Flutter!',
        textDirection: TextDirection.ltr,
        style: TextStyle(
          color: Colors.red,
          // color: Color.fromARGB(80, 80, 80, 1),
          fontSize: 20.0
        )
      ),
    ),
  );
}
```

## 使用 MaterialApp 和 Scaffold 两个组件装饰 APP

1. MaterialApp

MaterialApp 是一个方便的 Widget, 它封装了应用程序实现 Material Design 所需要的一些 Widget, 一般作为顶层 Widget 使用。

### 常用的属性
- home
- title
- color
- theme
- routes
...

2. Scaffold

Scaffold 是 Material Design 布局结构的基本实现。此类提供了用于显示 drawer、snackbar 和底部 sheet 的 API。

### 主要属性
- appBar
- body
- drawer

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('appBar'),
        ),
        body: const Center(
          child: Text(
            'Content',
            textDirection: TextDirection.ltr,
            style: TextStyle(
              color: Colors.red,
              fontSize: 20.0
            ),
          ),
        ),
      ),
    ),
  );
}
```

## Flutter 把内容单独抽离成一个组件
在 Flutter 中自定义组件其实就是一个类，这个类需要继承 StatelessWidget/StatefulWidget

- StatelessWidget 无状态组件
- StatefulWidget  有状态组件

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('appBar'),
        ),
        body: const MyApp(), // 把内容单独抽离成一个组件
      ),
    ),
  );
}

// 代码块 statelessW
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text(
        '自定义组件2',
        textDirection: TextDirection.ltr,
        style: TextStyle(
          color: Colors.red,
          fontSize: 20.0,
        ),
      ),
    );
  }
}

```

### Awesome Flutter Snippets 插件

Awesome Flutter Snippets是常用Flutter类和方法的集合。它通过创建小部件相关的大部分样板代码来提高开发速度。
通过分别键入快捷方式streamBldr和singleChildSV，可以创建StreamBuilder和SingleChildScrollView等小部件。

Shortcut |	Expanded |	Description
|---|---|---|
statelessW |	Stateless Widget |	Creates a Stateless widget
statefulW	 | Stateful Widget	| Creates a Stateful widget
build	| Build Method	| Describes the part of the user interface represented by the widget.

** 当我们不了解某个 Widget 的命名参数的时候，可以按住 Ctrl 键 + 鼠标单击查看源代码

比如 TextStyle
```dart
const TextStyle({
    this.inherit = true,
    this.color,
    this.backgroundColor,
    this.fontSize,
    this.fontWeight,
    this.fontStyle,
    this.letterSpacing,
    this.wordSpacing,
    this.textBaseline,
    this.height,
    this.leadingDistribution,
    this.locale,
    this.foreground,
    this.background,
    ...
})
```