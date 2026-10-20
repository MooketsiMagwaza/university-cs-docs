-- Title: Look up a list element counting from the right
{-
QUESTION
Define fromEnd to take a list of integers and an index y counted from
the right, with 0 meaning the last element. Return (y,element).
Reject negative indices and indices at or beyond the length.
For example, fromEnd [3,5,2,10] 0 = (0,10).
-}

-- Read the question: Write fromEnd :: [Int] -> Int -> (Int, Int).
-- Plan: Validate the index; preserve it in the pair while a helper counts down.
-- Dry run: fromEnd [3,5,2,10] 0 = (0,select [3,5,2,10] 3) = (0,10).
-- Key step: y == length xs is invalid too; duplicate values do not affect lookup.
fromEnd :: [Int] -> Int -> (Int, Int)
fromEnd xs y
  | y < 0 = error "fromEnd: negative index"
  | y >= length xs = error "fromEnd: index out of range"
  | otherwise = (y, select xs (length xs - 1 - y))
  where
    select :: [a] -> Int -> a
    select [] _ = error "fromEnd: index out of range"
    select (z:_) 0 = z
    select (_:zs) n = select zs (n - 1)

main :: IO ()
main = do
  print (fromEnd [3,5,2,10] 0)  -- expected: (0,10)
  print (fromEnd [7] 0)  -- expected: (0,7)
  print (fromEnd [4,4,9] 1)  -- expected: (1,4)
  print (fromEnd [0,2] 1)  -- expected: (1,0)
  print (fromEnd [8,6,4] 2)  -- expected: (2,8)
