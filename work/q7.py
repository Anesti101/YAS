
file = "q7_data.txt"

with open(file) as f:
    line = f.readlines()
    above_ten = []
    for nums in line: 
        m = int(nums)
        if m >= 10:
            above_ten.append(m)
    print(above_ten)
    