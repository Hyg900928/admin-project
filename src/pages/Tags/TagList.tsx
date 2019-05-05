import React, { Component } from 'react';
import { connect } from 'dva';

import PageWrapperHeader from '@/components/PageHeaderWrapper';
import TagTable from './tagTable';
import CreateTagModal, { ModalProps2 } from './CreateTagModal';
import { RouterTypes } from 'umi';
import { Button } from 'antd';

interface TagListProps extends RouterTypes {
  tagList: any[];
  modalVisible: boolean;
  dispatch: any;
  loading: boolean;
  createLoading: boolean;
}

@connect(({ tag, loading }) => ({
  ...tag,
  loading: loading.effects['tag/getTagList'],
  createLoading: loading.effects['tag/createTag']
}))
class TagList extends Component<TagListProps, any> {
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/onChangeState',
      payload: {
        modalVisible: true
      }
    });
  };
  render() {
    const { tagList, modalVisible, dispatch, createLoading } = this.props;
    const modalProps: ModalProps2 = {
      modalVisible,
      createLoading,
      handleOk(value, callback) {
        dispatch({
          type: 'tag/createTag',
          payload: {
            ...value
          },
          callback
        });
      },
      handleCancel() {
        dispatch({
          type: 'tag/onChangeState',
          payload: {
            modalVisible: false
          }
        });
      }
    };
    return (
      <div>
        <PageWrapperHeader>
          <Button
            onClick={this.showModal}
            type="primary"
            style={{ marginBottom: 15 }}
          >
            ++新增标签
          </Button>
          <TagTable data={tagList} />
          <CreateTagModal {...modalProps} />
        </PageWrapperHeader>
      </div>
    );
  }
}

export default TagList;
