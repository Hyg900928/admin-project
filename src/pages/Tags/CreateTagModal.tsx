import React from 'react';
import { Modal, Input, Form } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { FormComponentProps } from 'antd/lib/form';
// import { WrappedFormUtils } from 'antd/es/form/Form';

const FormItem = Form.Item;

export interface ModalProps2 extends ModalProps {
  handleOk: (data: any, callback: Function) => void;
  handleCancel: () => void;
  modalVisible: boolean;
  createLoading: boolean;
  children?: React.ReactNode;
}

export interface CreateTagModalProps extends ModalProps2, FormComponentProps {}

interface FormData {
  title: string;
  value: string;
}

const CreateTagModal = React.memo((props: CreateTagModalProps) => {
  const {
    handleOk,
    createLoading,
    handleCancel,
    form: { getFieldDecorator, validateFieldsAndScroll, resetFields },
    modalVisible
  } = props;

  const handleSubmit = (e: React.MouseEvent) => {
    e && e.preventDefault();
    validateFieldsAndScroll((err, values: FormData) => {
      if (!err) {
        const submitData: FormData = {
          title: values.title,
          value: values.value
        };
        console.log(submitData);
        handleOk(submitData, () => {
          resetFields();
        });
      }
    });
  };
  const onHiddenModal = () => {
    resetFields();
    handleCancel();
  };
  const modalProps: ModalProps = {
    visible: modalVisible,
    onOk: handleSubmit,
    confirmLoading: createLoading,
    onCancel: onHiddenModal
  };

  return (
    <div>
      <Modal {...modalProps}>
        <Form>
          <FormItem label="标题" hasFeedback>
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
          <FormItem label="值" hasFeedback>
            {getFieldDecorator('value', {
              rules: [
                {
                  required: true,
                  message: '请输入标签值'
                }
              ],
              initialValue: ''
            })(<Input placeholder="标题(最多60个字符)" />)}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
});

export default Form.create()(CreateTagModal);
