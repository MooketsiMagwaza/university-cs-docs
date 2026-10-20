-- Title: Clamp an integer using guards
{-
QUESTION
Write clamp :: Integer -> Integer with guards. [3]
Return 0 below 0, 10 above 10, and the original value otherwise.
-}

clamp :: Integer -> Integer
clamp = undefined  -- Your answer here

main :: IO ()
main = do
  print (clamp (-8))  -- expected: 0
  print (clamp 0)  -- expected: 0
  print (clamp 5)  -- expected: 5
  print (clamp 10)  -- expected: 10
  print (clamp 12)  -- expected: 10
