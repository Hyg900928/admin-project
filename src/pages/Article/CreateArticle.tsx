import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Card, Form, Input, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';

// 引入编辑器组件
import BraftEditor, { ControlType } from 'braft-editor';
import { getUserId } from '@/utils/base';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import styles from './article.less';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  dispatch: any;
  loading: boolean;
  data: any;
}
interface FormData {
  title: string;
  content: string | any;
  classify: string;
}

@connect(({ createArticle, loading }) => ({
  data: createArticle,
  loading: loading.effects['createArticle/create']
}))
class CreateArticle extends Component<CreateFormProps, any> {
  constructor(props: CreateFormProps) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(null)
    };
  }
  handleSubmit = (e: React.MouseEvent): void => {
    const {
      form: { validateFieldsAndScroll }
    } = this.props;

    e && e.preventDefault();
    validateFieldsAndScroll((err, values: FormData) => {
      if (!err) {
        const submitData: FormData = {
          title: values.title,
          content: values.content.toRAW(), // or values.content.toHTML()
          classify: values.classify
        };
        this.postData(submitData);
      }
    });
  };
  onChange = (val) => {
    console.log(val);
  };
  postData = (values: FormData): void => {
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
  componentDidMount() {
    // this.setState({
    //   editorState: BraftEditor.createEditorState('Hello world')
    // })
  }
  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    console.log(htmlContent);
    // const result = await saveEditorContent(htmlContent)
  };

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  };
  render() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
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
                initialValue: ''
              })(<Input placeholder="标题(最多60个字符)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分类" hasFeedback>
              {getFieldDecorator('classify', {
                rules: [
                  {
                    required: true,
                    message: '请选择分类'
                  }
                ],
                initialValue: ''
              })(
                <Select onChange={this.onChange} placeholder="选择一个分类">
                  <Option value="5cc2acd573c4c072f079c9d2">lisi</Option>
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
                ]
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

export default Form.create()(CreateArticle);
