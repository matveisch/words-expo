import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';

import useAddDeck from '../../hooks/useAddDeck';
import { colors } from '../../helpers/colors';
import { RootStackParamList } from './HomeLayout';
import Button from '../../ui/Button';
import Label from '../../ui/Label';
import Input from '../../ui/Input';
import Circle from '../../ui/Circle';
import useUser from '../../hooks/useUser';
import { sessionStore } from '../../features/sessionStore';
import LockedFeature from '../../components/LockedFeature';
import Loader from '../../components/Loader';

type Inputs = {
  deckName: string;
  color: string;
};

interface Props extends NativeStackScreenProps<RootStackParamList, 'DeckCreateModal'> {}

const DeckCreateModal = observer(({ navigation, route }: Props) => {
  const [currentColor, setCurrentColor] = useState('');
  const { mutateAsync, isPending } = useAddDeck();
  const { data: user } = useUser(sessionStore.session?.user.id || '');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      deckName: '',
      color: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const newDeck = {
      name: data.deckName,
      parent_deck: route.params ? route.params.parentDeckId : null,
      color: data.color,
    };

    mutateAsync(newDeck).then(() => {
      reset();
      Keyboard.dismiss();
      setCurrentColor('');
      navigation.goBack();
    });
  };

  if (!user) return <Loader />;

  return (
    <View style={styles.container}>
      <Label text="Name" />
      <Controller
        name="deckName"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input onChangeText={(text) => onChange(text)} onBlur={onBlur} value={value} />
        )}
      />
      {errors.deckName && <Text style={{ color: 'red' }}>This field is required</Text>}

      {!user.pro ? (
        <View style={{ marginTop: 10 }}>
          <LockedFeature text="Get pro version to unlock deck customization" />
        </View>
      ) : (
        <>
          <Label text="Color" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {colors.map((color, index) => (
              <Circle
                onPress={() => {
                  setValue('color', color);
                  setCurrentColor(color);
                }}
                key={`${color}-${index}`}
                backgroundColor={color}
                borderColor={currentColor === color ? 'black' : undefined}
              />
            ))}
          </View>
        </>
      )}

      <Button onPress={handleSubmit(onSubmit)} disabled={isPending} style={{ marginTop: 10 }}>
        <Text>Create</Text>
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
});

export default DeckCreateModal;
