import { useControllableValue } from 'ahooks';
import { Button, Tag } from 'antd';
import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './index.less';

const { CheckableTag } = Tag;

export interface TagSelectOptionProps {
  value: string;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string, state: boolean) => void;
}

const TagSelectOption: React.FC<TagSelectOptionProps> & {
  isTagSelectOption: boolean;
} = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={!!checked}
    key={value}
    onChange={(state) => onChange && onChange(value, state)}
  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

type TagSelectOptionElement = React.ReactElement<TagSelectOptionProps, typeof TagSelectOption>;
export interface TagSelectProps {
  onChange?: (value: string[]) => void;
  expandable?: boolean;
  value?: string[];
  defaultValue?: string[];
  style?: React.CSSProperties;
  hideClear?: boolean;
  hideCheckAll?: boolean;
  actionsText?: {
    clearText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  singleOption?: boolean;
  Option?: TagSelectOptionProps;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}

const TagSelect: FC<TagSelectProps> & { Option: typeof TagSelectOption } = (props) => {
  const {
    children,
    hideClear = false,
    hideCheckAll = true,
    singleOption = false,
    className,
    style,
    actionsText = {},
  } = props;

  const [value, setValue] = useControllableValue<string[]>(props);

  const isTagSelectOption = (node: TagSelectOptionElement) =>
    node &&
    node.type &&
    (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption');

  const getAllTags = () => {
    const childrenArray = React.Children.toArray(children) as TagSelectOptionElement[];
    const checkedTags = childrenArray
      .filter((child) => isTagSelectOption(child))
      .map((child) => child.props.value);
    return checkedTags || [];
  };

  const onSelectAll = (checked: boolean) => {
    let checkedTags: string[] = [];
    if (checked) {
      checkedTags = getAllTags();
    }
    setValue(checkedTags);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const checkedTags: string[] = [...(value || [])];
    if (singleOption) {
      if (checked) {
        setValue([tag]);
      } else {
        setValue([]);
      }
    } else {
      const index = checkedTags.indexOf(tag);
      if (checked && index === -1) {
        checkedTags.push(tag);
      } else if (!checked && index > -1) {
        checkedTags.splice(index, 1);
      }
      setValue(checkedTags);
    }
  };

  const checkedAll = getAllTags().length === value?.length;
  const { clearText = 'Clear', selectAllText = 'All' } = actionsText;

  const cls = classNames(styles.tagSelect, className);

  return (
    <div className={cls} style={style}>
      {hideClear ? null : (
        <Button key="tagClear" size="small" type="link" onClick={() => setValue([])}>
          {clearText}
        </Button>
      )}
      {hideCheckAll ? null : (
        <CheckableTag checked={checkedAll} key="tag-select-__all__" onChange={onSelectAll}>
          {selectAllText}
        </CheckableTag>
      )}
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: value && value.indexOf(child.props.value) > -1,
              onChange: handleTagChange,
            });
          }
          return child;
        })}
    </div>
  );
};

TagSelect.Option = TagSelectOption;

export default TagSelect;
