-- Title: Raise an integer to a nonnegative integer power
{-
QUESTION
Specify and implement powerNum :: Int -> Int -> Int recursively using guards.
Raise n to the power y. powerNum 2 7 = 128, powerNum 10 0 = 1,
and powerNum 10 1 = 10.
The zeroth power is 1, including when the base is zero. Reject negative y.
-}

powerNum :: Int -> Int -> Int
powerNum = undefined -- Your answer here

main :: IO ()
main = do
  print (powerNum 2 7)  -- expected: 128
  print (powerNum 10 0)  -- expected: 1
  print (powerNum 10 1)  -- expected: 10
  print (powerNum 0 3)  -- expected: 0
  print (powerNum (-2) 3)  -- expected: -8
