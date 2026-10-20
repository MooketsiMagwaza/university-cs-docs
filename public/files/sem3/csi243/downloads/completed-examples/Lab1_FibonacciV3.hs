-- Title: Define the Pell sequence recursively
{-
QUESTION
Write pell :: Integer -> Integer for nonnegative indices.
Use pell 0 = 0, pell 1 = 1 and pell n = 2*pell (n-1) + pell (n-2).
Reject negative indices with an informative error.
-}

-- Read the question: Write pell :: Integer -> Integer.
-- Plan: Supply two base cases because each recursive step uses two earlier terms.
-- Dry run: pell 5 = 2 * pell 4 + pell 3 = 2 * 12 + 5 = 29.
pell :: Integer -> Integer
pell n
  | n < 0 = error "pell: negative index"
  | n == 0 = 0 -- First base case.
  | n == 1 = 1 -- Second base case.
  | otherwise = 2 * pell (n - 1) + pell (n - 2)

main :: IO ()
main = do
  print (pell 0)  -- expected: 0
  print (pell 1)  -- expected: 1
  print (pell 2)  -- expected: 2
  print (pell 5)  -- expected: 29
  print (pell 6)  -- expected: 70
