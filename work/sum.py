customer = {}

with open("nums.txt") as f:
    for line in f:
        name, spend = line.strip().split(",")
        spend = int(spend)
        if name not in customer:
            customer[name] = []
        customer[name].append(spend)
        
        
def total_spend(customer):
    for name, spend in customer.items():
        print("Customer",name," Spent", sum(spend), "in Total")
    

def top_customer(customer):
    highest = 0
    top_name = ""
    
    for name, spend in customer.items():
        total = sum(spend)
        if total >= highest:
            highest = total
            top_name = name


    print(top_name, highest)


def get_average(customer):
    total = 0
    order = 0
    
    for num in customer.values():
        total += sum(num)
        order += len(num)
    
    
    print(total/order)

total_spend(customer)
top_customer(customer)
get_average(customer)