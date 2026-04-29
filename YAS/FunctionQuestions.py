print("\nQ1a\n")
# Q1a: Write a function which takes in an integer as an argument and returns the divisors of that number as a list
# e.g. f(12) = [1, 2, 3, 4, 6, 12]
# hint: range(1, n) returns a collection of the numbers from 1 to n-1

# A1a:

def divisors(n):
    list_1 =[]
    for i in range(1 , n+1): # 
        if n % i == 0:
            list_1.append(i)
    return list_1

print(divisors(12))


print("\nQ1b\n")
# Q1b: Write a function which takes in two integers as arguments and returns true if one of the numbers
# is a factor of the other, false otherwise
# (bonus points if you call your previous function within this function

# A1b:
def factor(a,b):
    
    if a in divisors(b) or b in divisors(a):
        return False
    else:
        return True
    
print(factor(2,100))


# -------------------------------------------------------------------------------------- #

print("\nQ2a\n")
# Q2a: write a function which takes a letter (as a string) as an input and outputs it's position in the alphabet
alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

# A2a:
def letter_in_alp(letters):
    letter = letters.lower()
    for k,v in enumerate(alphabet, start=1):
        if v == letter:
            print(k)
            return k


letter_in_alp("H")


print("\nQ2b\n")
# Q2b: create a function which takes a persons name as an input string and returns an
# ID number consisting of the positions of each letter in the name
# e.g. f("bob") = "1141" as "b" is in position 1 and "o" is in position 14

# A2b:
def persons_name(name):
    num = []
    for i in name:
        num.append(letter_in_alp(i))
    print(num)

print(persons_name("Jame"))

print("\nQ2c\n")
# Q2c: Create a function which turns this ID into a password. The function should subtract
# the sum of the numbers in the id that was generated from the whole number of the id.
# e.g. f("bob") -> 1134 (because bob's id was 1141 and 1+1+4+1 = 7 so 1141 - 7 = 1134)

# A2c:
def password_id(id_number):
    sum_id = sum(id_number)
    whole_num = int("".join(str(i) for i in id_number))
    password = whole_num - sum_id
    print(password)

password_id([1,1,3,4])

# -------------------------------------------------------------------------------------- #

print("\nQ3a-3b\n")
# Q3a: Write a function which takes an integer as an input, and returns true if the number is prime, false otherwise.

# A3a:
def prime_no_error(n):
    try:
        n = int(n)
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True
    except ValueError:
        return "Input is not a valid integer."

print(prime_no_error(17))

#print("\nQ3b\n")
# Q3b: Now add some functionality to the function which does not error if the user inputs something other than a digit

# A3b:



# -------------------------------------------------------------------------------------- #






