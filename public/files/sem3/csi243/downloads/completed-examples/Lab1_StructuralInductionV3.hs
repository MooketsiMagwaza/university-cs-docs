-- Title: Prove that the generated set is the positive multiples of 5
{-
QUESTION
A set S has base 5 in S and rule: if x and y are in S, then x+y is in S.
No other elements belong to S. Prove using structural induction that S
is exactly the set of positive integers divisible by 5.
Implement generated :: Integer -> Bool as a recursive membership test,
and agrees :: Integer -> Bool to compare it with the arithmetic condition.
-}

-- Read the question: Write generated :: Integer -> Bool.
-- Read the question: Write agrees :: Integer -> Bool.
-- Plan: Prove containment by construction, then prove every positive multiple is generated.
{-
Proof (soundness, by structural induction on the construction):
Base: 5 = 5*1 is positive and divisible by 5.
Hypotheses: x = 5*p and y = 5*q, where p,q are positive integers.
Step: x+y = 5*(p+q), again positive and divisible by 5.
Exclusion: every construction uses only this base and this step.
Completeness (induction on positive n): 5*1 is the base member.
Assume 5*n is in S. Adding the base member gives 5*(n+1) in S.
Thus S is exactly the positive multiples of 5, in both directions.
The executable checks illustrate the claim; the induction proves it.
-}
generated :: Integer -> Bool
generated n
  | n < 5 = False -- Base: no smaller integer is generated.
  | n == 5 = True
  | otherwise = generated (n - 5)

agrees :: Integer -> Bool
agrees n = generated n == (n > 0 && n `mod` 5 == 0)

main :: IO ()
main = do
  print (agrees (-1))  -- expected: True
  print (agrees 0)  -- expected: True
  print (agrees 1)  -- expected: True
  print (agrees 5)  -- expected: True
  print (agrees 10)  -- expected: True
  print (agrees 16)  -- expected: True
  print (generated 5)  -- expected: True
  print (generated 0)  -- expected: False
