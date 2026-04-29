#Write a function is_even(n) that returns True if a number is even and
#False otherwise.

def is_even(n):
    if n % 2 == 0:
        return True
    else:
        return False


"""FizzBuzz: Write a function that prints numbers from 1 to 50:
Multiples of 3 → "Fizz"
Multiples of 5 → "Buzz"
Both → "FizzBuzz" """

def fizz_buzz():
    for i in range(1, 51):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)


#Write a function max_of_three(a, b, c) that returns the largest value. - No built-in max() allowed.

def max_of_three(a, b, c):
    if a >= b and a >= c:
        return a
    elif b >= a and b >= c:
        return b
    else:
        return c

print(max_of_three(2,4,5))
#Write a function that takes a string and returns the number of vowels.

def count_vowels(s):
    vowels = "aeiouAEIOU"
    count = 0
    for letter in s:
        if letter in vowels:
            count += 1
    return count

print(count_vowels("james"))
#Write a function is_palindrome(s) that returns True if a string reads the same backward.

def is_palindrome(s):
    pali = s[::-1]
    if pali == s:
        return True
    else:
        return False

print(is_palindrome("deed"))
    

#Write a function calculate(a, b, operator) that:
#Supports +, -, *, /
#Returns the result

def calculate(a, b, operator):
    if operator == "+":
        return a + b
    elif operator == "-":
        return a - b
    elif operator == "*":
        return a * b
    elif operator == "/":
        if b != 0:
            return a / b
        else:
            return "Cannot divide by zero."
    else:
        return "Invalid operator."

print(calculate(3,4,"+"))

#Write a function that takes a secret number and a guess:
#Returns "Too high", "Too low", or "Correct"

def guess_number(secret, guess):
    if guess < secret:
        print("Too low") 
    elif guess > secret:
        print("Too high")
    else:
        print("Correct")
    
guess_number(3,8)



""""" Other practice sources:
https://adventofcode.com/
https://projecteuler.net/archives
https://www.codingame.com/start/ S  """     