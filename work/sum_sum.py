

file = "sum.txt"

with open(file) as f:
    line = f.readlines()
    total = 0
    for num in line:
        total += int(num.strip())
    print(total)
        
        
