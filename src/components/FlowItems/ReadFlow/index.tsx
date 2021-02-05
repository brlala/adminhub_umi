import React, { FC } from 'react';
import { Button, Card, Space, Carousel, Image } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import { FlowItemData } from 'models/flows';

interface DisplayComponentProps {
  componentKey: number;
  componentData: FlowItemData;
}

export const QuickReplyDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  return (
    <Space>
      {componentData &&
        componentData.quickReplies?.map((element, index) => (
          <Button key={componentKey + 'qr' + index} type="default" style={{ borderRadius: 20 }}>
            {element.text.EN}
          </Button>
        ))}{' '}
    </Space>
  );
};

export const TextDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard key={componentKey} style={{ borderRadius: 20, background: '#F6F6F6' }} size="small">
        <div>{componentData.text?.EN}</div>
      </ProCard>
    );
  }
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: '#F6F6F6' }} size="small">
      {' '}
      Placeholder Text{' '}
    </ProCard>
  );
};

export const ImageDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData) {
    return <Image style={{maxWidth: 300, maxHeight: 200}} key={componentKey} src={componentData.url} />;
  }
  return <Image style={{maxWidth: 300, maxHeight: 200}}key={componentKey} src="https://placekitten.com/300/150" />;
};

export const GenericTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  const CarouselButtonGroup = (total: number, current: number) => {
    const items = [];
    for (let x = 0; x < total; x++) {
      items.push(
        <Button type={current === x ? 'primary' : 'default'} shape="circle">
          {x + 1}
        </Button>,
      );
    }
    return (
      <Space style={{ width: '100%', justifyContent: 'center', margin: '10px' }}>{items} </Space>
    );
  };

  const CarouselNextArrow = (carouselProps) => {
    const { className, style, onClick } = carouselProps;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715',
        }}
        onClick={onClick}
      ></div>
    );
  };

  const CarouselPrevArrow = (carouselProps) => {
    const { className, style, onClick } = carouselProps;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: 'black',
          fontSize: '15px',
          lineHeight: '1.5715',
        }}
        onClick={onClick}
      ></div>
    );
  };

  return (
    <Carousel
      key={componentKey}
      className={styles.carousel}
      arrows
      {...{ nextArrow: <CarouselNextArrow />, prevArrow: <CarouselPrevArrow /> }}
    >
      {componentData &&
        componentData.elements?.map((element, index) => (
          <div
            style={{
              height: '600px',
              color: '#fff',
              lineHeight: '600px',
              textAlign: 'center',
              background: '#364d79',
            }}
          >
            {/* {CarouselButtonGroup(componentData.elements.length, index)} */}
            <Card
              key={index}
              style={{ borderRadius: 10, background: '#F6F6F6' }}
              size="small"
              cover={<img src={element ? element.imageUrl : ''} />}
            >
              <Meta title={element.title?.EN} description={element.subtitle?.EN} />
              {element.buttons?.map((button, buttonIdex) => (
                <ProCard
                  key={buttonIdex}
                  style={{ borderRadius: 10, marginTop: 10, textAlign: 'center' }}
                  size="small"
                >
                  {button.title.EN}
                </ProCard>
              ))}
            </Card>
          </div>
        ))}
    </Carousel>
  );
};

export const ButtonTemplateDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard
        key={componentKey}
        style={{ borderRadius: 10, background: '#F6F6F6', width: 270 }}
        size="small"
      >
        {componentData.title?.EN}
        {componentData.buttons?.map((button, buttonIdex) => (
          <Card
            key={buttonIdex}
            style={{ borderRadius: 10, marginTop: 10, textAlign: 'center' }}
            size="small"
          >
            {button.title?.EN}
          </Card>
        ))}
      </ProCard>
    );
  }
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: '#F6F6F6' }} size="small">
      {' '}
      Placeholder Text{' '}
    </ProCard>
  );
};

export const FlowDisplayComponent: FC<DisplayComponentProps> = (props) => {
  const { componentKey, componentData } = props;
  if (componentData) {
    return (
      <ProCard
        key={componentKey}
        style={{ borderRadius: 10, background: '#F6F6F6', width: 270 }}
        size="small"
      >
        <Meta title="GO TO" />
        <Card
          key={'Button' + componentKey}
          style={{ borderRadius: 10, marginTop: 10, textAlign: 'center' }}
          size="small"
        >
          {componentData.flow?.name}
        </Card>
      </ProCard>
    );
  }
  return (
    <ProCard key={componentKey} style={{ borderRadius: 20, background: '#F6F6F6' }} size="small">
      {' '}
      Placeholder Text{' '}
    </ProCard>
  );
};
