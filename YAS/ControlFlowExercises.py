print("\nQ1a\n")
# Q1a: Print only the first 5 numbers in this list
x = [2, 5, 4, 87, 34, 2, 1, 31, 103, 99]

# A1a:
print(f'This first five numbers are {x[:5]}')



print("\nQ1b\n")
# Q1b: Now print only the even numbers in this list (the elements that are themselves even)
x = [2, 5, 4, 87, 34, 2, 1, 31, 103, 99]

# A1b:
print(f'The even numbers in the list are {[i for i in x if i % 2 == 0]}')



print("\nQ1c\n")
# Q1c: Now only print the even numbers up to the fifth element in the list (e.g. 2, 4, 34)
x = [2, 5, 4, 87, 34, 2, 1, 31, 103, 99]

# A1c:
print(f'The even numbers up to the fifth element are {[i for i in x[:5] if i % 2 == 0]}')

# -------------------------------------------------------------------------------------- #

print("\nQ2a\n")
# Q2a: from the list of names, create another list that consists of only the first letters of each first name
# e.g. ["Alan Turing", "Leonardo Fibonacci"] -> ["A", "L"]
names = ["Alan Turing", "Leonardo Fibonacci", "Katherine Johnson", "Annie Easley", "Terence Tao"]

# A2a:
list_2 = []
for i in names:
    list_2.append(i[0])
print(list_2)



print("\nQ2b\n")
# Q2b: from the list of names, create another list that consists of only the index of the space in the string
# HINT: use your_string.index("substring")
names = ["Alan Turing", "Leonardo Fibonacci", "Katherine Johnson", "Annie Easley", "Terence Tao"]

# A2b:
for k,v in enumerate(names):
    for i,j in enumerate(v):
        if j == " ":
            print(f'The index of the space in {v} is {i}')




print("\nQ2c\n")
# Q2c: from the list of names, create another list that consists of the first and last initial of each individual
names = ["Alan Turing", "Leonardo Fibonacci", "Katherine Johnson", "Annie Easley", "Terence Tao"]

# A2c:
for k,v in enumerate(names):
    for i,j in enumerate(v):
        if j == " ":
            print(f'The first and last initial of {v} is {v[0]}{v[i+1]}') 


# -------------------------------------------------------------------------------------- #

print("\nQ3a\n")
# Q3a: Here is a list of lists, print only the lists which have no duplicates
# Hint: This can be easily done by using sets as a set does not contain duplicates
list_of_lists = [[1,5,7,3,44,4,1],
                 ["A", "B", "C"],
                 ["Hi", "Hello", "Ciao", "By", "Goodbye", "Ciao"],
                 ["one", "Two", "Three", "Four"]]


# A3a:
for i in list_of_lists:
    if len(i) == len(set(i)):
        print(f'the list {i} has no duplcates')


# -------------------------------------------------------------------------------------- #

print("\nQ4a-4b\n")
# Q4a: Using a while loop, ask the user to input a number greater than 100, if they enter anything else,
# get them to enter again (and repeat until the conditions are satisfied). Finally print the number that
# they entered

# A4a:

def prime_num(num):
    if num < 2:
        return "not prime"
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return "not prime"
    return "prime"

while True:
    num = input("Enter a number greater than 100: ")
    if num.isdigit() and int(num) > 100:
        result = prime_num(int(num))
        print(f'Bravo, you entered a number greater than 100.')
        print(f'The number {num} is {result}.')
        break
    else:
        print("Enter a valid number")



#print("\nQ4b\n")
# Q4b: Continue this code and print "prime" if the number is a prime number and "not prime" otherwise

# A4b:








