import React, { Fragment, useCallback, useState } from 'react'
import { View } from 'react-native'
import { CardsChooser } from './CardsChooser'
import { AppState, NavigationProps } from './common/types'
import { Divider } from './Divider'
import { MyButton } from './MyButton'
import { RankChooser } from './RankChooser'
import { calc } from './strategy/strategy'
import { commonStyles } from './styles'

interface StatelessHomePageProps
  extends Pick<
      AppState,
      | 'rank'
      | 'setRank'
      | 'cards'
      | 'clearCards'
      | 'addCard'
      | 'randomCards'
      | 'deleteLastCard'
      | 'windowSize'
    >,
    Pick<NavigationProps, 'navigation'> {}
const HomePage: React.FunctionComponent<StatelessHomePageProps> = ({
  rank,
  setRank,
  cards,
  clearCards,
  addCard,
  randomCards,
  deleteLastCard,
  navigation,
  windowSize,
}) => {
  const handleSolutionCalcButton = useCallback(() => {
    navigation.navigate('Result')
  }, [])

  return (
    <Fragment>
      <View
        style={[
          commonStyles.container,
          {
            flexDirection: 'row',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <RankChooser rank={rank} setRank={setRank} />
      </View>
      <Divider />
      <View
        style={{
          flex: 1,
        }}
      >
        <CardsChooser
          cards={cards}
          addCard={addCard}
          clearCards={clearCards}
          randomCards={randomCards}
          deleteLastCard={deleteLastCard}
          windowSize={windowSize}
        />
      </View>
      <View
        style={[
          commonStyles.container,
          {
            justifyContent: 'center',
            padding: 6,
          },
        ]}
      >
        {(() => {
          return (
            <MyButton
              title={'开始拆牌'}
              onPress={handleSolutionCalcButton}
              style={{
                height: 60,
              }}
              titleStyle={{
                fontSize: 28,
              }}
            />
          )
        })()}
      </View>
    </Fragment>
  )
}

const MemoedHomePage = React.memo(HomePage)

function HomePageWrapper({ screenProps, navigation }: NavigationProps) {
  return <MemoedHomePage {...screenProps} navigation={navigation} />
}

export default HomePageWrapper
