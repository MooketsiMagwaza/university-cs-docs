-- Title: Sum factorials using recursion
{-
QUESTION
Write factorial and sumFactorials :: Integer -> Integer for n >= 0. [6]
sumFactorials n returns factorial 0 + ... + factorial n.
-}

factorial :: Integer -> Integer
factorial = undefined  -- Your answer here

sumFactorials :: Integer -> Integer
sumFactorials = undefined  -- Your answer here

main :: IO ()
main = do
  print (sumFactorials 0)  -- expected: 1
  print (sumFactorials 1)  -- expected: 2
  print (sumFactorials 2)  -- expected: 4
  print (sumFactorials 3)  -- expected: 10
  print (sumFactorials 4)  -- expected: 34
