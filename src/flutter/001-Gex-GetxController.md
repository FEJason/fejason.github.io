# GetxController

GetxController 是 GetX 状态管理库中的核心组件之一，用于创建控制器类来管理状态和业务逻辑。它提供了一套完整的生命周期方法，使得开发者可以方便地初始化、更新和清理资源。下面将详细介绍 GetxController 的使用方法及其生命周期方法，并通过一个具体的例子来说明如何在 Flutter 应用中使用 GetxController。

## GetxController 基础
1. 定义控制器：继承自 GetxController 类，可以在其中定义状态变量和业务逻辑。
2. 状态管理：使用 Rx（Reactive Extensions）类型的变量来创建可观察的状态，例如 RxInt, RxString, RxList 等。
3. 依赖注入：通过 Get.put() 或 Get.lazyPut() 将控制器注册到 GetX 服务容器中，以便在整个应用中共享。
4. 生命周期方法：利用提供的生命周期钩子（如 onInit, onReady, onClose）来执行初始化、准备就绪后的操作以及清理工作。

## 生命周期方法
- onInit：当控制器被实例化时调用，适合用于初始化工作。
- onReady：当页面已经渲染完成并且控制器准备好与 UI 交互时调用。
- onClose：当控制器被移除时调用，通常用来清理资源或取消订阅。

## 示例代码
假设我们正在开发一个简单的任务列表应用程序，我们将展示如何使用 GetxController 来管理任务列表的状态。

## 定义控制器
```dart
import 'package:get/get.dart';

class TaskController extends GetxController {
  // 定义一个可观察的任务列表
  final tasks = <String>[].obs;

  // 添加新任务的方法
  void addTask(String task) {
    tasks.add(task);
  }

  // 删除任务的方法
  void removeTask(int index) {
    if (index >= 0 && index < tasks.length) {
      tasks.removeAt(index);
    }
  }

  @override
  void onInit() {
    super.onInit();
    // 初始化逻辑，比如从本地存储加载任务数据
    loadTasksFromLocalStorage();
  }

  Future<void> loadTasksFromLocalStorage() async {
    // 模拟异步加载任务数据
    await Future.delayed(Duration(seconds: 1));
    // 更新任务列表（实际应用中应替换为真实的数据源）
    tasks.assignAll(['Task 1', 'Task 2', 'Task 3']);
  }

  @override
  void onClose() {
    // 清理工作，如保存任务数据到本地存储
    saveTasksToLocalStorage();
    super.onClose();
  }

  Future<void> saveTasksToLocalStorage() async {
    // 模拟保存任务数据到本地存储
    print('Saving tasks to local storage');
  }
}
```

## 在视图中使用控制器
```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'task_controller.dart'; // 导入控制器

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      home: TaskPage(),
    );
  }
}

class TaskPage extends StatelessWidget {
  final TaskController controller = Get.put(TaskController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Task List')),
      body: Column(
        children: [
          Expanded(
            child: Obx(() {
              return ListView.builder(
                itemCount: controller.tasks.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(controller.tasks[index]),
                    trailing: IconButton(
                      icon: Icon(Icons.delete),
                      onPressed: () => controller.removeTask(index),
                    ),
                  );
                },
              );
            }),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: TextEditingController(),
                    onSubmitted: (value) {
                      if (value.isNotEmpty) {
                        controller.addTask(value);
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'Add a new task',
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.add),
                  onPressed: () {
                    // 这里可以根据需要添加新的任务
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

## 关键点解释
- Rx 类型：tasks 是一个 RxList`<String>`，这意味着它是可观察的，任何对其内容的更改都会自动触发 UI 更新。
- Obx 小部件：Obx 是一个特殊的 widget，它可以监听 Rx 类型的状态变化并重建其内部的小部件树。在这个例子中，ListView.builder 被包裹在一个 Obx 中，因此每当 tasks 列表发生变化时，整个任务列表都会重新构建。
- 依赖注入：Get.put(TaskController()) 将 TaskController 注册到了 GetX 的服务容器中，这样就可以在整个应用中轻松访问这个控制器。
- 生命周期方法：onInit 和 onClose 方法分别处理了初始化和清理工作，确保了良好的资源管理。