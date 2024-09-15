import { observer } from 'mobx-react-lite';
import { ActivityIndicator, View } from 'react-native';

import { sessionStore } from '../features/sessionStore';
import { knowledgeColors } from '../helpers/colors';
import useUser from '../hooks/useUser';
import { useWordsCount } from '../hooks/useWordsCount';
import ChartItem from '../ui/ChartItem';
import LockedFeature from './LockedFeature';
import PieChart from './PieChart';

type Props = {
  deckId: number;
  parentDeckId: number | null;
};

const Stats = observer(({ deckId, parentDeckId }: Props) => {
  const isParentDeck = parentDeckId === null;
  const { data: user } = useUser(sessionStore.session?.user.id || '');
  const { data: counts, error } = useWordsCount(deckId, isParentDeck);

  const graphData = [
    { value: counts[1] + counts[2], color: knowledgeColors[0], text: 'again' },
    { value: counts[3] + counts[4], color: knowledgeColors[1], text: 'hard' },
    { value: counts[5] + counts[6], color: knowledgeColors[2], text: 'good' },
    { value: counts[7] + counts[8], color: knowledgeColors[3], text: 'easy' },
  ];

  if (!user) {
    return <ActivityIndicator />;
  }

  if (!user.pro) {
    return <LockedFeature text="Get pro version to view statistics" />;
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <PieChart graphData={graphData} total={counts[0]} />

      <View style={{ justifyContent: 'space-evenly' }}>
        {graphData.map((level, index) => (
          <ChartItem text={level.text} color={level.color} key={`${level.text}-${index}`} />
        ))}
      </View>
    </View>
  );
});

export default Stats;
