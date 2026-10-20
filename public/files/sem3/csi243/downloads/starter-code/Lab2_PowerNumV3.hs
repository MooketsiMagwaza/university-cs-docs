-- Title: Raise one more than an integer to a power
{-
QUESTION
Specify and implement powerPlusOne :: Int -> Int -> Int recursively using guards.
Return (n+1) raised to the power y. For example, powerPlusOne 2 3 = 27.
The zeroth power is 1, including when the base is zero. Reject negative y.
-}

powerPlusOne :: Int -> Int -> Int
powerPlusOne = undefined -- Your answer here

main :: IO ()
main = do
  print (powerPlusOne 2 3)  -- expected: 27
  print (powerPlusOne 10 0)  -- expected: 1
  print (powerPlusOne 10 1)  -- expected: 11
  print (powerPlusOne 0 3)  -- expected: 1
  print (powerPlusOne (-2) 3)  -- expected: -1
