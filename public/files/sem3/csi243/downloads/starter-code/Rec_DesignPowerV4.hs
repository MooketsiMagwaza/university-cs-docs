-- Title: Compare linear and halving power algorithms
{-
QUESTION
Write power with the signature below. Return Nothing for a negative
exponent; define x^0 as 1, including 0^0 for this algorithm.
Return whether linear recursion and halving recursion agree.
-}

power :: Integer -> Int -> Maybe Bool
power = undefined -- Your answer here

main :: IO ()
main = do
  print (power 0 0)  -- expected: Just True
  print (power 2 5)  -- expected: Just True
  print (power (-2) 3)  -- expected: Just True
  print (power 3 1)  -- expected: Just True
  print (power 2 (-1))  -- expected: Nothing
