#include <cmath>
#include <iostream>
#include <cstdio>
#include <utility>
#include <map>
#include <set>
#include <string>
#include <vector>
#include <list>

using namespace std;

typedef pair <int, char> TCard;
typedef map <int, multiset<char> > THandCards;
typedef list <string> TSolutions;
const int JOKER=100000;
const string SUITS="SHDCA";

int count(THandCards hc)
{
    THandCards::iterator it;
    int cnt[5];
    for(int i=1; i<=4; i++)cnt[i]=0;
    for(it=hc.begin(); it!=hc.end(); it++)
    {
        if((*it).second.size()<=3)cnt[(*it).second.size()]++;
        else cnt[4]++;
    }
    //cout<<"new "<<cnt[1]<<' '<<cnt[2]<<' '<<cnt[3]<<' '<<cnt[4]<<endl;
    return cnt[3]>cnt[2]?cnt[1]+cnt[3]:cnt[1]+cnt[2];
}

void AddCard(THandCards& hc, char ch1, char ch2)
{
    TCard tmp;
    tmp.second=ch2;
    if(ch1-'0'<=9&&ch1-'0'>=2)
    {
        tmp.first=ch1-'0';
    }
    else if(ch1=='A')
    {
        tmp.first=1;
    }
    else if(ch1=='J')
    {
        tmp.first=11;
    }
    else if(ch1=='K')
    {
        tmp.first=13;
    }
    else if(ch1=='Q')
    {
        tmp.first=12;
    }
    else if(ch1=='0')
    {
        tmp.first=10;
    }
    else if(ch1=='B')
    {
        tmp.first=JOKER+1;
    }
    else if(ch1=='S')
    {
        tmp.first=JOKER;
    }
    hc[tmp.first].insert(tmp.second);
}

string CardToStr(int num, char suit)
{
    string str="";
    if(num>=2&&num<=9)
    {
        str+=num+'0';
    }
    else if(num==1)
    {
        str+="A";
    }
    else if(num==11)
    {
        str+="J";
    }
    else if(num==13)
    {
        str+="K";
    }
    else if(num==12)
    {
        str+="Q";
    }
    else if(num==10)
    {
        str+="0";
    }
    else if(num==JOKER+1)
    {
        str+="B";
    }
    else if(num==JOKER)
    {
        str+="S";
    }
    str+=suit;
    return str;
}

// Suit: S-Spade C-Club D-Diamond H-Heart A-All
int ExistShunZi(THandCards & hc, int StartingNumber, int Length, int HandNum, char Suit, THandCards & oneHand)
{
    bool f=true;
    oneHand.clear();
    if(Suit=='A')
    {
        for(int k=StartingNumber; k<StartingNumber+Length; k++)
        {
            int i=k==14?1:k;
            if(hc[i].size()<HandNum)
            {
                f=false;
                break;
            }
        }
        if(!f)return false;
        for(int k=StartingNumber; k<StartingNumber+Length; k++)
        {
            int i=k==14?1:k;
            multiset<char>::iterator it;
            int j;
            for(j=0,it=hc[i].begin(); j<HandNum; j++,it++)
            {
                if(it==hc[i].end())
                {
                    cout<<"error 001"<<endl; //debug
                    return -1;
                }
                oneHand[i].insert(*it);
            }
        }
    }
    else
    {
        for(int k=StartingNumber; k<StartingNumber+Length; k++)
        {
            int i=k==14?1:k;
            if(hc[i].count(Suit)<HandNum)
            {
                f=false;
                break;
            }
        }
        if(!f)return 0;
        for(int k=StartingNumber; k<StartingNumber+Length; k++)
        {
            int i=k==14?1:k;
            for(int j=0; j<HandNum; j++)
            {
                oneHand[i].insert(Suit);
            }
        }
    }
    return 1;
}

int Chu(THandCards & hc, THandCards & oneHand)
{
    THandCards::iterator it;
    for(it=oneHand.begin(); it!=oneHand.end(); it++)
    {
        multiset<char>::iterator it2;
        for(it2=(*it).second.begin(); it2!=(*it).second.end(); it2++)
        {
            multiset<char>::iterator it3;
            it3=hc[(*it).first].lower_bound(*it2);
            if(it3==hc[(*it).first].end()||(*it3)!=(*it2))
            {
                cout<<"Error 2"<<endl; //debug
                return -1;
            }
            else
            {
                hc[(*it).first].erase(it3);
            }
        }
    }
    return 0;
}

int Mo(THandCards & hc, THandCards & oneHand)
{
    THandCards::iterator it;
    for(it=oneHand.begin(); it!=oneHand.end(); it++)
    {
        multiset<char>::iterator it2;
        for(it2=(*it).second.begin(); it2!=(*it).second.end(); it2++)
        {
            hc[(*it).first].insert(*it2);
        }
    }
    return 0;
}

string handToStr(THandCards hc)
{
    string str="";
    THandCards::iterator it;
    for(it=hc.begin(); it!=hc.end(); it++)
    {
        multiset<char>::iterator it2;
        for(it2=(*it).second.begin(); it2!=(*it).second.end(); it2++)
        {
            str+=CardToStr((*it).first,*it2)+' ';
        }
    }
    return str;
}

