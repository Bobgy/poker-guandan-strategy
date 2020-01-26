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

using namespace std;

typedef pair<int, char> TCard;
typedef map<int, multiset<char>> THandCards;
typedef list<string> TSolutions;
const int JOKER = 100000;
const int BLACK_JOKER = JOKER;
const int RED_JOKER = BLACK_JOKER + 1;
const string SUITS = "SHDCA";
const int INF = 100000;

enum PlayType {
  UNKNOWN,
  SINGLE,
  PAIR,
  TRIPLE,
  FULL_HOUSE,  // like 333,22
  STRAIGHT,    // like 12345
  TUBE,        // like 33,44,55
  PLATE,       // like 333,444
  // === The following is a bomb ===
  STRAIGHT_FLUSH,  // like 34567 all hearts
  BOMB_NORMAL,     // like 4444
  FOUR_JOKER
};
// Represents a card play's rank information
struct PlayRank {
  PlayType type;
  int rank;
  int count;  // only used in a normal bomb
};
PlayRank makePlayRank(PlayType type, int rank) {
  return PlayRank({type, rank, 0});
}
PlayRank makeBomb(int rank, int count) {
  return PlayRank({PlayType::BOMB_NORMAL, rank, count});
}
PlayRank makeFourJoker() {
  return PlayRank({PlayType::FOUR_JOKER, 0, 0});
}

// rank 14 -> A -> should be found at rank 1
int getActualRank(int rank) {
  return rank == 14 ? 1 : rank;
}
// in ordinal rank, A should be found at rank 14
int getOrdinalRank(int rank) {
  return rank == 1 ? 14 : rank;
}

struct GameContext {
  // Which rank is largest in current game play.
  int mainRank;

  /**
   * Returns range[0, 14], order of the rank in this gameplay.
   * The smallest is 0. The largest (red joker) is 14.
   */
  int getOrder(int rank) const {
    if (rank == RED_JOKER) {
      return 14;
    } else if (rank == BLACK_JOKER) {
      return 13;
    } else if (rank == mainRank) {
      return 12;
    } else {
      assert(rank >= 1 && rank <= 14);
      rank = getOrdinalRank(rank);
      int ordinalMainRank = getOrdinalRank(mainRank);
      if (rank > ordinalMainRank) {
        return rank - 3;  // 10 becomes 7, ...
      } else {
        return rank - 2;  // 2 becomes 0, 3 becomes 1, ...
      }
    }
  }
};
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

double linear(double l, double r, double valueL, double valueR, double x) {
  return (x - l) * (valueR - valueL) / (r - l) + valueL;
}

class OverallValueCostEstimator : public CostEstimator {
 public:
  OverallValueCostEstimator(GameContext argContext) { context = argContext; }
  ~OverallValueCostEstimator() {}
  // {@returns cost} cost is a real number. [-2, 2]
  // -2 means stopping opponent from playing a card and plays a small card.
  // 2 means playing a small card and let opponent play a small card.
  double estimate(PlayRank playRank) const {
    switch (playRank.type) {
      case BOMB_NORMAL:
      case STRAIGHT_FLUSH:
      case FOUR_JOKER:
        return 0.0;  // 0 plays, because you can play them any time
      default:
        return 1.0;  // 1 play
    }
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
      case TRIPLE:
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
    return (double)calculateMinHands(hc, wildCards);
  }
  //  private:
  //   double estimateCardsImp(const THandCards& hc, int wildCards) const {
  //     return
  //   }
};

#ifdef __DEBUG__
void debug(THandCards& hc) {
  for (auto entry : hc) {
    if (entry.second.size() == 0)
      continue;
    cerr << "(" << entry.first << " :";
    for (auto suite : entry.second) {
      cerr << suite << " ";
    }
    cerr << ")";
  }
  cerr << endl;
}
#endif

int parseRankFromChar(char rank) {
  if (rank >= '2' && rank <= '9') {
    return rank - '0';
  } else if (rank == 'A') {
    return 1;
  } else if (rank == 'J') {
    return 11;
  } else if (rank == 'Q') {
    return 12;
  } else if (rank == 'K') {
    return 13;
  } else if (rank == '0') {
    return 10;
  } else if (rank == 'X') {
    return JOKER;
  }

  assert("invalid card" && false);
}

void AddCard(THandCards& hc, char ch1, char ch2) {
  int rank = parseRankFromChar(ch1);
  assert(rank >= 1 && rank <= JOKER);
  TCard tmp;
  tmp.first = rank;
  tmp.second = ch2;
  if (rank == JOKER) {
    // First character cannot distinguish red joker and black joker.
    if (ch2 == 'R') {
      tmp.first = RED_JOKER;
    } else if (ch2 == 'B') {
      tmp.first = BLACK_JOKER;
    }
  }
  hc[tmp.first].insert(tmp.second);
}

string CardToStr(int num, char suit) {
  string str = "";
  if (num >= 2 && num <= 9) {
    str += num + '0';
  } else if (num == 1) {
    str += "A";
  } else if (num == 11) {
    str += "J";
  } else if (num == 13) {
    str += "K";
  } else if (num == 12) {
    str += "Q";
  } else if (num == 10) {
    str += "0";
  }

  if (num == JOKER + 1) {
    str += "XR";
  } else if (num == JOKER) {
    str += "XB";
  } else {
    str += suit;
  }
  return str;
}

