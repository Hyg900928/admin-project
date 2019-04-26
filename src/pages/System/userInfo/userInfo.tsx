import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import _debug from 'debug';

const debug = _debug('app:page:userInfo');

debug(APP_TYPE);
debug(process.env);
class Users extends React.PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <div>用户信息</div>
      </PageHeaderWrapper>
    );
  }
}

export default Users;
