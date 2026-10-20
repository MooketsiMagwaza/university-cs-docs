-- Title: Prove that the generated set is the positive multiples of 3
{-
QUESTION
A set S has base 3 in S and rule: if x and y are in S, then x+y is in S.
No other elements belong to S. Prove using structural induction that S
is exactly the set of positive integers divisible by 3.
Implement generated :: Integer -> Bool as a recursive membership test,
and agrees :: Integer -> Bool to compare it with the arithmetic condition.
-}

-- Read the question: Write generated :: Integer -> Bool.
-- Read the question: Write agrees :: Integer -> Bool.
-- Plan: Prove containment by construction, then prove every positive multiple is generated.
{-
Proof (soundness, by structural induction on the construction):
Base: 3 = 3*1 is positive and divisible by 3.
Hypotheses: x = 3*p and y = 3*q, where p,q are positive integers.
Step: x+y = 3*(p+q), again positive and divisible by 3.
Exclusion: every construction uses only this base and this step.
Completeness (induction on positive n): 3*1 is the base member.
Assume 3*n is in S. Adding the base member gives 3*(n+1) in S.
Thus S is exactly the positive multiples of 3, in both directions.
The executable checks illustrate the claim; the induction proves it.
-}
generated :: Integer -> Bool
generated n
  | n < 3 = False -- Base: no smaller integer is generated.
  | n == 3 = True
  | otherwise = generated (n - 3)

agrees :: Integer -> Bool
agrees n = generated n == (n > 0 && n `mod` 3 == 0)

main :: IO ()
main = do
  print (agrees (-1))  -- expected: True
  print (agrees 0)  -- expected: True
  print (agrees 1)  -- expected: True
  print (agrees 3)  -- expected: True
  print (agrees 6)  -- expected: True
  print (agrees 10)  -- expected: True
  print (generated 3)  -- expected: True
  print (generated 0)  -- expected: False
