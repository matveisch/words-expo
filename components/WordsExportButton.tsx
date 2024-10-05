import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '../helpers/initSupabase';
import Button from '../ui/Button';
import ThemedText from '../ui/ThemedText';

async function getWords(deckId: number, parentDeckId: number | null) {
  let query = supabase.from('words').select().order('id', { ascending: false });

  if (parentDeckId !== null) {
    // children decks
    query = query.eq('deck', deckId);
  } else {
    // parent decks
    query = query.eq('parent_deck', deckId);
  }

  const { data, error } = await query.csv();

  if (error) throw error;
  return data;
}

async function saveAndShareCsv(csvData: string): Promise<void> {
  try {
    const fileName = `words_${Date.now()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvData);

    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing isn't available on your platform");
      return;
    }

    await Sharing.shareAsync(filePath);
  } catch (error) {
    console.error('Error saving or sharing CSV:', error);
    alert('There was an error saving or sharing the file.');
  }
}

type Props = {
  deckId: number;
  parentDeckId: number | null;
};

export default function WordsExportButton(props: Props) {
  const { deckId, parentDeckId } = props;

  async function handleExport() {
    const words = await getWords(deckId, parentDeckId);
    await saveAndShareCsv(words);
  }

  return (
    <Button onPress={handleExport}>
      <ThemedText text={`Export words`} />
    </Button>
  );
}
