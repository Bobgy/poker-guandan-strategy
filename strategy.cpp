#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

#else

// remove this token when not in emscripten context
#define EMSCRIPTEN_KEEPALIVE

#endif

#include <cassert>
#include <cmath>
#include <list>
#include <map>
#include <set>
#include <string>
#include <utility>
#include <vector>

using namespace std;

typedef pair<int, char> TCard;
typedef map<int, multiset<char>> THandCards;
typedef list<string> TSolutions;
const int JOKER = 100000;
const string SUITS = "SHDCA";
const int INF = 100000;

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
int calculateMinHandsSimple(
    int cnt1, int cnt2, int cnt3, int cnt4plus, int wildCards) {
    if (wildCards == 0) {
        return cnt1 + max(cnt2, cnt3);
    } else {
        int minHandsPossible = INF;
        if (cnt1 > 0) {
            // use one wildcard to play a *single* as a *pair*
            minHandsPossible =
                min(minHandsPossible,
                    calculateMinHandsSimple(cnt1 - 1, cnt2 + 1, cnt3, cnt4plus,
                                            wildCards - 1));
        }
        if (cnt2 > 0) {
            // use one wildcard to play a *pair* as a *triple*
            minHandsPossible =
                min(minHandsPossible,
                    calculateMinHandsSimple(cnt1, cnt2 - 1, cnt3 + 1, cnt4plus,
                                            wildCards - 2));
        }
        if (cnt3 > 0) {
            // use one wildcard to play a *triple* as a *bomb*
            minHandsPossible =
                min(minHandsPossible,
                    calculateMinHandsSimple(cnt1, cnt2, cnt3 - 1, cnt4plus + 1,
                                            wildCards - 1));
        }
        if (cnt4plus > 0) {
            // use one wildcard to play a *bomb* as a larger *bomb*
            minHandsPossible =
                min(minHandsPossible,
                    calculateMinHandsSimple(cnt1, cnt2, cnt3, cnt4plus,
                                            wildCards - 1));
        }
        // use one wildcard as a *single*
        minHandsPossible = min(
            minHandsPossible, calculateMinHandsSimple(cnt1 + 1, cnt2, cnt3,
                                                      cnt4plus, wildCards - 1));

        return minHandsPossible;
    }
}

/**
 * calculates min number of hands needed using just hand patterns of 1s, 2s, 3s,
 *full houses and bombs
 *
 ** hc: a full hand of cards definition
 ** wildCards: number of wildcards available, belong to range [0, 2] in a valid
 *game
 *
 ** returns min hands needed
 */
int count(THandCards hc, int wildCards) {
    THandCards::iterator it;
    int cnt[5];
    for (int i = 1; i <= 4; i++) cnt[i] = 0;

    // special handling for joker bomb
    bool hasJokerBomb = false;
    if (hc[JOKER].size() == 2 && hc[JOKER + 1].size() == 2) {
        hasJokerBomb = true;
    }

    for (it = hc.begin(); it != hc.end(); it++) {
        if (hasJokerBomb && (*it).first >= JOKER) {
            continue;  // skip jokers if it is a bomb
        }
        if ((*it).second.size() <= 3)
            cnt[(*it).second.size()]++;
        else
            cnt[4]++;
    }

    return calculateMinHandsSimple(cnt[1], cnt[2], cnt[3], cnt[4], wildCards);
}

