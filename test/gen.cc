#include <algorithm>
#include <string>
#include <vector>

using namespace std;
#define REP(i, n) for (int i = 0; i < int(n); ++i)
#define pb push_back
#define mp make_pair
int R(int l, int r) {
  return rand() % (r - l + 1) + l;
}
vector<pair<char, char> > cards;
int main() {
  string rank = "A234567890JQK", suit = "HDSC";
  REP(i, rank.size()) REP(j, suit.size()) {
    cards.pb(mp(rank[i], suit[j]));
    cards.pb(mp(rank[i], suit[j]));
  }
  cards.pb(mp('X', 'R'));
  cards.pb(mp('X', 'R'));
  cards.pb(mp('X', 'B'));
  cards.pb(mp('X', 'B'));
  int T = 100;
  printf("%d\n", T);
  while (T--) {
    putchar(rank[rand() % 13]);
    putchar('\n');
    random_shuffle(cards.begin(), cards.end());
    REP(i, 27) {
      putchar(cards[i].first);
      putchar(cards[i].second);
    }
    putchar('\n');
  }
}
