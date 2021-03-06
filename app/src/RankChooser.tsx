import React from 'react'
import { View, Text, Picker } from 'react-native'
import { RankState } from './common/types'
import { SUIT } from './strategy/models/Suite'
import {
  BLACK_JOKER,
  NaturalRankWithoutJokers,
  NATURAL_RANK,
  NATURAL_RANKS_WITHOUT_JOKERS,
} from './strategy/models/const'

export function RankChooser({ rank, setRank }: RankState) {
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <Text style={{ fontSize: 22, marginHorizontal: 6 }}>
        当前打
        <Picker
          selectedValue={rank}
          onValueChange={(itemValue) =>
            setRank(assertNonJokerNaturalRank(parseInt(itemValue, 10)))
          }
        >
          {NATURAL_RANKS_WITHOUT_JOKERS.map((rank) => (
            <Picker.Item
              key={rank}
              label={NATURAL_RANK[rank].label}
              value={rank}
            />
          ))}
        </Picker>{' '}
        <Text style={{ color: SUIT.H.color }}>
          {SUIT.H.label}
          {NATURAL_RANK[rank].label}
        </Text>
        是百搭
      </Text>
    </View>
  )
}

function assertNonJokerNaturalRank(rank: number): NaturalRankWithoutJokers {
  if (!Number.isInteger(rank) || rank <= 0 || rank >= BLACK_JOKER) {
    throw new Error(`rank ${rank} is not valid non-joker natural rank`)
  }
  return rank as NaturalRankWithoutJokers
}