int check(THandCards & hc, list<string> & ASolution, int CurrentTypePosition, int CurrentStartingNumPosition)
{
    THandCards::iterator it;
    int TypePosition=0;
    int min=count(hc);
    ASolution.push_back("| "+handToStr(hc)+"|");
    for(int tt=0; tt<5; tt++)        //shunzi
    {
        char NowSuit=SUITS[tt];
        TypePosition++;
        if(CurrentTypePosition>TypePosition)continue;
        else if(CurrentTypePosition<TypePosition)CurrentStartingNumPosition=0;
        //else if(CurrentTypePosition==TypePosition)CurrentStartingNum=0;
        for(it=hc.begin(); it!=hc.end(); it++)
        {
            int StartingNumber=(*it).first;
            if(StartingNumber<CurrentStartingNumPosition)continue;
            THandCards oneHand;
            int status=ExistShunZi(hc, StartingNumber, 5, 1, NowSuit, oneHand);
            if(status>0)
            {
                Chu(hc, oneHand);
                list<string> tmpSolution;
                int t=check(hc, tmpSolution, TypePosition, StartingNumber);//, StartingNumber);
                if(NowSuit!='A')t--;
                if(t+1<=min)
                {
                    if(t+1<min)ASolution.clear();
                    min=t+1;
                    for(TSolutions::iterator it=tmpSolution.begin(); it!=tmpSolution.end(); it++)
                    {
                        (*it)+="| "+handToStr(oneHand)+"|";
                    }
                    ASolution.splice(ASolution.end(), tmpSolution, tmpSolution.begin(), tmpSolution.end());
                }
                Mo(hc, oneHand);
            }  //else potential_debug
        }
    }
    char NowSuit='A';
    TypePosition++;
    if(CurrentTypePosition<=TypePosition)
    {
        if(CurrentTypePosition<TypePosition)CurrentStartingNumPosition=0;
        for(it=hc.begin(); it!=hc.end(); it++)
        {
            int StartingNumber=(*it).first;
            if(StartingNumber<CurrentStartingNumPosition)continue;
            THandCards oneHand;
            int status=ExistShunZi(hc, StartingNumber, 3, 2, NowSuit, oneHand);
            if(status>0)
            {
                Chu(hc, oneHand);
                list<string> tmpSolution;
                int t=check(hc, tmpSolution, TypePosition, StartingNumber);
                if(t+1<=min)
                {
                    if(t+1<min)ASolution.clear();
                    min=t+1;
                    for(TSolutions::iterator it=tmpSolution.begin(); it!=tmpSolution.end(); it++)
                    {
                        (*it)+="| "+handToStr(oneHand)+"|";
                    }
                    ASolution.splice(ASolution.end(), tmpSolution, tmpSolution.begin(), tmpSolution.end());
                }
                Mo(hc, oneHand);
            }  //else potential_debug
        }
    }
    NowSuit='A';
    TypePosition++;
    if(CurrentTypePosition<=TypePosition)
    {
        if(CurrentTypePosition<TypePosition)CurrentStartingNumPosition=0;
        for(it=hc.begin(); it!=hc.end(); it++)
        {
            int StartingNumber=(*it).first;
            if(StartingNumber<CurrentStartingNumPosition)continue;
            THandCards oneHand;
            int status=ExistShunZi(hc, StartingNumber, 2, 3, NowSuit, oneHand);
            if(status>0)
            {
                Chu(hc, oneHand);
                list<string> tmpSolution;
                int t=check(hc, tmpSolution, TypePosition, StartingNumber);
                if(t+1<=min)
                {
                    if(t+1<min)ASolution.clear();
                    min=t+1;
                    for(TSolutions::iterator it=tmpSolution.begin(); it!=tmpSolution.end(); it++)
                    {
                        (*it)+="| "+handToStr(oneHand)+"|";
                    }
                    ASolution.splice(ASolution.end(), tmpSolution, tmpSolution.begin(), tmpSolution.end());
                }
                Mo(hc, oneHand);
            }  //else potential_debug
        }
    }
    return min;
}

int TestTrumpCard(THandCards & hc, int n, int & min, TSolutions & solution, int si, int sj, THandCards & UsedAs)
{
    if(n<=0)
    {
        TSolutions ASolution;
        int t=check(hc, ASolution, 0, 0);
        if(t<=min)
        {
            if(t<min)solution.clear();
            min=t;
            solution.push_back("------------- "+handToStr(UsedAs)+"------------");
            solution.splice(solution.end(), ASolution, ASolution.begin(), ASolution.end());
        }
        return 0;
    }
    for(int i=si; i<=13; i++)
    {
        for(int j=0; j<4; j++)
        {
            if(i==si)
            {
                if(j<sj)continue;
            }
            THandCards oneHand;
            oneHand[i].insert(SUITS[j]);
            Mo(hc, oneHand);
            Mo(UsedAs, oneHand);
            TestTrumpCard(hc, n-1, min, solution,i,j,UsedAs);
            Chu(hc, oneHand);
            Chu(UsedAs, oneHand);
        }
    }
    return 0;
}

int main()
{
    freopen("input.txt","r",stdin);
    freopen("output.txt","w",stdout);
    THandCards hc,UsedAs;
    list<string> solution;
    cout<<"红桃：?H | 黑桃：?S | 梅花：?C | 方块：?D | 小鬼：SJ | 大鬼：BJ | 数字10：0? | 其余和牌面相同"<<endl;
    int N;
    cout<<"Enter the number of cards:";
    cin>>N;
    cout<<"Enter the main rank:";
    int n=0;
    char mainRank;
    cin>>mainRank;
    cout<<"Enter the cards:";
    for(int i=0; i<N; i++)
    {
        char ch1,ch2;
        cin>>ch1>>ch2;
        if(ch1==mainRank&&ch2=='H')n++;
        else AddCard(hc,ch1,ch2);
        //cout<<ch1<<ch2<<' '<<tmp.first<<' '<<tmp.second<<endl;
    }
    int min=10000;
    TestTrumpCard(hc, n, min, solution,1,0,UsedAs);
    cout<<"Least hands: "<<min<<endl;
    TSolutions::iterator it;
    for(it=solution.begin(); it!=solution.end(); it++)
    {
        cout<<*it<<endl;
    }
    return 0;
}
