
import sys

filename = sys.argv[1]

with open(filename) as f:
    line = f.read().strip()

a, b = line.split(",")


def add(a,b):
    print(a+b) 

add(int(a),int(b))
