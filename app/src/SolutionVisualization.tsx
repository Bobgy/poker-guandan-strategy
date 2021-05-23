import React, { memo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { Divider } from './Divider'
import { CardDeck } from './Card'
import { commonStyles } from './styles'
import { StrategyResult } from './useResultState'
import { ReactComponent as Close } from './icons/close.svg'
import { ReactComponent as Info } from './icons/info.svg'
import { WindowSize } from './useWindowSize'
import { NaturalRankWithoutJokers } from './strategy/models/const'
import { cardToCardRaw } from './strategy/models/Card'

interface SolutionVisualizationProps {
  strategyResult: StrategyResult[]
  rank: NaturalRankWithoutJokers
  windowSize: WindowSize
  onClose: () => void
}

interface WindowSizeToggleProps {
  onClose: () => void
  style: StyleProp<ViewStyle>
}
const CloseWindowButton: React.FunctionComponent<WindowSizeToggleProps> = (
  props,
) => (
  <TouchableOpacity
    style={[
      {
        width: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      props.style,
    ]}
    onPress={props.onClose}
  >
    <Close />
  </TouchableOpacity>
)

const MAX_SOLUTIONS = 5

interface SolutionViewProps {
  rank: NaturalRankWithoutJokers
  strategyResult: StrategyResult
  windowSize: WindowSize
}
const SolutionView: React.FunctionComponent<SolutionViewProps> = ({
  strategyResult,
  rank,
  windowSize,
}) => (
  <>
    {strategyResult &&
      (strategyResult === 'loading' ? (
        <Text
          style={{
            fontSize: 20,
          }}
        >
          计算中
        </Text>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 18, flexShrink: 0, marginRight: 20 }}
            >{`分数${strategyResult.plans[0].score}`}</Text>
          </View>
          <View>
            {(() => {
              const solutionsCount = strategyResult.plans.length
              const hiddenMoreSolutions = solutionsCount - MAX_SOLUTIONS
              return (
                <>
                  {strategyResult.plans
                    .slice(0, MAX_SOLUTIONS)
                    .map((plan, planIndex) => (
                      <CardDeck
                        key={planIndex}
                        hands={plan.plays.map((play) =>
                          play.cards.map(cardToCardRaw),
                        )}
                        style={{
                          margin: 6,
                        }}
                        large={windowSize === 'BIG'}
                      />
                    ))}
                  {hiddenMoreSolutions > 0 &&
                    `还有${hiddenMoreSolutions}种方案`}
                </>
              )
            })()}
          </View>
        </>
      ))}
  </>
)
const MemoedSolutionView = memo(SolutionView)

const SolutionVisualization: React.FunctionComponent<SolutionVisualizationProps> = ({
  strategyResult,
  rank,
  onClose,
  windowSize,
}) => (
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
      {/* <View style={{ width: 2, backgroundColor: 'black' }} /> */}
      <CloseWindowButton
        onClose={onClose}
        style={{
          // to the right and centered
          position: 'absolute',
          right: 0,
          height: '100%',
        }}
      />
    </View>
    <Divider />
    <ScrollView
      style={[
        commonStyles.container,
        {
          flex: 2,
        },
      ]}
    >
      {strategyResult.map((result) => (
        <MemoedSolutionView
          strategyResult={result}
          rank={rank}
          windowSize={windowSize}
        />
      ))}
    </ScrollView>
  </>
)

export default React.memo(SolutionVisualization)
