# Scrollbar

React 项目的滚动条，隐藏浏览器原生滚动条样式，如果内容超过宽高，在鼠标移入时显示滚动条。

### Dependencies

> classnames@^2.2.6

### Usage

```Javascript
import Scrollbar from './Scrollbar';

<div style="width: 500px; height: 500px;">
  <Scrollbar>
    <div style="width: 1000px; height: 1000px;">Content</div>
  </Scrollbar>
</div>
```

### Previre

![Preview](./scrollbar.png)
