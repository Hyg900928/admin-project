import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { Card } from 'antd';

const AddUser = React.memo((props) => {
  return (
    <PageHeaderWrapper>
      <div className="content">添加用户</div>
    </PageHeaderWrapper>
  );
});

export default AddUser;
