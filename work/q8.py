file = "q8_data.txt"

with open(file) as f:
    line = f.readlines()
    
    sorted_nums = []
    for nums in line:
        num = int(nums)
        sorted_nums.append(num)
        
    number_dec = sorted(sorted_nums, reverse= True)
    

with open("output_q8.txt","w") as f:
    f.write(str(number_dec))