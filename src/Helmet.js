import React, {useEffect, useContext, useRef} from 'react';
import {Context} from './context';

export default function Helmet(props) {
  const {children, ...other} = props;
  let newProps = other;

  function mapTagChildrenToProps(tag, tagChildren) {
    if (!tagChildren) { return null; }
    switch (tag.type) {
    case "style": {
      return {cssText: tagChildren};
    }
    case "script": {
      return {text: tagChildren};
    }
    default: {
      throw new Error(`<${tag.type}> with children. Not implemented!`);
    }
    }
  }

  function mapTagsToProps(tags, newProps) {
    let collectedTags = [];

    for (let i=0; i < tags.length; i++) {
      const tag = tags[i];
      if (!tag || !tag.props) { continue; }

      const {children: tagChildren, ...tagProps} = tag.props;
      switch (tag.type) {
      case "meta":
      case "link":
      case "style":
      case "script":{
        collectedTags = {
          ...collectedTags,
          [tag.type]: [
            ...collectedTags[tag.type],
            {...tagProps, ...mapTagChildrenToProps(tag, tagChildren)}
          ]
        };
        break;
      }
      default: {
        switch (tag.type) {
        case "html":
          newProps = { ...newProps, htmlAttrs: {...newProps.htmlAttrs, ...tagProps} };
        case "body":
          newProps = { ...newProps, bodyAttrs: {...newProps.bodyAttrs, ...tagProps} };
        case "title":
          newProps = { ...newProps, [tag.type]: tagChildren, titleAttrs: {...tagProps}};
        default:
          newProps = { ...newProps, [tag.type]: {...tagProps}};
        }
      }
      }
    }

    // merge props with collected multi tags
    let result = {...newProps};
    const tagNames = Object.keys(collectedTags);
    for (let i=0; i < tagNames.length; i++) {
      const tagName = tagNames[i];
      result = {
        ...result,
        [tagName]: tagNames[tagName]
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
  }, []);

  // if helmet has changed then collect state from all helmet instances
  useEffect(() => {
    const propsList = instances.map(instance => instance.current);
    const state = collectHelmet(propsList);
    setHelmet(state);
  }, newProps);

  return null;
}

function collectHelmet(propsList) {
  return propsList.reduce((result, props) => {
    return {...result, ...props};
  }, {});
}
