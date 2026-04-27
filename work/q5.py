
file = "q5_data.txt"

with open(file) as f:
    line = f.read().split()
    
    for word in line:
        re_word = word[::-1]
        print(re_word)
    
#_______________________________________________________
    for word in line:
        rev_word = " "
        for letter in word:
            rev_word = letter + rev_word
        print(rev_word)
        
