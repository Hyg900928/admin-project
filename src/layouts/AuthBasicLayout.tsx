import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Dispatch } from 'redux';
import BasicLayout from './BasicLayout';

interface AuthBasicLayoutProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  isLogin: boolean;
  currentUser: object;
}

class AuthBasicLayout extends React.Component<AuthBasicLayoutProps, any> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent'
    });
  }

  render() {
    const { loading, isLogin } = this.props;
    if (loading && !isLogin) {
      return <Spin />;
    }
    return <BasicLayout {...this.props} />;
  }
}

export default connect(({ user, loading }) => ({
  ...user,
  loading: loading.effects['user/fetchCurrent']
}))(AuthBasicLayout);
