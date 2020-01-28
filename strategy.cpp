#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

#else

// remove this token when not in emscripten context
#define EMSCRIPTEN_KEEPALIVE

#endif

// #define __DEBUG__
// #define __INFO__

#include <cassert>
#include <cmath>
#include <iostream>
#include <list>
#include <map>
#include <memory>
#include <set>
#include <string>
#include <utility>
#include <vector>
#include "cc/common.hpp"

using namespace std;

class CostEstimator {
 public:
  virtual double estimate(PlayRank playRank) const = 0;
  virtual double estimateCards(const THandCards& hc, int wildCards) const = 0;
  virtual ~CostEstimator(){};

 protected:
  GameContext context;
};

int cntRecursion = 0;

/**
 * calculates min number of hands needed using just hand patterns of 1s, 2s, 3s,
 *full houses and bombs
 *
 ** cnti: cnti means how many card ranks have exactly i cards
 * so i has valid range [1, 3] for calculating how many hands left
 ** wildCards: number of wildcards available, belong to range [0, 2] in a valid
 *game
 *
 ** returns min hands needed
 */
int calculateMinHandsImp(int cnt1,
                         int cnt2,
                         int cnt3,
                         int cnt4plus,
                         int wildCards) {
  ++cntRecursion;
  if (wildCards <= 0) {
    return cnt1 + max(cnt2, cnt3);
  } else {
    int minHandsPossible = INF;
    if (cnt1 > 0) {
      // use one wildcard to play a *single* as a *pair*
      minHandsPossible =
          min(minHandsPossible, calculateMinHandsImp(cnt1 - 1, cnt2 + 1, cnt3,
                                                     cnt4plus, wildCards - 1));
    }
    if (cnt2 > 0) {
      // use one wildcard to play a *pair* as a *triple*
      minHandsPossible =
          min(minHandsPossible, calculateMinHandsImp(cnt1, cnt2 - 1, cnt3 + 1,
                                                     cnt4plus, wildCards - 1));
    }
    if (cnt3 > 0) {
      // use one wildcard to play a *triple* as a *bomb*
      minHandsPossible = min(minHandsPossible,
                             calculateMinHandsImp(cnt1, cnt2, cnt3 - 1,
                                                  cnt4plus + 1, wildCards - 1));
    }
    if (cnt4plus > 0) {
      // use one wildcard to play a *bomb* as a larger *bomb*
      minHandsPossible =
          min(minHandsPossible,
              calculateMinHandsImp(cnt1, cnt2, cnt3, cnt4plus, wildCards - 1));
    }
    // use one wildcard as a *single*
    minHandsPossible = min(
        minHandsPossible,
        calculateMinHandsImp(cnt1 + 1, cnt2, cnt3, cnt4plus, wildCards - 1));

    return minHandsPossible;
  }
}

/**
 * Calculates min number of hands needed using just hand patterns of 1s, 2s, 3s,
 * full houses and bombs.
 * Hand definition, some cards combination that can be played at a single round.
 * Bomb and jokers can almost always be played, so they count as 0 hands. Others
 * count as one, e.g. 33322
 *
 ** hc: a full hand of cards definition
 ** wildCards: number of wildcards available, belong to range [0, 2] in a valid
 *game
 *
 ** returns min hands needed
 */
int calculateMinHands(THandCards hc, int wildCards) {
  THandCards::iterator it;
  int cnt[5];
  for (int i = 1; i <= 4; i++)
    cnt[i] = 0;

  for (it = hc.begin(); it != hc.end(); it++) {
    if ((*it).first >= BLACK_JOKER) {
      continue;  // skip jokers completely
    }
    if ((*it).second.size() <= 3)
      cnt[(*it).second.size()]++;
    else
      cnt[4]++;
  }

  return calculateMinHandsImp(cnt[1], cnt[2], cnt[3], cnt[4], wildCards);
}

class MinPlaysCostEstimator : public CostEstimator {
 public:
  MinPlaysCostEstimator(GameContext argContext) { context = argContext; }
  ~MinPlaysCostEstimator() {}
  double estimate(PlayRank playRank) const {
    switch (playRank.type) {
      case BOMB_NORMAL:
      case STRAIGHT_FLUSH:
      case FOUR_JOKER:
        return 0.0;  // 0 plays, because you can play them any time
      default:
        return 1.0;  // 1 play
    }
  }
  double estimateCards(const THandCards& hc, int wildCards) const {
    return (double)calculateMinHands(hc, wildCards);
  }
};

