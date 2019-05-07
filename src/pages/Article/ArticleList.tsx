import React, { Component } from 'react';
import { Table, Card, Row, Col, Button } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ArticleList } from '@/types/article';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { resolve } from 'url';
import { reject } from 'q';

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
  handleEdit = (id: string): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/changeArticleType',
      payload: {
        articleData: {
          _id: id
        }
      }
    });
  };
  render() {
    const { article, loading } = this.props;
    const columns: ColumnProps<ArticleList.AsObject>[] = [
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
          return (
            <Button type="primary" onClick={() => this.handleEdit(record._id)}>
              编辑
            </Button>
          );
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
