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
  state = {
    loading: true
  };
  async componentDidMount() {
    const res: any = await this.fetuser();
    if (res.id) {
      this.setState({
        loading: false
      });
    }
  }
  fetuser = async () => {
    const { dispatch } = this.props;
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {
          resolve,
          reject
        }
      });
    }).then((data) => {
      return data;
    });
  };

  render() {
    // const {isLogin, currentUser, dispatch } = this.props;
    if (this.state.loading) {
      return (
        <Spin spinning={this.state.loading} style={{ verticalAlign: 'middle' }}>
          <div style={{ height: window.innerHeight }}>{/* loading... */}</div>
        </Spin>
      );
    }
    return <BasicLayout {...this.props} />;
  }
}

export default connect(({ user, loading }) => ({
  ...user,
  loading: loading.effects['user/fetchCurrent']
}))(AuthBasicLayout);
