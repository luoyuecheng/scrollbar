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

### Javascript

克隆目录，并执行`npm install`安装`typescript`再用`npm run tsc`命令编译。将生成的`build`目录中的`Scrollbar`目录复制到项目中。

### Previre

![Preview](./scrollbar.png)
