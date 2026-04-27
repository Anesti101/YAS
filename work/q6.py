
file = "q6_data.txt"

with open(file) as f:
    line = f.readlines()
    
    people = {}
    
    for person in line:
        name, age = person.strip().split(",")
        people[name] = int(age)
        
    old = 0
    oldest = ""
    for name, age in people.items():
        if age > old:
            old = age
            oldest = name
            
    print(oldest, old)
        
             
        
                    
    
        
            
        
