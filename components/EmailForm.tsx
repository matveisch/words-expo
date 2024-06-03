import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, Image, Keyboard } from 'react-native';
import { supabase } from '../helpers/initSupabase';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Label from '../ui/Label';
import Input from '../ui/Input';
import InputError from '../ui/InputError';
import Button from '../ui/Button';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { sessionStore } from '../features/sessionStore';
import { observer } from 'mobx-react';
import { defaultColors } from '../helpers/colors';
import ThemedText from '../ui/ThemedText';

type Inputs = {
  email: string;
  password: string;
};

const EmailForm = observer(() => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function signInWithEmail(data: Inputs) {
    setLoading(true);
    const {
      error,
      data: { session },
    } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    sessionStore.setSession(session);
    // if (!error) navigation.navigate('Decks', { userId: session.user?.id });
  }

  async function signUpWithEmail(data: Inputs) {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert(error.message);
    if (!error && !session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
    sessionStore.setSession(session);
  }

  async function resetPassword(data: Inputs) {
    setLoading(true);
    const { data: session, error } = await supabase.auth.resetPasswordForEmail(data.email);
    console.log('reset');
  }

  return (
    <Animated.View
      entering={SlideInRight}
      style={{
        padding: 12,
        backgroundColor: '#fff',
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 10,
        paddingRight: insets.right + 10,
        paddingTop: insets.top,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <View>
        <Image source={require('../assets/icon.png')} style={{ height: 125, width: 125 }} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Label text="Email" />
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              onChangeText={(text) => onChange(text)}
              onBlur={onBlur}
              value={value}
              placeholder="email@address.com"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && <InputError text="This field is required" />}
      </View>

      {forgotPassword && (
        <>
          <Button
            style={{ width: '100%', marginTop: 10 }}
            backgroundColor={defaultColors.activeColor}
            onPress={handleSubmit(resetPassword)}
          >
            <ThemedText text="Reset password" />
          </Button>
          <Button
            style={{ width: '100%', marginTop: 4 }}
            onPress={() => {
              setForgotPassword(false);
              reset();
              Keyboard.dismiss();
            }}
          >
            <Text>Go back</Text>
          </Button>
        </>
      )}

      {!forgotPassword && (
        <>
          <View style={styles.verticallySpaced}>
            <Label text="Password" />
            <Controller
              name="password"
              control={control}
              rules={{
                required: !forgotPassword,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onChangeText={(text) => onChange(text)}
                  onBlur={onBlur}
                  value={value}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  placeholder="Password"
                />
              )}
            />
            {errors.password && <InputError text="This field is required" />}
          </View>

          <Button
            chromeless
            style={{ alignSelf: 'flex-end' }}
            size="small"
            onPress={() => {
              setForgotPassword(true);
              reset();
              Keyboard.dismiss();
            }}
          >
            <Text>Forgot password?</Text>
          </Button>

          <View style={[styles.verticallySpaced, styles.mt20, { marginTop: 20 }]}>
            <Button
              disabled={loading}
              onPress={handleSubmit(signInWithEmail)}
              backgroundColor={defaultColors.activeColor}
            >
              <ThemedText text="Sign in" />
            </Button>
          </View>
          <View style={styles.verticallySpaced}>
            <Button disabled={loading} onPress={handleSubmit(signUpWithEmail)}>
              <Text>Sign up</Text>
            </Button>
          </View>
        </>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    // marginTop: 20,
  },
});

export default EmailForm;
