.PHONY: all test test_sample clean update_fixture update_fixture_sample

all: test_sample test

test_sample: sample.out my_sample.out
	diff sample.out my_sample.out -u

test: std_output.txt curr_output.txt
	diff std_output.txt curr_output.txt -u

update_fixture: curr_output.txt my_sample.out
	cp curr_output.txt std_output.txt
	cp my_sample.out sample.out

clean:
	rm -f *.exe curr_output.txt

# == compile commands ==

# not sure why this isn't working
# %.exe: %.cc
#     g++ $< -std=c++11 -O2 -o $@
gen.exe: gen.cc
	g++ gen.cc -std=c++11 -O2 -o gen.exe

wrapper.exe: wrapper.cc ../strategy.cpp
	g++ wrapper.cc -std=c++11 -O2 -o wrapper.exe

# == generate output ==
curr_output.txt: wrapper.exe input.txt
	./wrapper.exe < input.txt > curr_output.txt

my_sample.out: wrapper.exe sample.in
	./wrapper.exe < sample.in > my_sample.out

input.txt: gen.exe
	./gen.exe > input.txt
