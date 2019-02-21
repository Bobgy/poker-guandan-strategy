import React, { Props, memo } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Divider } from './Divider'
import { CardDeck } from './Card'
import { commonStyles } from './styles'
import { parseRawCard } from './cardUtils'
import { StrategyResultState } from './Home'
import { ReactComponent as Close } from './icons/close.svg'

interface SolutionVisualizationProps {
  strategyResult: StrategyResultState
  rank: string
  toggleWindowSize: () => void
}

interface WindowSizeToggleProps {
  toggleWindowSize: () => void
}
const WindowSizeToggle: React.FunctionComponent<
  WindowSizeToggleProps
> = props => (
  <TouchableOpacity
    style={{
      width: 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={props.toggleWindowSize}
  >
    <Close/>
  </TouchableOpacity>
)

interface SolutionWindowProps {
  rank: string
  strategyResult: StrategyResultState
}
const SolutionWindow: React.FunctionComponent<SolutionWindowProps> = props => (
  <ScrollView
    style={[
      commonStyles.container,
      {
        flex: 2,
      },
    ]}
  >
    {props.strategyResult &&
      (props.strategyResult === 'loading' ? (
        <Text
          style={{
            fontSize: 20,
          }}
        >
          计算中...
        </Text>
      ) : (
        <>
          <Text>{`最少${props.strategyResult.minHands}手可以出完`}</Text>
          <View>
            {(() => {
              const solutionsCount = props.strategyResult.solutions.length
              const hiddenMoreSolutions = solutionsCount - 10
              return (
                <>
                  {props.strategyResult.solutions
                    .slice(0, 10)
                    .map((solution, solutionIndex) => (
                      <CardDeck
                        key={solutionIndex}
                        hands={solution.actualHands.map(hand =>
                          hand.map(card =>
                            parseRawCard(card, {
                              rank: props.rank,
                              suit: 'H',
                            }),
                          ),
                        )}
                      />
                    ))}
                  {hiddenMoreSolutions > 0 &&
                    `还有${hiddenMoreSolutions}种方案可以达到同样的最少手数`}
                </>
              )
            })()}
          </View>
        </>
      ))}
  </ScrollView>
)
const MemoedSolutionWindow = memo(SolutionWindow)

const SolutionVisualization: React.FunctionComponent<
  SolutionVisualizationProps
> = ({ strategyResult, rank, toggleWindowSize }) => (
  <>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 20,
            padding: 4,
            textAlign: 'center',
          }}
        >
          拆牌策略计算结果
        </Text>
      </View>
      <View style={{ width: 2, backgroundColor: 'black' }} />
      <WindowSizeToggle
        toggleWindowSize={toggleWindowSize}
      />
    </View>
    <Divider />
    <MemoedSolutionWindow strategyResult={strategyResult} rank={rank} />
  </>
)

export default React.memo(SolutionVisualization)
