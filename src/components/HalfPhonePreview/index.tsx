import { renderDisplayComponent } from '@/pages/broadcast/components/RenderFlowComponent';
import { LeftOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { FlowItem } from 'models/flows';
import React, { FC, Fragment } from 'react';
import styles from './index.less';

interface PhoneProps {
  data: FlowItem[] | [];
  editMode: boolean | false;
}

const HalfPhonePreview: FC<PhoneProps> = (props) => {
  const { data, editMode } = props;
  return (
      <Fragment>
          <div className={styles.body}>
            <div className={styles.speaker}/>
            <div className={styles.transciver}/>
            <div className={styles.screen}>
              <div className={styles.botHeaderWrapper}>
                <div className={styles.innerWrapper}>
                <div className={styles.backButtonWrapper}>
                    <span>
                      <LeftOutlined />
                      <div className={styles.backButton}>Back</div>
                    </span>
                  </div>
                  <div className={styles.botTitleWrapper}>
                    <div className={styles.title}>
                      <div>
                        <span>Bot Name</span>
                      </div>
                    </div>
                    <div className={styles.status}>
                      <span>Typically replies instantly</span>
                    </div>
                  </div>
                  <div className={styles.manageWrapper}>
                    <span>
                      <span>Manage</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.content}>
                <div className={styles.contentWrapper}>
                  <div className={styles.clearfix}>
                    <Space direction="vertical" size={12} style={{width: '260px'}}>
                      {data.map((flowNode: FlowItem, index: string) => renderDisplayComponent(flowNode, index, editMode))}
                    </Space>

                  </div>
                </div>
              </div>
            </div>
            {/* <div className={styles.mainButton} /> */}
          </div>
          </Fragment>
  );
};

export default HalfPhonePreview;
