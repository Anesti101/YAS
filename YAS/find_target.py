


def findt(nums,target):
      seen = set()
      for n in nums:
          wanted = target - n 
          if n not in seen:
               seen.add(n)
          if wanted in seen:
             return n, wanted 
    
