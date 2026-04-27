

file = "q2_data.txt"

with open(file) as f:
    lines = f.readlines()
    for nums in lines:
        num = nums.split(",")
    
 
def get_total(num):
    total =0
    for n in num:
        total += int(n)    
    return total

def get_average(num): 
    length = len(num)
    total = get_total(num)
    average = total/length
    return average

def get_highest(num):
    hihgest = 0
    for n in num:
        m = int(n)
        if m >= hihgest:
            hihgest = m
    return hihgest
    

print(get_total(num))
print(get_average(num))
print(get_highest(num))
    
    

