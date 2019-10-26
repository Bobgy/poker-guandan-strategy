.PHONY: all test test_sample clean update_fixture update_fixture_sample

all: test_sample test

test_sample: sample.in sample.out wrapper.exe
    ./wrapper < sample.in > my_sample.out
    diff sample.out my_sample.out

update_fixture_sample: my_sample.out
    cp my_sample.out sample.out

test: std_output.txt curr_output.txt
    diff std_output.txt curr_output.txt

update_fixture: curr_output.txt
    cp curr_output.txt std_output.txt

clean:
    rm -f *.exe curr_output.txt

# == compile commands ==

# not sure why this isn't working
# %.exe: %.cc
#     g++ $< -std=c++11 -O2 -o $@
gen.exe: gen.cc
    g++ gen.cc -std=c++11 -O2 -o gen

wrapper.exe: wrapper.cc ../strategy.cpp
    g++ wrapper.cc -std=c++11 -O2 -o wrapper

# == generate output ==
curr_output.txt: wrapper.exe input.txt
    ./wrapper < input.txt > curr_output.txt

my_sample.out: wrapper.exe sample.in
    ./wrapper < sample.in > my_sample.out

input.txt: gen.exe
    ./gen > input.txt
