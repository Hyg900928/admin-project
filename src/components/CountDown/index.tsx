import React from 'react';

export interface CountDownProps {
  format?: (time: number) => void;
  target: Date | number;
  onEnd?: () => void;
  style?: React.CSSProperties;
}

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

const initTime = (props) => {
  let lastTime = 0;
  let targetTime = 0;
  try {
    if (Object.prototype.toString.call(props.target) === '[object Date]') {
      targetTime = props.target.getTime();
    } else {
      targetTime = new Date(props.target).getTime();
    }
  } catch (e) {
    // @ts-ignore
    throw new Error('invalid target prop', e);
  }

  lastTime = targetTime - new Date().getTime();
  return {
    lastTime: lastTime < 0 ? 0 : lastTime
  };
};

class CountDown extends React.Component<CountDownProps, any> {
  private timer: any;
  private readonly interval: number;

  constructor(props) {
    super(props);
    const { lastTime } = initTime(props);
    this.state = {
      lastTime
    };
    this.timer = 0;
    this.interval = 1000;
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate(prevProps) {
    const { target } = this.props;
    if (target !== prevProps.target) {
      clearTimeout(this.timer);
      this.tick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { lastTime } = initTime(nextProps);
    if (preState.lastTime !== lastTime) {
      return {
        lastTime
      };
    }
    return null;
  }

  defaultFormat = (time) => {
    const hours = 60 * 60 * 1000;
    const minutes = 60 * 1000;

    const h = Math.floor(time / hours);
    const m = Math.floor((time - h * hours) / minutes);
    const s = Math.floor((time - h * hours - m * minutes) / 1000);

    return (
      <span>
        {fixedZero(h)}:{fixedZero(m)}:{fixedZero(s)}
      </span>
    );
  };

  tick = () => {
    const { onEnd } = this.props;
    let { lastTime } = this.state;

    this.timer = setTimeout(() => {
      if (lastTime < this.interval) {
        clearTimeout(this.timer);
        this.setState(
          {
            lastTime: 0
          },
          () => {
            if (onEnd) {
              onEnd();
            }
          }
        );
      } else {
        lastTime -= this.interval;
        this.setState(
          {
            lastTime
          },
          () => {
            this.tick();
          }
        );
      }
    }, this.interval);
  };

  render() {
    const { format = this.defaultFormat, style } = this.props;
    const { lastTime } = this.state;
    const result = format(lastTime);

    return (
      // @ts-ignore
      <span style={style}>{result}</span>
    );
  }
}

export default CountDown;
