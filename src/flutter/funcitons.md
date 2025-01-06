# 函数

Dart 函数是 Dart 编程语言中用于组织和封装代码的一种重要工具。函数可以用来实现代码复用、模块化和逻辑封装。

## 1. 基本语法

### 定义函数
```dart
返回类型 函数名(参数列表) {
  // 函数体
  return 返回值; 可选 
}
```

### 示例
```dart
int add(int a, int b) {
  return a + b;
}
```

### 调用函数
```dart
// void：表示该值不被使用。通常用作返回类型。
void main() {
  int result = add(3, 5);
  print(result);
}
```

## 2. 可选的返回类型
Dart 的函数可以显式声明返回类型，也可以省略返回类型（默认为 dynamic）。

### 示例
```dart
foo() {
  return 'Hello, Jason!';
}
```

## 3. 参数类型
### 必选参数
定义和调用时都必须提供的参数。

```dart
int multiply(int a, int b) {
  return a *  b;
}
```

### 可选参数
Dart 提供两种可选参数形式：

#### 位置可选参数（用方括号）

```dart
String greet(String name, [String? title]) {
  return title != null ? "$title $name" : "Hello, $name"
}

void main() {
  print(greet("Jason")); // 输出: Hello, Jason
  print(greet("Jason", "Ms.")); // 输出: Ms., Jason
}
```

#### 命名可选参数（用大括号）
参数可以指定默认值。

```dart
String greet({required String name, String title = "Ms./Ms."}) {
  return "$title $name";
}

void main() {
  print(greet(name, "Jason")); // 输出: Ms./Ms. Jason
  print(greet(name: "Jason", title: "Dr.")); // 输出: Dr. Jason
}
```