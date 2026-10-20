-- Title: Sum every second value in a signed range
{-
QUESTION
Write range :: Integer -> Integer -> Integer using recursion.
Sum lo, lo+2, lo+4, ... while the term is at most hi.
Return zero when the range is empty; do not build a list.
-}

range :: Integer -> Integer -> Integer
range = undefined -- Your answer here

main :: IO ()
main = do
  print (range 0 0)  -- expected: 0
  print (range 1 4)  -- expected: 4
  print (range (-2) 2)  -- expected: 0
  print (range 4 1)  -- expected: 0
  print (range 3 3)  -- expected: 3
