class Person:

    def __init__(self, name, age):
        self.name = name # encapsulation 
        self.age = age 

    def display(self):
        print(f"Name: {self.name}, Age: {self.age}")

    
class Super_hero(Person): # Inheritance from Person class

    def __init__(self, name, age, skill):
        super().__init__(name, age) 
        self.skill = skill

    def display(self):
        # Polymorphism, overriding the display method 
        super().display() 
        print(f"Skill: {self.skill}")


Super_hero_1 = Super_hero("John", 30, "Fike Ball")
Super_hero_1 = Super_hero("Jane", 25, "Ice Breath")
Super_hero_1.display()
Super_hero_1.display() 