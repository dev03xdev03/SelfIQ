declare module 'react-native-typewriter' {
  import { ComponentType } from 'react';
  import { TextStyle } from 'react-native';

  interface TypewriterProps {
    typing?: number;
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
  }

  const Typewriter: ComponentType<TypewriterProps>;
  export default Typewriter;
}
