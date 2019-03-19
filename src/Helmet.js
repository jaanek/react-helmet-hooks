import React, {useEffect, useContext, useRef} from 'react';
import isEqual from 'react-fast-compare';
import {Context} from './context';

export default React.memo(function Helmet(props) {
  const {children, ...other} = props;
  let newProps = other;

  function mapTagChildrenToProps(tag, tagChildren) {
    if (!tagChildren) { return null; }
    switch (tag.type) {
    case "style":
    case "script": {
      return {text: tagChildren};
    }
    default: {
      throw new Error(`<${tag.type}> with children. Not implemented!`);
    }
    }
  }

  function mapTagsToProps(tags, newProps) {
    let collectedTags = {};

    React.Children.forEach(tags, tag => {
      if (!tag || !tag.props) { return; }

      const {children: tagChildren, ...tagProps} = tag.props;
      switch (tag.type) {
      case "meta":
      case "link":
      case "style":
      case "script":{
        collectedTags = {
          ...collectedTags,
          [tag.type]: [
            ...(collectedTags[tag.type] || []),
            {...tagProps, ...mapTagChildrenToProps(tag, tagChildren)}
          ]
        };
        break;
      }
      default: {
        switch (tag.type) {
        case "html":
          newProps = { ...newProps, htmlAttrs: {...newProps.htmlAttrs, ...tagProps} };
          break;
        case "body":
          newProps = { ...newProps, bodyAttrs: {...newProps.bodyAttrs, ...tagProps} };
          break;
        case "title":
          newProps = { ...newProps, [tag.type]: tagChildren, titleAttrs: {...tagProps}};
          break;
        default:
          newProps = { ...newProps, [tag.type]: {...tagProps}};
          break;
        }
      }
      }
    });

    // merge props with collected multi tags
    let result = {...newProps};
    const tagNames = Object.keys(collectedTags);
    for (let i=0; i < tagNames.length; i++) {
      const tagName = tagNames[i];
      result = {
        ...result,
        [tagName]: collectedTags[tagName]
      };
    }
    return result;
  }

  if (children) {
    newProps = mapTagsToProps(children, newProps);
  }

  // trigger helmet state sync
  const {instances, setHelmet} = useContext(Context);
  const instance = useRef(newProps);
  instance.current = newProps;

  // register and unregister a helmet instance
  useEffect(() => {
    instances.push(instance);
    return () => {
      const index = instances.indexOf(instance);
      instances.splice(index, 1);
    };
  }, [instances]);

  // if helmet has changed then collect state from all helmet instances
  useEffect(() => {
    const propsList = instances.map(instance => instance.current);
    const state = collectHelmet(propsList);
    setHelmet(state);
  }, [newProps]);

  return null;
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

function collectHelmet(propsList) {
  return propsList.reduce((result, props) => {
    return {...result, ...props};
  }, {});
}
