#include <iostream>
#include "../strategy.cpp"

void printStrategyResult(const StrategyResult &result) {
    cout << "cost=" << result.cost << endl;
    cout << "solutions=[" << endl;
    for (auto solution: result.solutions) {
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
        StrategyResult resultMinPlays = calcForTest(cards, mainRank, false);
        cout << "cards=" << cards << endl;
        cout << "mainRank=" << mainRank << endl;
        cout << "costMinPlays=" << resultMinPlays.cost << endl;
        StrategyResult resultOverallValue = calcForTest(cards, mainRank, true);
        printStrategyResult(resultOverallValue);
    }
    return 0;
}
