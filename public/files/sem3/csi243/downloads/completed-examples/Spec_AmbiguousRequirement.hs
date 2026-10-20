-- Title: Resolve zero divisor and ordering before implementing divisibility
{-
QUESTION
Write divides :: Integer -> Integer -> Either String Bool with
arguments dividend m and divisor n. State this policy: zero divisor has
first precedence and returns Left "zero divisor"; then negative inputs
return Left "negative". On the valid subset m>=0,n>0 return whether
m mod n == 0. Equality is True; m<n with m>0 is False, but m=0 is
divisible by every positive n. Thus ordering alone must not reject zero.
This resolves an ambiguous isDiv requirement without evaluating mod 0.
Return errors, not fabricated Boolean answers for invalid inputs.
-}

-- Read the question: Write a definition; divides has input/result type Integer -> Integer -> Either String Bool.
-- Plan: Apply the stated policy first, then implement every disjoint input partition.
divides :: Integer -> Integer -> Either String Bool
divides m n
  | n == 0 = Left "zero divisor"
  | m < 0 || n < 0 = Left "negative"
  | otherwise = Right (m `mod` n == 0)

main :: IO ()
main = do
  print (divides 0 0)  -- expected: Left "zero divisor"
  print (divides (-1) 0)  -- expected: Left "zero divisor"
  print (divides 0 3)  -- expected: Right True
  print (divides 2 3)  -- expected: Right False
  print (divides 3 3)  -- expected: Right True
  print (divides 6 3)  -- expected: Right True
  print (divides (-3) 3)  -- expected: Left "negative"
