#include <iostream>
#include "../strategy.cpp"

int main(int argc, char * argv[]) {
    int T;
    cin>>T;
    while(T--){
        THandCards hc,UsedAs;
        list<string> solution;

        int N=27;
        int n=0;
        char mainRank;
        cin>>mainRank;
        string cards;
        cin>>cards;
        StrategyResult result = calc(cards, mainRank);
        cout<<result.minHands<<endl;
    }
    return 0;
}
