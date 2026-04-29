
import sys

filename = sys.argv[1]

with open(filename) as f:
    lines = f.readlines().strip()

    for i in lines:
        return sum(i)
