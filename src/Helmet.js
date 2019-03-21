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

  let helmet = newProps;
  if (children) {
    helmet = mapTagsToProps(children, newProps);
  }

  // trigger helmet state sync
  const {instances, setHelmet} = useContext(Context);
  const instance = useRef(helmet);
  instance.current = helmet;

  // register and unregister a helmet instance
  useEffect(() => {
    instances.push(instance);
    return () => {
      const index = instances.indexOf(instance);
      instances.splice(index, 1);
    };
  }, [instances]);

  // if helmet has changed then propate all helmet states to the userland
  useEffect(() => {
    const helmets = instances.map(instance => instance.current);
    setHelmet(helmets);
  }, [helmet]);

  return null;
}, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});

export function mergeHelmets(helmets) {
  const result = {};
  for (let i=0; i < helmets.length; i++) {
    const helmet = helmets[i];
    const propNames = Object.keys(helmet);
    propNames.forEach(propName => {
      const props = helmet[propName];
      switch (propName) {
      case "meta":
      case "link":
      case "style":
      case "script":{
        result = {
          ...result,
          [propName]: [
            ...(result[propName] || []),
            ...props
          ]
        };
        break;
      }
      default: {
        switch (propName) {
        case "html":
          result[propName] = props;
          break;
        case "body":
          result[propName] = props;
          break;
        case "title":
          result[propName] = props;
          break;
        default:
          result[propName] = props;
          break;
        }
      }
      }
    });
  }
  return result;
}
