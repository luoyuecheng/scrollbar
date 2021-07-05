import React from 'react';
import classNames from 'classnames';
import Bar from './bar';
import {
  ScrollbarProps,
  ScrollbarState
} from './utils';
import styles from './Scrollbar.less';

export default class Scrollbar extends React.Component<ScrollbarProps> {
  state: ScrollbarState;
  // Observer
  observer: MutationObserver;
  // ref HTMLElement
  scrollbar: HTMLDivElement | null;
  wrapper: HTMLDivElement | null;

  constructor(props: ScrollbarProps) {
    super(props);

    this.state = {
      thumbWidth: 0, // scroll bar width
      thumbHeight: 0 // scroll bar height
    };
    // 用 MutationObserver 而不是 IntersectionObserver， 所有 IE 不支持 IntersectionObserver
    this.observer = new MutationObserver(this.handleResize);
    this.scrollbar = null;
    this.wrapper = null;
  }

  shouldComponentUpdate(nextProps: ScrollbarProps, nextState: ScrollbarState) {
    if (this.state !== nextState) return true;

    if (this.props.children !== nextProps.children) return true;

    return false;
  }

  componentDidMount() {
    const observeConfig = { childList: true, subtree: true };

    if (this.wrapper) {
      this.observer.observe(this.wrapper, observeConfig);
    }
  }


  /**
   * Observer wrapper
   */
  handleResize = () => {
    if (!this.wrapper) return;

    const { offsetHeight, scrollHeight, offsetWidth, scrollWidth } = this.wrapper;

    let thumbWidth = 0;
    let thumbHeight = 0;

    if (scrollHeight > offsetHeight) {
      thumbHeight = Math.round(this.wrapper.offsetHeight / this.wrapper.scrollHeight * 10000) / 100;
    }

    if (scrollWidth > offsetWidth) {
      thumbWidth = Math.round(this.wrapper.offsetWidth / this.wrapper.scrollWidth * 10000) / 100;
    }

    this.setState(_ => ({ ...this.state, thumbWidth, thumbHeight }));
  }

  render() {
    const { thumbWidth, thumbHeight } = this.state;

    return (
      <div className={styles['scrollbar']} ref={event => this.scrollbar = event}>
        <div className={classNames(styles['scrollbar__wrapper'], styles['scrollbar__wrap--hidden-default'])} ref={event => this.wrapper = event}>
          {/* <div className="scrollbar__container" ref={event => this.resize = event}>{ this.props.children }</div> */}
          {this.props.children}
        </div>
        {thumbWidth > 0 && thumbWidth < 100 ? <Bar wrapper={this.wrapper} width={thumbWidth} height={thumbHeight} type="horizontal" /> : null}
        {thumbHeight > 0 && thumbHeight < 100 ? <Bar wrapper={this.wrapper} width={thumbWidth} height={thumbHeight} type="vertical" /> : null}
      </div>
    );
  }
}
