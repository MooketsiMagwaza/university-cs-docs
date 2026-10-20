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

parity :: Integer -> Bool
parity = undefined -- Your answer here

parityContract :: Integer -> Bool
parityContract = undefined -- Your answer here

main :: IO ()
main = do
  print (parity 0)  -- expected: True
  print (parity (-2))  -- expected: True
  print (parity (-1))  -- expected: False
  print (parity 1)  -- expected: False
  print (parity 2)  -- expected: True
  print (parityContract 0)  -- expected: True
  print (parityContract (-3))  -- expected: True
