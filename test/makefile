all: test

# not sure why this isn't working
# %.exe: %.cc
#     g++ $< -std=c++11 -O2 -o $@

sol.exe: sol.cc
    g++ sol.cc -std=c++11 -O2 -o sol

gen.exe: gen.cc
    g++ gen.cc -std=c++11 -O2 -o gen

wrapper.exe: wrapper.cc ../strategy.cpp
    g++ wrapper.cc -std=c++11 -o wrapper

test: std_output.txt curr_output.txt
    diff std_output.txt curr_output.txt

std_output.txt: sol.exe input.txt
    ./sol < input.txt > std_output.txt

curr_output.txt: wrapper.exe input.txt
    ./wrapper < input.txt > curr_output.txt

fixture fixture.txt: input.txt sol.exe
    ./sol < input.txt > fixture.txt

input.txt: gen.exe
    ./gen > input.txt

clean:
    rm -f *.exe curr_output.txt
