-- Title: Compute the Fibonacci recurrence
{-
QUESTION
Write term :: Integer -> Integer recursively for n >= 0. [4]
Use term 0 = 0, term 1 = 1, and term n = term (n-1) + term (n-2).
-}

term :: Integer -> Integer
term = undefined  -- Your answer here

main :: IO ()
main = do
  print (term 0)  -- expected: 0
  print (term 1)  -- expected: 1
  print (term 2)  -- expected: 1
  print (term 5)  -- expected: 5
  print (term 8)  -- expected: 21