class OverallValueCostEstimator : public CostEstimator {
 public:
  OverallValueCostEstimator(GameContext argContext) { context = argContext; }
  ~OverallValueCostEstimator() {}
  // {@returns cost} cost is a real number. [-2, 2]
  // -2 means stopping opponent from playing a card and plays a small card.
  // 2 means playing a small card and let opponent play a small card.
  double estimate(PlayRank playRank) const {
    const int rank = playRank.rank;
    const int actualRank = getActualRank(rank);
    const int order = context.getOrder(rank);
    switch (playRank.type) {
      case SINGLE:
        switch (order) {
          case 14:  // red joker
            return -1.0;
          case 13:  // black joker
            return -0.2;
          case 12:  // main rank
            return -0.1;
          default:
            return linear(0, 11, 1.3, 0.0, order);
        }
      case PAIR:
        switch (order) {
          case 14:  // red joker
            return -1.0;
          case 13:  // black joker
            return -0.9;
          case 12:  // main rank
            return -0.8;
          case 11:
            return -0.5;
          default:
            return linear(0, 10, 1.0, -0.1, order);
        }
      case TRIPLE:  // ASSUMPTION: tripes and full house are equivalent.
                    // TODO: avoid this assumption
      case FULL_HOUSE:
        assert(order <= 12);  // joker cannot be triples
        switch (order) {
          case 12:
            return -0.9;
          case 11:
            return -0.8;
          case 10:
            return -0.6;
          default:
            return linear(0, 9, 1.0, -0.3, order);
        }
      case STRAIGHT:
        assert(actualRank >= 1 &&
               actualRank <= 10);  // largest valid straight is 10,J,Q,K,A
        return 0.6 * linear(1, 10, 1.0, -1.0, actualRank);
      case TUBE:
        assert(actualRank >= 1 &&
               actualRank <= 12);  // largest valid tube is QQKKAA
        return 0.4 * linear(1, 12, 1.0, -1.0, actualRank);
      case PLATE:
        assert(actualRank >= 1 &&
               actualRank <= 13);  // largest valid plate is KKKAAA
        return 0.3 * linear(1, 13, 1.0, -1.0, actualRank);
      case BOMB_NORMAL:
        return playRank.count >= 6
                   ? -1.9
                   : playRank.count == 5 ? linear(0, 12, -1.5, -1.7, order)
                                         : linear(0, 12, -1.0, -1.3, order);
      case STRAIGHT_FLUSH:
        assert(actualRank >= 1 &&
               actualRank <= 10);  // largest valid straight is 10,J,Q,K,A
        // 5 to 14 means
        // 1,2,3,4,5 to 10,J,Q,K,A
        return linear(5, 14, -1.3, -1.5, actualRank);
      case FOUR_JOKER:
        return -2.0;
      default:
        throw invalid_argument("playRank.type has unknown type");
    }
  }
  double estimateCards(const THandCards& hc, int wildCards) const {
    int rankCounts[RANK_MAX + 1] = {};
    for (const auto cards : hc) {
      assert(cards.first <= RANK_MAX);
      rankCounts[cards.first] = cards.second.size();
    }
    return estimateCardsImp(rankCounts, wildCards);
  }

 private:
  double estimateCardsImp(int rankCounts[RANK_MAX + 1], int wildCards) const {
    assert(wildCards >= 0);
    if (wildCards == 0) {
      int pairsInFullhouses = 0;
      double valueSum = 0.0;
      // Count triples, accumulate value for triples
      for (int rank = 1; rank <= RANK_K; ++rank) {
        if (rankCounts[rank] == 3) {
          pairsInFullhouses++;
          valueSum += estimate(makePlayRank(TRIPLE, rank));
        }
      }
      for (int rank = 1; rank <= RANK_K; ++rank) {
        int value;
        switch (rankCounts[rank]) {
          case 1:
            valueSum += estimate(makePlayRank(SINGLE, rank));
            break;
          case 2:
            value = estimate(makePlayRank(PAIR, rank));
            if (value > 0 && pairsInFullhouses > 0) {
              pairsInFullhouses--;
            } else {
              valueSum += value;
            }
            break;
          case 3:
            // triples have already been calculated
            break;
          case 0:
            // zeros can be skipped
            break;
          default:
            assert(rankCounts[rank] >= 0);
            // there could be 8 cards + 2 wildcards
            assert(rankCounts[rank] <= 10);
            valueSum += estimate(makeBomb(rank, rankCounts[rank]));
        }
      }
      valueSum +=
          rankCounts[BLACK_JOKER] * estimate(makePlayRank(SINGLE, BLACK_JOKER));
      valueSum +=
          rankCounts[RED_JOKER] * estimate(makePlayRank(SINGLE, RED_JOKER));
      return valueSum;
    } else {
      double minValueSum = 10000000;
      for (int wildCardAsRank = 1; wildCardAsRank <= RANK_K; ++wildCardAsRank) {
        ++rankCounts[wildCardAsRank];
        minValueSum =
            min(minValueSum, estimateCardsImp(rankCounts, wildCards - 1));
        --rankCounts[wildCardAsRank];
      }
      return minValueSum;
    }
  }
};

double check(THandCards& hc,
             list<string>& ASolution,
             int wildCardsLeft,
             const CostEstimator& costEstimator,
             int CurrentTypePosition = 0,
             int CurrentStartingNumPosition = 1);

