import React from "react";

export const BAR_MAP = {
    horizontal: {
        type: 'horizontal',
        size: 'width',
        scroll: 'scrollTop',
        offset: 'offsetHeight',
        scrollSize: 'scrollHeight',
        position: 'left'
    },

    vertical: {
        type: 'vertical',
        size: 'height',
        scroll: 'scrollTop',
        offset: 'offsetHeight',
        scrollSize: 'scrollHeight',
        position: 'top'
    }
}

export interface ScrollbarProps {
  className?: string;
  children: React.ReactChild;
  [key: string]: any;
}

export interface ScrollbarState {
  thumbWidth: number;
  thumbHeight: number;
}

export interface BarProps {
  wrapper: HTMLDivElement | null;
  width: number;
  height: number;
  type: keyof typeof BAR_MAP
}

export interface BarState {

}
