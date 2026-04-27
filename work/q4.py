
file = "q4_data.txt"

with open(file)as f:
    line = f.read().split()
    
    seen = set()
    
    for num in line:
        if num not in seen:
            seen.add(num)
        else:
            print(num)
            
        
        
    
