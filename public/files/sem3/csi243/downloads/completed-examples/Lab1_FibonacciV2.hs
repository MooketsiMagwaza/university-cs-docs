-- Title: Define the Lucas sequence recursively
{-
QUESTION
Write lucas :: Integer -> Integer for nonnegative indices.
Use lucas 0 = 2, lucas 1 = 1 and add the preceding two terms.
Reject negative indices with an informative error.
-}

-- Read the question: Write lucas :: Integer -> Integer.
-- Plan: Supply two base cases because each recursive step uses two earlier terms.
-- Dry run: lucas 5 = lucas 4 + lucas 3 = 7 + 4 = 11.
lucas :: Integer -> Integer
lucas n
  | n < 0 = error "lucas: negative index"
  | n == 0 = 2 -- First base case.
  | n == 1 = 1 -- Second base case.
  | otherwise = lucas (n - 1) + lucas (n - 2)

main :: IO ()
main = do
  print (lucas 0)  -- expected: 2
  print (lucas 1)  -- expected: 1
  print (lucas 2)  -- expected: 3
  print (lucas 5)  -- expected: 11
  print (lucas 6)  -- expected: 18
