import { observer } from 'mobx-react-lite';
import { ActivityIndicator, View } from 'react-native';

import { useDecks } from '../hooks/useDecks';
import { sessionStore } from '../features/sessionStore';
import { useWordsCount } from '../hooks/useWordsCount';
import { knowledgeColors } from '../helpers/colors';
import useUser from '../hooks/useUser';
import PieChart from './PieChart';
import ChartItem from '../ui/ChartItem';
import LockedFeature from './LockedFeature';

type Props = {
  deckId: number;
};

const Stats = observer(({ deckId }: Props) => {
  const { data: decks, isFetched } = useDecks(sessionStore.session?.user.id || '');
  const subDecks = decks?.filter((d) => d.parent_deck === deckId);
  const decksIds = [...(subDecks?.map((deck) => deck.id) || []), deckId];
  const { data: user } = useUser(sessionStore.session?.user.id || '');

  const { data: wordsCount } = useWordsCount(deckId, decksIds, isFetched);
  const { data: againWordsCount } = useWordsCount(deckId, decksIds, isFetched, 1);
  const { data: hardWordsCount } = useWordsCount(deckId, decksIds, isFetched, 2);
  const { data: goodWordsCount } = useWordsCount(deckId, decksIds, isFetched, 3);
  const { data: easyWordsCount } = useWordsCount(deckId, decksIds, isFetched, 4);

  const graphData = [
    { value: againWordsCount || 0, color: knowledgeColors[0], text: 'again' },
    { value: hardWordsCount || 0, color: knowledgeColors[1], text: 'hard' },
    { value: goodWordsCount || 0, color: knowledgeColors[2], text: 'good' },
    { value: easyWordsCount || 0, color: knowledgeColors[3], text: 'easy' },
  ];

  if (!user) {
    return <ActivityIndicator />;
  }

  if (!user.pro) {
    return <LockedFeature text="Get pro version to view statistics" />;
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <PieChart graphData={graphData} total={wordsCount || 0} />

      <View style={{ justifyContent: 'space-evenly' }}>
        {graphData.map((level, index) => (
          <ChartItem text={level.text} color={level.color} key={`${level.text}-${index}`} />
        ))}
      </View>
    </View>
  );
});

export default Stats;
