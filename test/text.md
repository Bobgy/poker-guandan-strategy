Bob is playing a poker game called *GuanDan*. The rules are similar to *PaoDeKuai* and *DouDiZhu*. Basically, the game is played on two decks of poker with four jokers in total. And there are some specific patterns of hands that you can play. They will be listed below.

#####Notation
- A card contains two characters
- The first character is its rank, the second character is its suit
- For an ordinary card, rank can be A, 2, 3, 4, 5, 6, 7, 8, 9, 0, J, Q, K (A for *Ace*, 0 for 10)
- J, Q, K can be taken as 11, 12, 13 respectively. *Ace* can be taken as either 1 or 14.
- Suit can be D, S, H, C (Diamond, Spade, Heart, Club)
- So there are 13 * 4 = 52 different ordinary cards
- Special cards: BJ, RJ (BJ for *Black Joker*, RJ for *Red Joker*)
- So all cards are [A-K][DSHC]\*2 + BJ\*2 + RJ\*2, in total 108 cards.

#####Hands you can play
Hand|Description|Example(s)|Counter Example(s)|Difficulty
----|-----------|-------|---------------|----------
Solo|Any single card|AS (Spade A)|None|1
Pair|Two cards of the same rank|0D 0C (Diamond 10 and Club 10)|~~BJ RJ~~ (Jokers of different colors doesn't count as the same rank)|1
Three Pairs|Three pairs with continuous rank|AH AS 2S 2H 3D 3C, QH QH KH KH AH AH|~~KH KH AH AH 2H 2H~~|1
Trio|Three cards of the same rank|AH AH AS, 9H 9S 9C|~~BJ BJ RJ~~|1
Full House|A composite of a *Trio* and a *Pair* |AH AH AS 2S 2H|None|1
Airplane|Two *Trios* with continuous rank|AH AH AD 2H 2H 2D, KH KH KD AH AH AD|None|1
Straight|Five cards with continuous rank|AH 2S 3H 4C 5H, 0C JD QH KH AS|~~JD QH KH AS 2S~~|1
Straight Flush|Five cards with continuous rank and the same suit|AH 2H 3H 4H 5H, 0H JH QH KH AH|~~QH KH AH 2H 3H~~|0
Bomb|Four or more cards of the same rank|5H 5H 5S 5S, 8H 8H 8S 8S 8C 8C 8D 8D|None|0

#####Clarification
- Jokers' rank is not continuous with ordinary cards
- RJs have the same rank, BJs have the same rank, but an RJ and a BJ do not have the same rank.
- Ranks being continuous means they form a sequence of natural numbers such that each number is 1 plus the number before it

#####Special rules
- There is a main rank for each game. It can only be one of A, 2, 3, ..., K.
- The two cards of the main rank with a *Heart* suit are *wildcards*.
- A *wildcard* can be used as any card except the *jokers*.

#####Goal
Your goal is to play your cards as fast as possible and win the game by first playing all of your cards. Therefore, Bob would like to know the least sum of difficulty value if he combine his cards into valid *hands* optimally.

####Input

The first line is an integer of the number of test cases.

For each test case, the first line contains a character denoting the main rank (rank is in {'A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'}).
The second line contains 54 characters, two characters is a card. Format is the same as descripted in **Notation** section.
Test cases are randomly "drawn" from random shuffled "decks".

####Output

For each test case, output the minimum difficulty if you arrange the cards optimally into hands.

####Sample Input
```
2
3
AD3D8H6HKCKS4DJC3H3C9H2C5H9SJD3CKH7CKCAH5H2C4C3SBJAC5S
6
KC0D4HKD6DJCKC2S8HADJD4D9C7SJH3SBJRJ2DQH5H8S9D5S0S2D5C
```

####Sample Output
```
6
9
```

####Hint
Here's one possible solution for sample 1 and sample 2.

Sample 1: 3H is a wildcard.
```
3H -> 3C
| AC AD AH 5H 5S || 3C 3D 3S JC JD || 9S || **KC KC KH KS** || BJ || 2C 2C 3C 3C 4C 4D || 5H 6H 7C 8H 9H |
```
KKKK is a bomb, it has difficulty 0. Others each have difficulty 1. Sum is 6.

Sample 2:
```
| 2D 2S || 4H || 5H 5S || JD JH KC KC KD || BJ || RJ || 8S 9D 0S JC QH || 6D 7S 8H 9C 0D || AD 2D 3S 4D 5C |
```
No bomb. Sum is 9.
