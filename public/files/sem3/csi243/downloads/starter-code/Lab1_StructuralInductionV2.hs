-- Title: Prove that the generated set is the positive multiples of 4
{-
QUESTION
A set S has base 4 in S and rule: if x and y are in S, then x+y is in S.
No other elements belong to S. Prove using structural induction that S
is exactly the set of positive integers divisible by 4.
Implement generated :: Integer -> Bool as a recursive membership test,
and agrees :: Integer -> Bool to compare it with the arithmetic condition.
-}

generated :: Integer -> Bool
generated = undefined -- Your answer here

agrees :: Integer -> Bool
agrees = undefined -- Your answer here

main :: IO ()
main = do
  print (agrees (-1))  -- expected: True
  print (agrees 0)  -- expected: True
  print (agrees 1)  -- expected: True
  print (agrees 4)  -- expected: True
  print (agrees 8)  -- expected: True
  print (agrees 13)  -- expected: True
  print (generated 4)  -- expected: True
  print (generated 0)  -- expected: False
