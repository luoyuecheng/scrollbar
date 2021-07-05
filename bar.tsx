import React from 'react';
import classNames from 'classnames';
import { BAR_MAP, BarProps } from './utils';
import styles from './Scrollbar.less';

export default class Bar extends React.Component<BarProps> {
  bar: React.RefObject<HTMLDivElement>;
  thumb: React.RefObject<HTMLDivElement>;

  thumbInfo: { top: number; left: number };
  mouseInfo: { screenX: number; screenY: number; };

  constructor(props: BarProps) {
    super(props);

    this.bar = React.createRef<HTMLDivElement>();
    this.thumb = React.createRef<HTMLDivElement>();

    // thumb position
    this.thumbInfo = { top: 0, left: 0 };
    // Mouse position
    this.mouseInfo = { screenX: 0, screenY: 0 };
  }

  shouldComponentUpdate(nextProps: BarProps) {
    // if (this.state !== nextState) return true;

    if (this.props.width !== nextProps.width) return true;
    if (this.props.height !== nextProps.height) return true;
    if (this.props.wrapper !== nextProps.wrapper) return true;

    return false;
  }

  componentDidMount() {
    if (this.props.wrapper) {
      this.listenerScroll();
    }
  }

  componentDidUpdate(prevProps: BarProps) {
    if (this.props.wrapper && this.props.wrapper !== prevProps.wrapper) {
      this.listenerScroll();
    }
  }

  componentWillUnmount() {
    if (this.props.wrapper === null) return;

    this.props.wrapper.removeEventListener('scroll', this.handleScroll);
  }

  listenerScroll = () => {
    if (this.props.wrapper === null) return;

    this.props.wrapper.removeEventListener('scroll', this.handleScroll);
    this.props.wrapper.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event: Event): void => {
    if (this.bar.current === null || this.thumb.current === null) return;

    const {
      scrollTop,
      scrollHeight,
      scrollLeft,
      scrollWidth
    } = event.target as HTMLDivElement;
    const barStyle: CSSStyleDeclaration = window.getComputedStyle(this.bar.current, null);
    const thumbStyle: CSSStyleDeclaration = window.getComputedStyle(this.thumb.current, null);
    const barHeight = parseFloat(barStyle.height);
    const barWidth = parseFloat(barStyle.width);
    const thumbHeight = thumbStyle.height.endsWith('%') ? parseFloat(thumbStyle.height) / 100 * barHeight : parseFloat(thumbStyle.height);
    const thumbWidth = thumbStyle.width.endsWith('%') ? parseFloat(thumbStyle.width) / 100 * barWidth : parseFloat(thumbStyle.width);

    let top = Math.round(scrollTop / scrollHeight * barHeight * 100) / 100;
    let left = Math.round(scrollLeft / scrollWidth * barWidth * 100) / 100;

    const maxTop = barHeight - thumbHeight;
    const maxLeft = barWidth - thumbWidth;

    top = top < 0 ? 0 : top > maxTop ? maxTop : top;
    left = left < 0 ? 0 : left > maxLeft ? maxLeft : left;

    switch (this.props.type) {
      case 'horizontal':
        // this.thumb.style.transform = 'translateX(' + event.target.scrollLeft + 'px)';
        // this.thumb.style.left = event.target.scrollLeft + 'px';
        this.thumb.current.style.left = left + 'px';
        break;

      case 'vertical':
        // this.thumb.style.transform = 'translateY(' + event.target.scrollTop + 'px)';
        // this.thumb.style.top = event.target.scrollTop + 'px';
        this.thumb.current.style.top = top + 'px';
        break;
      default:
    }
  }

  handleMousedown = (event: React.MouseEvent): void => {
    event.persist();
    if (this.thumb.current === null || this.bar.current === null) return;

    const thumbStyle = window.getComputedStyle(this.thumb.current, null);

    this.mouseInfo = {
      screenX: event.screenX,
      screenY: event.screenY
    };

    this.thumbInfo = {
      top: parseFloat(thumbStyle.getPropertyValue('top')),
      left: parseFloat(thumbStyle.getPropertyValue('left'))
    };

    this.bar.current.style.display = 'block';

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseup);
    document.addEventListener('mouseup', this.handleMouseup);
  }

  handleMouseup = () => {
    if (this.bar.current === null) return;

    this.bar.current.style.display = '';

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseup);
    this.mouseInfo = { screenX: 0, screenY: 0 };
    this.thumbInfo = { top: 0, left: 0 };
  }

  handleMouseMove = (event: MouseEvent) => {
    if (this.props.wrapper === null || this.bar.current === null || this.thumb.current === null) return;

    const { type } = this.props;

    let left = event.screenX - this.mouseInfo.screenX + this.thumbInfo.left;
    let top = event.screenY - this.mouseInfo.screenY + this.thumbInfo.top;

    const barStyle: CSSStyleDeclaration = window.getComputedStyle(this.bar.current, null);
    const thumbStyle: CSSStyleDeclaration = window.getComputedStyle(this.thumb.current, null);
    const barHeight = parseFloat(barStyle.height);
    const barWidth = parseFloat(barStyle.width);
    const thumbHeight = thumbStyle.height.endsWith('%') ? parseFloat(thumbStyle.height) / 100 * barHeight : parseFloat(thumbStyle.height);
    const thumbWidth = thumbStyle.width.endsWith('%') ? parseFloat(thumbStyle.width) / 100 * barWidth : parseFloat(thumbStyle.width);

    const maxLeft = this.props.wrapper.scrollWidth - this.props.wrapper.offsetWidth;
    const maxTop = this.props.wrapper.scrollHeight - this.props.wrapper.offsetHeight;

    const maxThumbTop = barHeight - thumbHeight;
    const maxThumbLeft = barWidth - thumbWidth;

    left = left / maxThumbLeft * maxLeft;
    top = top / maxThumbTop * maxTop;

    left = left < 0 ? 0 : left > maxLeft ? maxLeft : left;
    top = top < 0 ? 0 : top > maxTop ? maxTop : top;

    switch (type) {
      case BAR_MAP.horizontal.type:
        top = this.props.wrapper.scrollTop;
        break;
      case BAR_MAP.vertical.type:
        left = this.props.wrapper.scrollLeft;
        break;
      default:
    }

    this.props.wrapper.scrollTo(left, top);
  }

  render() {
    const { type } = this.props;
    const barConfig = BAR_MAP[type];
    const barClassName = classNames(styles['scrollbar__bar'], styles[`scrollbar__bar--${BAR_MAP[type].type}`]);
    const style = {};

    style[barConfig.size] = (this.props[barConfig.size] || 0) + '%';

    return (
      <div className={barClassName} ref={this.bar}>
        <div
          className={styles['scrollbar__thumb']}
          style={style}
          ref={this.thumb}
          onMouseDown={this.handleMousedown}
        ></div>
      </div>
    );
  }
}
