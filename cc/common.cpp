#include "common.hpp"

void debug(THandCards& hc) {
#ifdef __DEBUG__
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
#endif
}

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

/**
 * Returns range[0, 14], order of the rank in this gameplay.
 * The smallest is 0. The largest (red joker) is 14.
 */
int GameContext::getOrder(int rank) const {
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

string wildCardsToStr(int wildCards) {
  string str = "";
  for (int i = 0; i < wildCards; ++i) {
    str += "WC ";  // wild card
  }
  return str;
}

string handToStr(THandCards hc, int wildCards) {
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

CardsState parseCardState(string cards, char mainRank) {
  CardsState state{};
  for (int i = 0; i < cards.length() / 2; i++) {
    char ch1 = cards[i * 2], ch2 = cards[i * 2 + 1];
    if (ch1 == mainRank && ch2 == 'H')
      state.wildCards++;
    else
      AddCard(state.hc, ch1, ch2);
  }
  return state;
}

double linear(double l, double r, double valueL, double valueR, double x) {
  assert(l < r);
  return (x - l) * (valueR - valueL) / (r - l) + valueL;
}
