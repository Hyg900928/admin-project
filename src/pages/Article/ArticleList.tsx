import React, { Component } from 'react';
import { Table, Card, Row, Col, Button, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { ArticleList } from '@/types/article';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';

const confirm = Modal.confirm;

interface ArticleListProps {
  location?: any;
  loading: boolean;
  article: any;
  dispatch: any;
}

class ArticleList extends Component<ArticleListProps, any> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/getArticleList',
      payload: {}
    });
  }
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
  handleDelete = (id: string): void => {
    const { dispatch } = this.props;
    confirm({
      title: '确定要删除吗?',
      // content: 'Some descriptions',
      onOk() {
        dispatch({
          type: 'article/deleteArticle',
          payload: {
            id
          }
        });
      },
      onCancel() {
        console.log('Cancel');
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
          return moment(text).format('YYYY-MM-DD HH:mm');
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
            <div>
              <Button
                type="primary"
                style={{ marginRight: 15 }}
                onClick={() => this.handleEdit(record._id)}
              >
                编辑
              </Button>
              <Button
                type="danger"
                onClick={() => this.handleDelete(record._id)}
              >
                删除
              </Button>
            </div>
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
