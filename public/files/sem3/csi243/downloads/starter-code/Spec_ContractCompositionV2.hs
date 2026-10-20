-- Title: Check a nonzero precondition after squaring
{-
QUESTION
Write squareThenDivide :: Integer -> Maybe Integer. Stage one accepts
only n>=0 and returns n*n. Stage two requires a strictly positive
denominator d and returns 12 div d. Return Nothing when either
precondition fails. Stage one's postcondition d>=0 does not imply d>0:
zero is a counterexample. Check before division; never fabricate a
quotient for an unsatisfied precondition. This total wrapper terminates
without recursion. Integer avoids bounded multiplication overflow.
-}

squareThenDivide :: Integer -> Maybe Integer
squareThenDivide = undefined -- Your answer here

main :: IO ()
main = do
  print (squareThenDivide (-1))  -- expected: Nothing
  print (squareThenDivide 0)  -- expected: Nothing
  print (squareThenDivide 1)  -- expected: Just 12
  print (squareThenDivide 2)  -- expected: Just 3
  print (squareThenDivide 3)  -- expected: Just 1
  print (squareThenDivide 4)  -- expected: Just 0
