import React, {useRef} from 'react';

export const Context = React.createContext({});

export default function Provider(props) {
  const setHelmet = state => {
    if (props.setHelmet) {
      props.setHelmet(state);
      return;
    }
    return;
  };
  const value = useRef({
    setHelmet: setHelmet,
    instances: []
  });
  return <Context.Provider value={value.current}>{props.children}</Context.Provider>;
}
