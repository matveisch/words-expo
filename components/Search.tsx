import { StyleSheet } from 'react-native';
import Input from '../ui/Input';
import { supabase } from '../helpers/initSupabase';
import { WordType } from '../types/WordType';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setFoundWords: Dispatch<SetStateAction<WordType[]>>;
};

export default function Search(props: Props) {
  const { setFoundWords } = props;

  async function searchWords(prompt: string) {
    const { data, error } = await supabase.from('words').select().textSearch('word', `${prompt}`);
    data && setFoundWords(data);
  }

  return (
    <Input placeholder="Search" style={styles.input} onChangeText={(value) => searchWords(value)} />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});
