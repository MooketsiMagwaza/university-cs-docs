-- Title: Specify parity on the entire Integer domain
{-
QUESTION
Write parity :: Integer -> Bool and parityContract :: Integer -> Bool.
Purpose: recognise even integers. Domain: all Integer values; codomain:
Bool. Precondition: True. Postcondition: result == (n mod 2 == 0).
parityContract checks this postcondition against parity.
The requirement "reject invalid parity for an Integer" is contradictory
unless an extra restriction is stated: every Integer is even or odd,
including zero and negative values. Do not invent an invalid subset.
Integer arithmetic avoids bounded-Int overflow in neighbouring values.
-}

-- Read the question: Write a definition; parity has input/result type Integer -> Bool.
-- Plan: Identify the valid subset, check its boundaries, then implement its postcondition.
parity :: Integer -> Bool
parity n = n `mod` 2 == 0 -- Zero and negative integers have parity too.

parityContract :: Integer -> Bool
parityContract n = parity n == even n

main :: IO ()
main = do
  print (parity 0)  -- expected: True
  print (parity (-2))  -- expected: True
  print (parity (-1))  -- expected: False
  print (parity 1)  -- expected: False
  print (parity 2)  -- expected: True
  print (parityContract 0)  -- expected: True
  print (parityContract (-3))  -- expected: True
