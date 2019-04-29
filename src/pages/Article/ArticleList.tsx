import React, { Component } from 'react';
import { Table, Card, Row, Col, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';

interface ArticleListProps {
  location?: any;
  loading: boolean;
  article: any;
  dispatch: any;
}

class ArticleList extends Component<ArticleListProps, any> {
  handleCreate = () => {
    router.push('/article/create');
  };
  render() {
    const { article, loading } = this.props;
    const columns: Array<any> = [
      {
        title: '标题',
        dataIndex: 'title'
      },
      {
        title: '发布时间',
        dataIndex: 'createAt',
        render: (text, record) => {
          return moment(text).format('YYYY-DD-MM HH:mm');
        }
      },
      {
        title: '作者',
        dataIndex: 'author.account'
      },
      {
        title: '操作',
        render: (text, record) => {
          return <Button type="primary">编辑</Button>;
        }
      }
    ];
    return (
      <div>
        <Row style={{ marginBottom: 15 }}>
          <Col span={12}>
            <Button type="primary" onClick={this.handleCreate}>
              + 新建
            </Button>
          </Col>
        </Row>

        <Card loading={loading}>
          <Table
            loading={loading}
            dataSource={article.articleList}
            columns={columns}
            rowKey={(record: any) => record._id}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ article, loading }) => ({
  article,
  loading: loading.effects['article/getArticleList']
}))(ArticleList);
