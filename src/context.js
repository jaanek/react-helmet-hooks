import React, {useRef} from 'react';

export const Context = React.createContext({});

export default function Provider(props) {
  const setHelmet = state => {
    if (props.setHelmet) {
      props.setHelmet(state);
      return;
    }
    console.log("Setting helmet state: ", state);
    return;
  };
  const value = useRef({
    setHelmet: setHelmet,
    instances: []
  });
  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
