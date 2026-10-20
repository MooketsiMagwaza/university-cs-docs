-- Title: Sum decimal digits recursively
{-
QUESTION
Write digitSum :: Integer -> Integer for n >= 0 using div and mod. [4]
Return the sum of its decimal digits; digitSum 0 = 0.
-}

digitSum :: Integer -> Integer
digitSum = undefined  -- Your answer here

main :: IO ()
main = do
  print (digitSum 0)  -- expected: 0
  print (digitSum 7)  -- expected: 7
  print (digitSum 105)  -- expected: 6
  print (digitSum 1234)  -- expected: 10
  print (digitSum 909)  -- expected: 18
