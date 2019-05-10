import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Button, Select, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { ArticleList } from '@/types/article';
import BraftEditComponent, { BraftEditorComProps } from '@/components/Editor';

import { getUserId } from '@/utils/base';
import { getPageQuery } from '@/utils/utils';
import router from 'umi/router';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  dispatch: any;
  loading: boolean;
  data: ArticleList.CreateArticleState;
}
// interface FormData extends  {
//   title: string;
//   content: string | any;
//   tags: Array<any>;
// }

class CreateArticle extends Component<CreateFormProps, any> {
  editorInstance: any;
  constructor(props: CreateFormProps) {
    super(props);
    this.editorInstance = React.createRef();
  }
  async componentDidMount() {
    const { dispatch } = this.props;
    const query = getPageQuery();
    dispatch({
      type: 'createArticle/query',
      payload: {}
    });
    if (query && query.id) {
      dispatch({
        type: 'createArticle/onChangeState',
        payload: {
          type: 'edit'
        }
      });
      dispatch({
        type: 'createArticle/getArticleInfo',
        payload: {
          id: query.id,
          type: 'edit'
        }
      });
    }
  }
  handleSubmit = (e: React.MouseEvent): void => {
    const {
      form: { validateFieldsAndScroll },
      data: { articleData, editorContent }
    } = this.props;

    e && e.preventDefault();
    validateFieldsAndScroll((err, values: ArticleList.AsObject) => {
      if (!err) {
        const submitData: ArticleList.AsObject = {
          ...articleData,
          title: values.title,
          tags: values.tags,
          content: editorContent && editorContent.toHTML()
        };

        // console.log(submitData)
        this.postData(submitData);
      }
    });
  };

  postData = (values: ArticleList.AsObject) => {
    const {
      dispatch,
      data: { type }
    } = this.props;
    const sendData = {
      ...values,
      author: getUserId()
    };
    new Promise((resolve, reject) => {
      dispatch({
        type: `createArticle/${type}`,
        payload: {
          ...sendData,
          resolve,
          reject
        }
      });
    }).then((data: any) => {
      if (data.code === 0) {
        Modal.info({
          title: type === 'create' ? '创建成功' : '编辑成功',
          onOk() {
            router.push('/article/list');
          }
        });
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      dispatch
    } = this.props;
    const { articleData, editorContent } = data;
    const { tagsList } = data;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 4
        }
      }
    };
    const braftEditProps: BraftEditorComProps = {
      content: editorContent,
      onChangeState(value) {
        dispatch({
          type: 'createArticle/onChangeState',
          payload: {
            editorContent: value
          }
        });
      }
    };

    return (
      <PageHeaderWrapper>
        <Card className="content" loading={loading}>
          <Form style={{ maxWidth: '900px' }}>
            <FormItem {...formItemLayout} label="标题" hasFeedback>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入标题'
                  }
                ],
                initialValue: articleData.title
              })(<Input placeholder="标题(最多60个字符)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="标签">
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请选择标签'
                  }
                ],
                initialValue: articleData.tags
              })(
                <Select mode="multiple" placeholder="选择标签">
                  {tagsList.map((el) => {
                    return (
                      <Option key={el._id} value={el._id}>
                        {el.title}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="文章正文">
              <BraftEditComponent {...braftEditProps} />
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <div style={{ padding: '10px 0' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  onClick={this.handleSubmit}
                >
                  保存
                </Button>
                {/* <Button size="large" className="mr8">取消</Button> */}
              </div>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const FormCom = Form.create<CreateFormProps>({
  mapPropsToFields(props) {
    // console.log(props);
  },
  onFieldsChange(props, changedFields) {
    let key = Object.keys(changedFields)[0];
    props.dispatch({
      type: 'createArticle/onChangeState',
      payload: {
        articleData: {
          ...props.data.articleData,
          [key]: changedFields[key].value
        }
      }
    });
    // console.log(changedFields)
  }
})(CreateArticle);
export default connect(({ createArticle, loading }) => ({
  data: createArticle,
  loading: loading.effects['createArticle/create']
}))(FormCom);
