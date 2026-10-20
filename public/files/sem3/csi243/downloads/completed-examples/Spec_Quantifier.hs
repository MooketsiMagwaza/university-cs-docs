-- Title: Translate every, some and none over an integer domain
{-
QUESTION
Write evenQuantifiers :: [Int] -> (Bool, Bool, Bool). Return whether
every value is even, some value is even, and no value is even.
Use all and any. For [] the universal is True, the existential False,
and "none" True. No non-emptiness precondition is imposed.
Postcondition: third result equals not second; universal and existential
are not complements. Work over the finite list, not all integers.
-}

-- Read the question: Write a definition; evenQuantifiers has input/result type [Int] -> (Bool, Bool, Bool).
-- Plan: Use all for every and any for some; preserve the stated quantifier order.
evenQuantifiers :: [Int] -> (Bool, Bool, Bool)
evenQuantifiers xs = (all even xs, any even xs, not (any even xs))

main :: IO ()
main = do
  print (evenQuantifiers [])  -- expected: (True,False,True)
  print (evenQuantifiers [0])  -- expected: (True,True,False)
  print (evenQuantifiers [1])  -- expected: (False,False,True)
  print (evenQuantifiers [1,2])  -- expected: (False,True,False)
  print (evenQuantifiers [2,4])  -- expected: (True,True,False)
