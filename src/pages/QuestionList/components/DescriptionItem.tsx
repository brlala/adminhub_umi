import React from 'react';

export type QuestionDrawerProps = {
  title: string;
  content: React.ReactNode;
};

const DescriptionItem: React.FC<QuestionDrawerProps> = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

export default DescriptionItem;
