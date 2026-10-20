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

divides :: Integer -> Integer -> Either String Bool
divides = undefined -- Your answer here

main :: IO ()
main = do
  print (divides 0 0)  -- expected: Left "zero divisor"
  print (divides (-1) 0)  -- expected: Left "zero divisor"
  print (divides 0 3)  -- expected: Right True
  print (divides 2 3)  -- expected: Right False
  print (divides 3 3)  -- expected: Right True
  print (divides 6 3)  -- expected: Right True
  print (divides (-3) 3)  -- expected: Left "negative"
