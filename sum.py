"""Module for reading and processing numeric data from a CSV file."""


file = "nums.txt"

with open(file) as f:
    line = f.readline()
    print(line)
 