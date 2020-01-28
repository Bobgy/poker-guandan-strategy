#ifndef __GUANDAN_COMMON__
#define __GUANDAN_COMMON__

#include <list>
#include <map>
#include <set>
#include <string>
#include <vector>

using namespace std;

typedef pair<int, char> TCard;
typedef map<int, multiset<char>> THandCards;
typedef list<string> TSolutions;
const int JOKER = 15;
const int BLACK_JOKER = JOKER;
const int RED_JOKER = BLACK_JOKER + 1;
const int RANK_MAX = RED_JOKER;
const int RANK_K = 13;
const string SUITS = "SHDCA";
const int INF = 100000;

void debug(THandCards& hc);

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
PlayRank makePlayRank(PlayType type, int rank);
PlayRank makeBomb(int rank, int count);
PlayRank makeFourJoker();

// rank 14 -> A -> should be found at rank 1
int getActualRank(int rank);
// in ordinal rank, A should be found at rank 14
int getOrdinalRank(int rank);

struct GameContext {
  // Which rank is largest in current game play.
  int mainRank;

  /**
   * Returns range[0, 14], order of the rank in this gameplay.
   * The smallest is 0. The largest (red joker) is 14.
   */
  int getOrder(int rank) const;
};

string CardToStr(int num, char suit);
string wildCardsToStr(int wildCards);
string handToStr(THandCards hc, int wildCards = 0);
bool ExistShunZi(THandCards& hc,
                 int wildCards,
                 int StartingNumber,
                 int Length,
                 int HandNum,
                 char Suit,
                 THandCards& oneHand,
                 int& wildCardsToUse);

int parseRankFromChar(char rank);
void AddCard(THandCards& hc, char ch1, char ch2);
int Chu(THandCards& hc, THandCards& oneHand);
int Mo(THandCards& hc, THandCards& oneHand);

struct StrategyResult {
  double cost;
  vector<string> solutions;
};

struct CardsState {
  THandCards hc;
  int wildCards;
};
CardsState parseCardState(string cards, char mainRank);

// math functions
double linear(double l, double r, double valueL, double valueR, double x);

#endif
