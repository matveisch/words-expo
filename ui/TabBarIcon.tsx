import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ComponentProps } from 'react';

export function TabBarIcon(props: {
  name: ComponentProps<typeof FontAwesome>['name'];
  color?: string;
  size?: number;
}) {
  return <FontAwesome size={props.size || 24} {...props} />;
}
