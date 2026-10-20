-- Title: Implement literal special-square and safe-index policies
{-
QUESTION
Write specialSquare :: Integer -> Integer with the literal contract
specialSquare 0 = 1 and specialSquare n = n*n for all other integers.
This intentionally differs from the mathematical square at zero.
Also write atIndex :: [Integer] -> Int -> Maybe Integer: valid indices
are 0<=i<length xs, and invalid indices give Nothing. In particular,
i==length xs is invalid. State these assumptions before implementation;
do not silently repair a question into a different specification.
-}

-- Read the question: Write a definition; specialSquare has input/result type Integer -> Integer.
-- Plan: Apply the stated policy first, then implement every disjoint input partition.
specialSquare :: Integer -> Integer
specialSquare 0 = 1 -- The exceptional equation is part of the contract.
specialSquare n = n*n

atIndex :: [Integer] -> Int -> Maybe Integer
atIndex [] _ = Nothing
atIndex (x:xs) i
  | i < 0 = Nothing
  | i == 0 = Just x
  | otherwise = atIndex xs (i-1)

main :: IO ()
main = do
  print (specialSquare 0)  -- expected: 1
  print (specialSquare (-2))  -- expected: 4
  print (specialSquare 1)  -- expected: 1
  print (atIndex [] 0)  -- expected: Nothing
  print (atIndex [8] 0)  -- expected: Just 8
  print (atIndex [8] 1)  -- expected: Nothing
  print (atIndex [8] (-1))  -- expected: Nothing
