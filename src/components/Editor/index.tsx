import 'braft-editor/dist/index.css';
import React from 'react';
import BraftEditor, {
  ControlType,
  ExtendControlType,
  EditorState
} from 'braft-editor';
import { AXIOS_DEFAULT_CONFIG } from '@/config';

import { ContentUtils } from 'braft-utils';
// import { ImageUtils } from 'braft-finder'
import { Upload, Icon } from 'antd';
import styles from './index.less';

export interface BraftEditorComProps {
  onChangeState: (value: EditorState) => void;
  content: string | any;
  // ref: any
  editorInstance?: any;
  children?: React.ReactNode;
}

interface StateProps {
  editorState: EditorState;
}

class BraftEditorComponent extends React.Component<
  BraftEditorComProps,
  StateProps
> {
  constructor(props: BraftEditorComProps) {
    super(props);
    this.state = {
      editorState: BraftEditor.createEditorState(null)
    };
  }
  static getDerivedStateFromProps(
    nextProps: BraftEditorComProps,
    prevState: StateProps
  ): StateProps {
    return {
      editorState: BraftEditor.createEditorState(nextProps.content)
    };
  }
  uploadHandler = (param) => {
    if (!param.file) {
      return;
    }
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url: URL.createObjectURL
        }
      ])
    });
  };

  render() {
    const { onChangeState, content } = this.props;
    const extendControls: ExtendControlType[] = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={this.uploadHandler}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      }
    ];

    const myUploadFn = (param) => {
      // console.log(param)
      const serverURL = `${AXIOS_DEFAULT_CONFIG.baseURL}/api/v1/upload`;
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      const successFn = (response) => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        const res = JSON.parse(xhr.responseText);
        param.success({
          url: `${AXIOS_DEFAULT_CONFIG.baseURL}/${res.data.filePath}`
        });
      };

      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };

      const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.'
        });
      };

      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      fd.append('file', param.file);
      xhr.open('POST', serverURL, true);
      xhr.send(fd);
    };
    const editorProps = {
      defaultValue: content || '',
      value: content,
      onChange: onChangeState,
      media: {
        uploadFn: myUploadFn
      }
    };

    return (
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            // ref={editorInstance}
            {...editorProps}
            className={styles['custom-editor']}
            // value={this.state.editorState}
            // onChange={handleEditorChange}
            // controls={controls}
            // extendControls={extendControls}
          />
        </div>
      </div>
    );
  }
}

export default BraftEditorComponent;
