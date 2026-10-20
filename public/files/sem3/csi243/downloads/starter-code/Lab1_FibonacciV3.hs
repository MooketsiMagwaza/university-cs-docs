-- Title: Define the Pell sequence recursively
{-
QUESTION
Write pell :: Integer -> Integer for nonnegative indices.
Use pell 0 = 0, pell 1 = 1 and pell n = 2*pell (n-1) + pell (n-2).
Reject negative indices with an informative error.
-}

pell :: Integer -> Integer
pell = undefined -- Your answer here

main :: IO ()
main = do
  print (pell 0)  -- expected: 0
  print (pell 1)  -- expected: 1
  print (pell 2)  -- expected: 2
  print (pell 5)  -- expected: 29
  print (pell 6)  -- expected: 70
