-- Title: Convert a non-negative integer to binary digits
{-
QUESTION
Write binary :: Integer -> [Integer] recursively for n >= 0. [5]
Return most significant digit first; represent zero by [0].
-}

-- Read the question: Write binary :: Integer -> [Integer].
-- Plan: Recurse on the quotient before appending the remainder.
binary :: Integer -> [Integer]
binary n
  | n < 2 = [n]  -- A single binary digit.
  | otherwise = binary (div n 2) ++ [mod n 2]

main :: IO ()
main = do
  print (binary 0)  -- expected: [0]
  print (binary 1)  -- expected: [1]
  print (binary 2)  -- expected: [1,0]
  print (binary 5)  -- expected: [1,0,1]
  print (binary 10)  -- expected: [1,0,1,0]
