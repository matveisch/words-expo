import { StyleSheet, View, Text, Pressable, PressableProps } from 'react-native';
import { defaultColors } from '../helpers/colors';
import { ChevronIcon } from './ChevronIcon';

type Props = {
  title: string;
  subTitle?: string;
  backgroundColor?: string;
};

export default function ListItem(props: Props & PressableProps) {
  const { title, subTitle, backgroundColor, ...otherProps } = props;

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ? backgroundColor : defaultColors.subColor,
          paddingVertical: subTitle ? 10 : 18,
        },
      ]}
      {...otherProps}
    >
      <View style={styles.textGroup}>
        <Text
          style={[
            styles.title,
            {
              fontSize: subTitle ? 14 : 16,
            },
          ]}
        >
          {title}
        </Text>
        {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
      </View>
      <ChevronIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  textGroup: {
    flex: 1,
  },
  title: {
    lineHeight: 23,
    color: 'hsl(0, 0%, 9.0%)',
    fontWeight: '500',
  },
  subTitle: {
    lineHeight: 22,
    fontSize: 13,
    color: 'hsl(0, 0%, 9.0%)',
    opacity: 0.6,
  },
});
