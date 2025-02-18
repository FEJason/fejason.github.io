# ListView
列表布局是项目中最常用的一种布局方式, Flutter中可以通过 ListView 来定义列表项,支持垂直和水平方向展示, 通过一个属性就可以控制列表的显示方向,列表有以下分类：

1. 垂直列表
2. 垂直图文列表
3. 水平列表
4. 动态列表

列表组件常用参数：

名称 | 类型 | 说明
|--|--|--|
scrollDirection | Axis | Axis.horizontal 水平列表 Axis.vertical 垂直列表
padding | EdgeInsetsGeometry | 内边距
resolve | bool | 组件反向排序
children | List | 列表元素

## 垂直列表
```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const <Widget>[
        ListTile(
          leading: Icon(Icons.home, color: Colors.red),
          title: Text('全部订单'),
          trailing: Icon(Icons.chevron_right_sharp),
        ),
        ListTile(
          leading: Icon(Icons.payment, color: Colors.green),
          title: Text('待付款'),
          trailing: Icon(Icons.chevron_right_sharp),
        ),
        ListTile(
          leading: Icon(Icons.favorite, color: Colors.lightGreen),
          title: Text('我的收藏'),
          trailing: Icon(Icons.chevron_right_sharp),
        ),
        ListTile(
          leading: Icon(Icons.chat, color: Colors.blue),
          title: Text('在线客服'),
          trailing: Icon(Icons.chevron_right_sharp),
        ),
      ],
    );
  }
}
```

## 垂直图文列表
```dart
// 图文列表
class ImageList extends StatelessWidget {
  const ImageList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
        Image.network('https://public.metahomes.net/public/test/images/image/1721825287142440962/test.jpg'),
        Container(
          alignment: Alignment.center,
          height: 44,
          child: const Text(
            '图片标题',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 20)
          )
        ),
      ],
    );
  }
}
```

## 水平列表, 可以水平滚动
```dart
// 水平列表, 可以左右滚动
class RowList extends StatefulWidget {
  const RowList({super.key});

  @override
  State<RowList> createState() => _RowListState();
}

class _RowListState extends State<RowList> {
  final List tabs = const [
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
                  child: Image.network(item['src']),
                ),
                Text(
                  item['title'],
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 14)
                ),
              ],
            ),
          );
        }).toList()
      ),
    );
  }
}
```