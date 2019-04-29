import React from 'react';
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { TagList } from '@/types/tag';

interface TagTableProps {
  data?: TagList.AsObject[];
}

const TagTable = React.memo((props: TagTableProps) => {
  const { data = [] } = props;
  const columns: ColumnProps<TagList.AsObject>[] = [
    {
      title: '标签名',
      dataIndex: 'title',
      render: (text, record) => {
        return <span>{text}</span>;
      }
    },
    {
      title: '标签值',
      dataIndex: 'value',
      render: (text, record) => {
        return <span>{text}</span>;
      }
    }
  ];
  return (
    <Card>
      <Table
        loading={false}
        dataSource={data}
        columns={columns}
        rowKey={(record: TagList.AsObject) => record._id}
      />
    </Card>
  );
});

export default TagTable;
