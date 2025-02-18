# 动态列表

## 使用 For 循环生成动态列表

```dart
class RowList extends StatefulWidget {
  const RowList({super.key});

  @override
  State<RowList> createState() => _RowListState();
}

class _RowListState extends State<RowList> {
  final List<Map<String, String>> tabs = const [
    { 'title': '图片标题1', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题2', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题3', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题4', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
  ];

  List<Widget> _initListData() {
    List<Widget> list = [];

    for(var i = 0; i < tabs.length; i++) {
      list.add(
        Container(
          width: 120, // 垂直列表, 宽度百分百
          height: 120, // 水平列表, 高度百分百
          margin: const EdgeInsets.only(right: 10.0),
          child: Column(
            children: [
              SizedBox(
                height: 90,
                child: Image.network(tabs[i]['src']!),
              ),
              Text(
                tabs[i]['title']!,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14)
              ),
            ],
          ),
        )
      );
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120, // 控制水平列表高度
      child: ListView(
        scrollDirection: Axis.horizontal, // 水平列表
        children: _initListData(),
      ),
    );
  }
}
```

## 使用 map 实现动态列表

```dart
class RowList extends StatefulWidget {
  const RowList({super.key});

  @override
  State<RowList> createState() => _RowListState();
}

class _RowListState extends State<RowList> {
  final List<Map<String, String>> tabs = const [
    { 'title': '图片标题1', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题2', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题3', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题4', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120, // 控制水平列表高度
      child: ListView(
        scrollDirection: Axis.horizontal, // 水平列表
        children: tabs.map((item) {
          return Container(
            width: 120, // 垂直列表, 宽度百分百
            height: 120, // 水平列表, 高度百分百
            margin: const EdgeInsets.only(right: 10.0),
            child: Column(
              children: [
                SizedBox(
                  height: 90,
                  child: Image.network(item['src']!),
                ),
                Text(
                  item['title']!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 14)
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
```

## 使用 ListView.builder 实现动态列表

```dart
class RowList extends StatefulWidget {
  const RowList({super.key});

  @override
  State<RowList> createState() => _RowListState();
}

class _RowListState extends State<RowList> {
  final List<Map<String, String>> tabs = const [
    { 'title': '图片标题1', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题2', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题3', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
    { 'title': '图片标题4', 'src': 'https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg' },
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: tabs.length,
      itemBuilder: (_, index) => Container(
        width: 120, // 垂直列表, 宽度百分百
        height: 220, // 水平列表, 高度百分百
        margin: const EdgeInsets.only(right: 10.0),
        child: Column(
          children: [
            SizedBox(
              height: 90,
              child: Image.network(tabs[index]['src']!),
            ),
            Text(
              tabs[index]['title']!,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 14)
            ),
          ],
        ),
      ),
    );
  }
}
```