void AddCard(THandCards& hc, char ch1, char ch2) {
    TCard tmp;
    tmp.second = ch2;
    if (ch1 - '0' <= 9 && ch1 - '0' >= 2) {
        tmp.first = ch1 - '0';
    } else if (ch1 == 'A') {
        tmp.first = 1;
    } else if (ch1 == 'J') {
        tmp.first = 11;
    } else if (ch1 == 'K') {
        tmp.first = 13;
    } else if (ch1 == 'Q') {
        tmp.first = 12;
    } else if (ch1 == '0') {
        tmp.first = 10;
    } else if (ch1 == 'X') {
        if (ch2 == 'R') {
            tmp.first = JOKER + 1;
        } else if (ch2 == 'B') {
            tmp.first = JOKER;
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

// rank 14 -> A -> should be found at rank 1
int getActualRank(int rank) { return rank == 14 ? 1 : rank; }

// Suit: S-Spade C-Club D-Diamond H-Heart A-All
bool ExistShunZi(THandCards& hc,
                int wildCards,
                int StartingNumber,
                int Length,
                int HandNum,
                char Suit,
                THandCards& oneHand,
                int& wildCardsToUse) {
    oneHand.clear();
    if (Suit == 'A') {
        int cardsLacking = 0;
        for (int k = StartingNumber; k < StartingNumber + Length; k++) {
            cardsLacking += max(0, HandNum - (int)hc[getActualRank(k)].size());
        }

        if (cardsLacking > wildCards) return false;

        wildCardsToUse = cardsLacking;
        for (int k = StartingNumber; k < StartingNumber + Length; k++) {
            int i = getActualRank(k);
            multiset<char>::iterator it;
            int j;
            for (j = 0, it = hc[i].begin(); j < HandNum && it != hc[i].end(); j++, it++) {
                oneHand[i].insert(*it);
            }
        }
    } else {
        int cardsLacking = 0;
        for (int k = StartingNumber; k < StartingNumber + Length; k++) {
            cardsLacking += max(0, HandNum - (int)hc[getActualRank(k)].count(Suit));
        }

        if (cardsLacking > wildCards) return false;

        wildCardsToUse = cardsLacking;
        for (int k = StartingNumber; k < StartingNumber + Length; k++) {
            for (int j = 0; j < HandNum; j++) {
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
        str += "WC "; // wild card
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
          int CurrentTypePosition = 0,
          int CurrentStartingNumPosition = 0);

void tryExtractOneHand(char NowSuit,
                       int seriesCount,
                       int cardCount,
                       int& TypePosition,
                       int CurrentTypePosition,
                       int& CurrentStartingNumPosition,
                       THandCards& hc,
                       int wildCardsLeft,
                       TSolutions& ASolution,
                       int& min) {
    TypePosition++;
    if (CurrentTypePosition > TypePosition)
        return;
    else if (CurrentTypePosition < TypePosition)
        CurrentStartingNumPosition = 0;
    for (auto it = hc.begin(); it != hc.end(); it++) {
        int StartingNumber = (*it).first;
        if (StartingNumber < CurrentStartingNumPosition) continue;
        THandCards oneHand;
        int outWildCardsToUse = 0;
        bool exists = ExistShunZi(hc, wildCardsLeft, StartingNumber, seriesCount, cardCount,
                                 NowSuit, oneHand, outWildCardsToUse);
        if (exists) {
            Chu(hc, oneHand);
            list<string> tmpSolution;
            int remainingHands =
                check(hc, tmpSolution, wildCardsLeft - outWildCardsToUse, TypePosition,
                      StartingNumber) +
                // straight flush (5 consecutive cards with the same suit) is a
                // bomb
                ((NowSuit != 'A' && seriesCount == 5 && cardCount == 1) ? 0
                                                                        : 1);
            if (remainingHands <= min) {
                if (remainingHands < min) ASolution.clear();
                min = remainingHands;
                for (TSolutions::iterator it = tmpSolution.begin();
                     it != tmpSolution.end(); it++) {
                    (*it) += "| " + handToStr(oneHand, outWildCardsToUse) + "|";
                }
                ASolution.splice(ASolution.end(), tmpSolution,
                                 tmpSolution.begin(), tmpSolution.end());
            }
            Mo(hc, oneHand);
        }
    }
}

int check(THandCards& hc,
          list<string>& ASolution,
          int wildCardsLeft,
          int CurrentTypePosition,
          int CurrentStartingNumPosition) {
    THandCards::iterator it;
    int TypePosition = 0;
    int min = count(hc, wildCardsLeft);
    ASolution.push_back("| " + handToStr(hc) + "|");
    // try flushes -> straight flush
    for (int tt = 0; tt < 5; tt++) {
        tryExtractOneHand(SUITS[tt], 5, 1, TypePosition, CurrentTypePosition,
                          CurrentStartingNumPosition, hc, wildCardsLeft,
                          ASolution, min);
    }
    tryExtractOneHand('A', 3, 2, TypePosition, CurrentTypePosition,
                      CurrentStartingNumPosition, hc, wildCardsLeft, ASolution,
                      min);
    tryExtractOneHand('A', 2, 3, TypePosition, CurrentTypePosition,
                      CurrentStartingNumPosition, hc, wildCardsLeft, ASolution,
                      min);
    return min;
}

struct StrategyResult {
    int minHands;
    vector<string> solutions;
};

// cards: cards represented in string
// 红桃：?H | 黑桃：?S | 梅花：?C | 方块：?D | 小鬼：XB | 大鬼：XR | 数字10：0 ?
// | 其余和牌面相同 mainRank: main rank, starting from 2
EMSCRIPTEN_KEEPALIVE StrategyResult calc(string cards, char mainRank) {
    THandCards hc, UsedAs;
    list<string> solution;
    int wildCards = 0;
    for (int i = 0; i < cards.length() / 2; i++) {
        char ch1 = cards[i * 2], ch2 = cards[i * 2 + 1];
        if (ch1 == mainRank && ch2 == 'H')
            wildCards++;
        else
            AddCard(hc, ch1, ch2);
    }
    int min = check(hc, solution, wildCards, 0, 0);
    return StrategyResult(
        {min, vector<string>(solution.begin(), solution.end())});
}

#ifdef __EMSCRIPTEN__

namespace emscripten {
EMSCRIPTEN_BINDINGS(my_module) {
    function("calc", &calc);

    register_vector<string>("vector<string>");
    value_object<StrategyResult>("StrategyResult")
        .field("minHands", &StrategyResult::minHands)
        .field("solutions", &StrategyResult::solutions);
}
}  // namespace emscripten

#endif