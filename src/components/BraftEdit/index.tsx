import 'braft-editor/dist/index.css';
import React from 'react';
import BraftEditor, {
  ControlType,
  ExtendControlType,
  EditorState
} from 'braft-editor';

import { ContentUtils } from 'braft-utils';
// import { ImageUtils } from 'braft-finder'
import { Upload, Icon } from 'antd';
import styles from './index.less';

export interface BraftEditorComProps {
  handleChange: (value: EditorState) => void;
  content: string | any;
  // ref: any
  editorInstance: any;
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
    const { editorInstance } = this.props;
    const controls: ControlType[] = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator'
    ];
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
    return (
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            ref={editorInstance}
            className={styles['custom-editor']}
            value={this.state.editorState}
            // onChange={handleEditorChange}
            controls={controls}
            extendControls={extendControls}
          />
        </div>
      </div>
    );
  }
}

export default BraftEditorComponent;
