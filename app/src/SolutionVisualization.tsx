import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Divider } from './Divider';
import { CardDeck } from './Card';
import { commonStyles } from './styles';
import { parseRawCard } from './cardUtils';
import { StrategyResultState } from './Home';
interface SolutionVisualizationProps {
  strategyResult: StrategyResultState;
  rank: string;
  isWindowMaxed: boolean;
  toggleWindowSize: () => void;
}
export const SolutionVisualization: React.FunctionComponent<SolutionVisualizationProps> = ({ strategyResult, rank, isWindowMaxed, toggleWindowSize }) => (<>
  <View style={{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
  }}>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 20,
        padding: 4,
        textAlign: 'center',
      }}>
        拆牌策略计算结果
        </Text>
    </View>
    <View style={{ width: 2, backgroundColor: 'black' }} />
    <TouchableOpacity style={{
      width: 40,
      alignContent: 'center',
      justifyContent: 'center',
    }} onPress={toggleWindowSize}>
      <Text style={{ textAlign: 'center' }}>{isWindowMaxed ? '🗕' : '🗖'}</Text>
    </TouchableOpacity>
  </View>
  <Divider />
  <ScrollView style={[
    commonStyles.container,
    {
      flex: 2,
    },
  ]}>
    {strategyResult &&
      (strategyResult === 'loading' ? (<Text style={{
        fontSize: 20,
      }}>
        计算中...
          </Text>) : (<>
          <Text>{`最少${strategyResult.minHands}手可以出完`}</Text>
          <View>
            {strategyResult.solutions.map((solution, solutionIndex) => (<CardDeck key={solutionIndex} hands={solution.actualHands.map(hand => hand.map(card => parseRawCard(card, {
              rank,
              suit: 'H',
            })))} />))}
          </View>
        </>))}
  </ScrollView>
</>);
