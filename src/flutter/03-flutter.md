# 图片组件
Flutter 中，可以通过 Image 组件来加载并显示图片 Image 的数据源可以是 assets、文件、内存以及网络。

主要介绍两个：
1. Image.assets     本地图片
2. Image.network    远程图片

Image.network 加载远程图片
```dart
// 图片
class MyImage extends StatelessWidget {
  const MyImage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container( // 被调用的构造函数不是常量构造函数， 不能用 const。
        width: 150,
        height: 150,
        decoration: const BoxDecoration(
          color: Colors.yellow,
        ),
        child: Image.network(
          'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg',
          fit: BoxFit.cover, // 和CSS类似，指定内容应该如何适应宽高
        ),
      ),
    );
  }
}
```

Container 实现圆角图片
```dart
// Container 实现圆角图片
class CircularImage extends StatelessWidget {
  const CircularImage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      height: 150,
      decoration: BoxDecoration(
        color: Colors.yellow,
        borderRadius: BorderRadius.circular(10), // 圆角
        image: const DecorationImage(
          image: NetworkImage('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg',),
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
```

ClipOval 实现圆形图片
```dart
// ClipOval 实现圆角图片
// ClipOval 用于将子 widget 的内容裁剪为椭圆形状。这个 widget 可以用来创建圆形或椭圆形的图像、按钮等 UI 元素。
class ClipImage extends StatelessWidget {
  const ClipImage({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Image.network(
        'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg',
        width: 150,
        height: 150,
        fit: BoxFit.cover,
      ),
    );
  }
}
```

加载本地图片
```dart
// 加载本地图片
class LoaclImage extends StatelessWidget {
  const LoaclImage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      height: 150,
      decoration: const BoxDecoration(
        color: Colors.yellow,
      ),
      child: Image.asset(
        'images/ic_home_tab0_sel.png',
        // fit: BoxFit.cover,
      )
    );
  }
}
```