// Suit: S-Spade C-Club D-Diamond H-Heart A-All
bool ExistShunZi(THandCards& hc,
                 int wildCards,
                 int StartingNumber,
                 int Length,
                 int HandNum,
                 char Suit,
                 THandCards& oneHand,
                 int& wildCardsToUse) {
  // assert the sequence is valid
  assert(StartingNumber >= 1);
  assert(StartingNumber + Length - 1 <= 14);
  oneHand.clear();
  if (Suit == 'A') {
    int cardsLacking = 0;
#ifdef __DEBUG__
    debug(hc);
    cerr << "exist shunzi " << StartingNumber << " " << Length << " " << HandNum
         << " " << endl;
#endif
    for (int k = StartingNumber; k < StartingNumber + Length; k++) {
      // cerr << " #" << k << " " << hc[getActualRank(k)].size() << "# ";
      cardsLacking += max(0, HandNum - (int)hc[getActualRank(k)].size());
    }
#ifdef __DEBUG__
    cerr << cardsLacking << " " << wildCards << endl;
#endif

    if (cardsLacking > wildCards)
      return false;

    wildCardsToUse = cardsLacking;
    for (int k = StartingNumber; k < StartingNumber + Length; k++) {
      int i = getActualRank(k);
      multiset<char>::iterator it;
      int j;
      for (j = 0, it = hc[i].begin(); j < HandNum && it != hc[i].end();
           j++, it++) {
        oneHand[i].insert(*it);
      }
    }
  } else {
    int cardsLacking = 0;
    for (int k = StartingNumber; k < StartingNumber + Length; k++) {
      cardsLacking += max(0, HandNum - (int)hc[getActualRank(k)].count(Suit));
    }

    if (cardsLacking > wildCards)
      return false;

    wildCardsToUse = cardsLacking;
    for (int k = StartingNumber; k < StartingNumber + Length; k++) {
      for (int j = 0; j < min(HandNum, (int)hc[getActualRank(k)].count(Suit));
           j++) {
        oneHand[getActualRank(k)].insert(Suit);
      }
    }
  }
  return true;
}

int Chu(THandCards& hc, THandCards& oneHand) {
  THandCards::iterator it;
  for (it = oneHand.begin(); it != oneHand.end(); it++) {
    multiset<char>::iterator it2;
    for (it2 = (*it).second.begin(); it2 != (*it).second.end(); it2++) {
      multiset<char>::iterator it3;
      it3 = hc[(*it).first].lower_bound(*it2);
      if (it3 == hc[(*it).first].end() || (*it3) != (*it2)) {
        // cout << "Error 2" << endl;  // debug
        return -1;
      } else {
        hc[(*it).first].erase(it3);
      }
    }
  }
  return 0;
}

int Mo(THandCards& hc, THandCards& oneHand) {
  THandCards::iterator it;
  for (it = oneHand.begin(); it != oneHand.end(); it++) {
    multiset<char>::iterator it2;
    for (it2 = (*it).second.begin(); it2 != (*it).second.end(); it2++) {
      hc[(*it).first].insert(*it2);
    }
  }
  return 0;
}

string wildCardsToStr(int wildCards) {
  string str = "";
  for (int i = 0; i < wildCards; ++i) {
    str += "WC ";  // wild card
  }
  return str;
}

string handToStr(THandCards hc, int wildCards = 0) {
  string str = "";
  THandCards::iterator it;
  for (it = hc.begin(); it != hc.end(); it++) {
    multiset<char>::iterator it2;
    for (it2 = (*it).second.begin(); it2 != (*it).second.end(); it2++) {
      str += CardToStr((*it).first, *it2) + ' ';
    }
  }
  str += wildCardsToStr(wildCards);
  return str;
}

int check(THandCards& hc,
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

int check(THandCards& hc,
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

struct StrategyResult {
  double cost;
  vector<string> solutions;
};

struct CardState {
  THandCards hc;
  int wildCards;
};

CardState parseCardState(string cards, char mainRank) {
  CardState state{};
  for (int i = 0; i < cards.length() / 2; i++) {
    char ch1 = cards[i * 2], ch2 = cards[i * 2 + 1];
    if (ch1 == mainRank && ch2 == 'H')
      state.wildCards++;
    else
      AddCard(state.hc, ch1, ch2);
  }
  return state;
}

// cards: cards represented in string
// 红桃：?H | 黑桃：?S | 梅花：?C | 方块：?D | 小鬼：XB | 大鬼：XR | 数字10：0 ?
// | 其余和牌面相同 mainRank: main rank, starting from 2
EMSCRIPTEN_KEEPALIVE StrategyResult calc(string cards, char mainRank) {
  CardState state = parseCardState(cards, mainRank);
  const unique_ptr<CostEstimator> costEstimator(
      new MinPlaysCostEstimator(GameContext({parseRankFromChar(mainRank)})));

  list<string> solution;
  double minCost = check(state.hc, solution, state.wildCards, *costEstimator);
  return StrategyResult(
      {minCost, vector<string>(solution.begin(), solution.end())});
}

// cards: cards represented in string
// 红桃：?H | 黑桃：?S | 梅花：?C | 方块：?D | 小鬼：XB | 大鬼：XR | 数字10：0 ?
// | 其余和牌面相同 mainRank: main rank, starting from 2
StrategyResult calcForTest(string cards,
                           char mainRank,
                           bool useOverallValueEstimator) {
  CardState state = parseCardState(cards, mainRank);
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
