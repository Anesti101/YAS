
file = "q3_data.txt"

with open(file) as f:
    line = f.readline().split()
    
    count = {}
    for word in line:
        count[word] = count.get(word,0) +1
    print(count)