void tryExtractOneHand(char NowSuit,
                       int seriesCount,
                       int cardCount,
                       int& TypePosition,
                       int CurrentTypePosition,
                       int& CurrentStartingNumPosition,
                       THandCards& hc,
                       int wildCardsLeft,
                       const CostEstimator& costEstimator,
                       TSolutions& ASolution,
                       double& min) {
  TypePosition++;
  if (CurrentTypePosition > TypePosition)
    return;
  else if (CurrentTypePosition < TypePosition)
    CurrentStartingNumPosition = 1;
  for (int StartingNumber = CurrentStartingNumPosition;
       StartingNumber + seriesCount - 1 <= 14; ++StartingNumber) {
    THandCards oneHand;
    int outWildCardsToUse = 0;
    bool exists = ExistShunZi(hc, wildCardsLeft, StartingNumber, seriesCount,
                              cardCount, NowSuit, oneHand, outWildCardsToUse);
    if (exists) {
#ifdef __DEBUG__
      cerr << wildCardsLeft << " Found: ";
      debug(oneHand);
#endif

      Chu(hc, oneHand);
      list<string> tmpSolution;
      PlayRank playRank(
          (seriesCount == 5 && cardCount == 1)
              ? makePlayRank(NowSuit != 'A' ? STRAIGHT_FLUSH : STRAIGHT,
                             StartingNumber)
              : (seriesCount == 3 && cardCount == 2)
                    ? makePlayRank(TUBE, StartingNumber)
                    : (seriesCount == 2 && cardCount == 3)
                          ? makePlayRank(PLATE, StartingNumber)
                          : makePlayRank(
                                UNKNOWN,
                                StartingNumber)  // should never hit here
      );
      double remainingCost =
          check(hc, tmpSolution, wildCardsLeft - outWildCardsToUse,
                costEstimator, TypePosition, StartingNumber) +
          costEstimator.estimate(playRank);
      if (remainingCost <= min) {
        if (remainingCost < min)
          ASolution.clear();
        min = remainingCost;
        for (TSolutions::iterator it = tmpSolution.begin();
             it != tmpSolution.end(); it++) {
          (*it) += "| " + handToStr(oneHand, outWildCardsToUse) + "|";
        }
        ASolution.splice(ASolution.end(), tmpSolution, tmpSolution.begin(),
                         tmpSolution.end());
      }
      Mo(hc, oneHand);
    }
  }
}

double check(THandCards& hc,
             list<string>& ASolution,
             int wildCardsLeft,
             const CostEstimator& costEstimator,
             int CurrentTypePosition,
             int CurrentStartingNumPosition) {
#ifdef __DEBUG__
  cerr << wildCardsLeft << " ";
  debug(hc);
#endif

  THandCards::iterator it;
  int TypePosition = 0;
  double min = costEstimator.estimateCards(hc, wildCardsLeft);
  ASolution.push_back("| " + handToStr(hc, wildCardsLeft) + "|");
  // try flushes -> straight flush
  for (int tt = 0; tt < 5; tt++) {
    tryExtractOneHand(SUITS[tt], 5, 1, TypePosition, CurrentTypePosition,
                      CurrentStartingNumPosition, hc, wildCardsLeft,
                      costEstimator, ASolution, min);
  }
  tryExtractOneHand('A', 3, 2, TypePosition, CurrentTypePosition,
                    CurrentStartingNumPosition, hc, wildCardsLeft,
                    costEstimator, ASolution, min);
  tryExtractOneHand('A', 2, 3, TypePosition, CurrentTypePosition,
                    CurrentStartingNumPosition, hc, wildCardsLeft,
                    costEstimator, ASolution, min);
  return min;
}

// cards: cards represented in string
// 红桃：?H | 黑桃：?S | 梅花：?C | 方块：?D | 小鬼：XB | 大鬼：XR | 数字10：0 ?
// | 其余和牌面相同 mainRank: main rank, starting from 2
EMSCRIPTEN_KEEPALIVE StrategyResult calc(string cards,
                                         char mainRank,
                                         bool useOverallValueEstimator) {
  CardsState state = parseCardState(cards, mainRank);
  int rank = parseRankFromChar(mainRank);
  GameContext context{rank};
  const unique_ptr<CostEstimator> costEstimator(
      useOverallValueEstimator
          ? (CostEstimator*)new OverallValueCostEstimator(context)
          : (CostEstimator*)new MinPlaysCostEstimator(context));

  list<string> solution;
  cntRecursion = 0;
  double minCost = check(state.hc, solution, state.wildCards, *costEstimator);
#ifdef __INFO__
  cerr << "Recursions: " << cntRecursion << " Wildcards: " << state.wildCards
       << endl;
#endif
  return StrategyResult(
      {minCost, vector<string>(solution.begin(), solution.end())});
}

#ifdef __EMSCRIPTEN__

namespace emscripten {
EMSCRIPTEN_BINDINGS(my_module) {
  function("calc", &calc);

  register_vector<string>("vector<string>");
  value_object<StrategyResult>("StrategyResult")
      .field("minHands", &StrategyResult::cost)
      .field("solutions", &StrategyResult::solutions);
}
}  // namespace emscripten

#endif
