all: test

# not sure why this isn't working
# %.exe: %.cc
#     g++ $< -std=c++11 -O2 -o $@

sol.exe: sol.cc
    g++ sol.cc -std=c++11 -O2 -o sol

gen.exe: gen.cc
    g++ gen.cc -std=c++11 -O2 -o gen

wrapper.exe: wrapper.cc ../strategy.cpp
    g++ wrapper.cc -std=c++11 -O2 -o wrapper

test: sol.exe input.txt wrapper.exe
    ./sol < input.txt > output.txt
    ./wrapper < input.txt > output2.txt
    diff output.txt output2.txt

fixture fixture.txt: input.txt sol.exe
    ./sol < input.txt > fixture.txt

input.txt: gen.exe
    ./gen > input.txt

clean:
    rm -f *.exe output.txt output2.txt
