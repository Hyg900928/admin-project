import React from 'react';
import ClassNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';
import * as H from 'history';

export interface ExceptionProps<
  L = {
    to: H.LocationDescriptor;
    href?: H.LocationDescriptor;
    replace?: boolean;
    innerRef?: (node: HTMLAnchorElement | null) => void;
  }
> {
  className?: string;
  backText?: React.ReactNode | String;
  type?: '403' | '404' | '500';
  title?: React.ReactNode;
  desc?: React.ReactNode;
  img?: string;
  actions?: React.ReactNode;
  linkElement?: string | React.ComponentType<L>;
  style?: React.CSSProperties;
  redirect?: string;
}

class Exception extends React.Component<ExceptionProps, any> {
  static defaultProps = {
    className: '',
    backText: '返回首页',
    redirect: '/'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      backText,
      img,
      type,
      title,
      desc,
      actions,
      linkElement = 'a',
      redirect
    } = this.props;

    const pageType = type in config ? type : '404';

    const cls = ClassNames(styles.exception, className);
    return (
      <div className={cls}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{
              backgroundImage: `url(${img || config[pageType].img})`
            }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {actions ||
              React.createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
