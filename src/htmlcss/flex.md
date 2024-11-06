# Flex

## Flex 是什么？

Flex 是 Flexible Box 的缩写，意为“弹性布局”，是一种高效且灵活的布局方式，可以轻松地实现复杂的布局。

任何一个容器都可以指定为 Flex 布局。

```css
.box {
  display: flex;
}
```

行内元素也可以使用 Flex 布局。

```css
.box {
  display: inline-flex;
}
```
`inline-flex` 会保留行内元素的特性，比如在父元素设置文本水平居中，该元素会居中对齐。

注意：设为 Flex 布局以后，子元素的 `float`、`clear`、`vertical-align`属性将失效。

## Flex 容器基本概念

为了创建 flex 容器，我们把一个容器的 `display` 属性值改为 `flex` 或者 `inline-flex`。完成这一步之后，容器中的直系子元素会变为**flex元素**。

容器默认存在两根轴：水平的主轴(main axis)和垂直的交叉轴(cross axis)。

flex 元素默认沿主轴排列。

## 容器的属性

以下6个属性设置在容器上。

- flex-direction  
- flex-wrap       
- flex-flow       
- justify-content
- align-items
- align-content

### flex-direction

`flex-direction` 属性定义了主轴的方向，即内部元素的排列方向

```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

它主要有4个值：

- row（默认值）：主轴为水平方向，内部元素从左右排列。
- row-reverse：主轴为水平方向，内部元素从右往左排列。
- column：主轴为垂直方向，内容元素从上往下排列。
- column-reverse：主轴为垂直方向，内容元素从下往上排列。

### flex-wrap

`flex-wrap` 属性指定 flex 元素单行显示还是多行显示。

```css
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

它主要有3个值：

- nowrap（默认值）：不换行，flex 元素被摆放到到一行，这可能导致 flex 容器溢出。
- wrap：换行，第一行在上方。
- wrap-reverse：换行，第一行在下方。

### flex-flow

`flex-flow` 属性是 `flex-direction` 和 `flex-wrap` 的简写。默认值为`row` `nowrap`。

```css
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

### justify-content

`justify-content` 属性定义 flex 元素在主轴的对齐方式。主轴方向是通过 flex-direction 设置的方向。

```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

它主要有5个值：

- flex-start（默认值）：主轴起点对齐
- flex-end：主轴终点对齐
- center： 主轴居中对齐
- space-between：两端对齐，项目之间的间隔都相等
- space-around：每个元素的左右空间相等。所以，项目之间的间隔比项目与边框的间隔大一倍
- space-evenly：每个元素之间的间隔相等

### align-items

`align-items` 属性定义 flex 元素在交叉轴的排列方式。

```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

它主要有5个值：

- flex-start：交叉轴的起点对齐。
- flex-end：交叉轴的终点对齐。
- center：交叉轴的中点对齐。
- stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

### align-content

`align-content` 属性定义了多根轴线的对齐方式。如果 Flex 元素只有一根轴线，该属性不起作用。

它主要有6个值。

- flex-start：与交叉轴的起点对齐。
- flex-end：与交叉轴的终点对齐。
- center：与交叉轴的中点对齐。
- space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
- space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
- stretch（默认值）：轴线占满整个交叉轴。

## Flex 元素的属性

以下6个属性设置在 Flex 元素上。

- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self

### order

`order` 属性规定了弹性容器中的 Flex 元素在布局时的顺序，按照 order 属性的值的增序进行布局。默认为 0

```css
.item {
  order: <integer>;
}
```

### flex-grow

`flex-grow` 属性定义 Flex 元素的放大比例，默认为0。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

### flex-shrink

`flex-shrink` 属性定义 Flex 元素的缩小比例，默认为1。

#### flex-basis
`flex-basis` 指定了 flex 元素在主轴方向上的初始大小。

### flex

`flex` 属性是 `flex-grow`，`flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`。后两个属性可选。

```css
.item {
  flex: none;
}
```

该属性有两个快捷值：`auto` `(1 2 auto)` 和 `none` `(0 0 auto)`。

### align-self

`align-self`属性允许单个 Flex 元素有与其它元素不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```