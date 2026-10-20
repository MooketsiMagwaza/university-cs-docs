-- Title: Clamp an integer using guards
{-
QUESTION
Write clamp :: Integer -> Integer with guards. [3]
Return 0 below 0, 10 above 10, and the original value otherwise.
-}

-- Read the question: Write clamp :: Integer -> Integer.
-- Plan: Handle the two out-of-range cases before preserving the input.
clamp :: Integer -> Integer
clamp n
  | n < 0 = 0
  | n > 10 = 10
  | otherwise = n  -- Preserve values within the interval.

main :: IO ()
main = do
  print (clamp (-8))  -- expected: 0
  print (clamp 0)  -- expected: 0
  print (clamp 5)  -- expected: 5
  print (clamp 10)  -- expected: 10
  print (clamp 12)  -- expected: 10
