# Flutter 内置图标
```dart
// Flutter 官方自带图标
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        children: [
          SizedBox(height: 20),
          Icon(
            Icons.home,
            size: 30,
            color: Colors.red,
          ),
          SizedBox(height: 20),
          Icon(Icons.arrow_back_ios),
          SizedBox(height: 20),
          Icon(Icons.settings),
          SizedBox(height: 20),
          Icon(Icons.help),
          SizedBox(height: 20),
          Icon(Icons.logout),
          SizedBox(height: 20),
          Icon(Icons.share),
          SizedBox(height: 20),
        ],
      ),
    );
  }
}
```

## 自定义图标
自定义图标可以使用阿里巴巴矢量图标库，项目用不上，先忽略