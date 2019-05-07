import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { ArticleList } from '@/types/article';

// 引入编辑器组件
import BraftEditor, { ControlType } from 'braft-editor';
import { getUserId } from '@/utils/base';
import { getPageQuery } from '@/utils/utils';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import styles from './article.less';
// import createArticle from './models/createArticle';

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
  constructor(props: CreateFormProps) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null)
    };
  }
  static getDerivedStateFromProps(nextProps: CreateFormProps, preState: any) {
    return {
      editorState: BraftEditor.createEditorState(
        nextProps.data.articleData.html
      )
    };
  }

  handleSubmit = (e: React.MouseEvent): void => {
    const {
      form: { validateFieldsAndScroll }
    } = this.props;

    e && e.preventDefault();
    validateFieldsAndScroll((err, values: ArticleList.AsObject) => {
      if (!err) {
        const submitData: ArticleList.AsObject = {
          title: values.title,
          content: values.content.toHTML(), // or values.content.toRAW()
          tags: values.tags
        };
        this.postData(submitData);
      }
    });
  };
  onChange = (val) => {
    console.log(val);
  };
  postData = (values: ArticleList.AsObject): void => {
    const { dispatch } = this.props;
    const sendData = {
      ...values,
      author: getUserId()
    };
    dispatch({
      type: 'createArticle/create',
      payload: sendData
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data
    } = this.props;
    const { editorState } = this.state;
    const { articleData } = data;
    const { tagsList } = data;

    // 获取富文本内容 包含DOm结构和样式
    // console.log(this.props)
    // 表单布局
    const controls: ControlType[] = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
      'media'
    ];
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
                <Select
                  mode="multiple"
                  onChange={this.onChange}
                  placeholder="选择标签"
                >
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
              {getFieldDecorator('content', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容');
                      } else {
                        callback();
                      }
                    }
                  }
                ],
                initialValue: BraftEditor.createEditorState(articleData.content)
              })(
                <BraftEditor
                  className={styles['custom-editor']}
                  controls={controls}
                  placeholder="请输入正文内容"
                />
              )}
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
    console.log(props);
  }
})(CreateArticle);
export default connect(({ createArticle, loading }) => ({
  data: createArticle,
  loading: loading.effects['createArticle/create']
}))(FormCom);
