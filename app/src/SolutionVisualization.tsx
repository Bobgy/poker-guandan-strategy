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
import { parseRawCard } from './cardUtils'
import { StrategyResultState } from './useResultState'
import { ReactComponent as Close } from './icons/close.svg'
import { ReactComponent as Info } from './icons/info.svg'
import { WindowSize } from './useWindowSize'

interface SolutionVisualizationProps {
  strategyResult: StrategyResultState
  rank: string
  windowSize: WindowSize
  onClose: () => void
}

interface WindowSizeToggleProps {
  onClose: () => void
  style: StyleProp<ViewStyle>
}
const CloseWindowButton: React.FunctionComponent<
  WindowSizeToggleProps
> = props => (
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

interface SolutionWindowProps {
  rank: string
  strategyResult: StrategyResultState
  windowSize: WindowSize
}
const SolutionWindow: React.FunctionComponent<SolutionWindowProps> = ({
  strategyResult,
  rank,
  windowSize,
}) => (
  <ScrollView
    style={[
      commonStyles.container,
      {
        flex: 2,
      },
    ]}
  >
    {strategyResult &&
      (strategyResult === 'loading' ? (
        <Text
          style={{
            fontSize: 20,
          }}
        >
          {/* 计算中... */}
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
            >{`最少${strategyResult.minHands}手牌`}</Text>
            <Text style={{ textAlignVertical: 'center' }}>
              <Info style={{ width: 19, height: 19, verticalAlign: 'top' }} />
              大小王、炸弹算0手，其他牌型算1手
            </Text>
          </View>
          <View>
            {(() => {
              const solutionsCount = strategyResult.solutions.length
              const hiddenMoreSolutions = solutionsCount - 10
              return (
                <>
                  {strategyResult.solutions
                    .slice(0, 10)
                    .map((solution, solutionIndex) => (
                      <CardDeck
                        key={solutionIndex}
                        hands={solution.actualHands.map(hand =>
                          hand.map(card =>
                            parseRawCard(card, {
                              rank: rank,
                              suit: 'H',
                            }),
                          ),
                        )}
                        style={{
                          margin: 6,
                        }}
                        large={windowSize === 'BIG'}
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
> = ({ strategyResult, rank, onClose, windowSize }) => (
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
    <MemoedSolutionWindow
      strategyResult={strategyResult}
      rank={rank}
      windowSize={windowSize}
    />
  </>
)

export default React.memo(SolutionVisualization)
