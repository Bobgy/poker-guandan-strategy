#include <iostream>
#include "../strategy.cpp"

void printStrategyResult(const StrategyResult& result, const char* prefix) {
  cout << prefix << "cost=" << result.cost << endl;
  cout << "solutions=[" << endl;
  for (auto solution : result.solutions) {
    cout << "  '" << solution << "'," << endl;
  }
  cout << "]" << endl;
}

int main(int argc, char* argv[]) {
  int T;
  cin >> T;
  while (T--) {
    THandCards hc, UsedAs;
    list<string> solution;

    int N = 27;
    int n = 0;
    char mainRank;
    cin >> mainRank;
    string cards;
    cin >> cards;
    cout << "cards=" << cards << endl;
    cout << "mainRank=" << mainRank << endl;
    StrategyResult resultMinPlays = calcForTest(cards, mainRank, false);
    printStrategyResult(resultMinPlays, "min_plays_");
    StrategyResult resultOverallValue = calcForTest(cards, mainRank, true);
    printStrategyResult(resultOverallValue, "overall_value_");
    cout << endl;
  }
  return 0;
}
