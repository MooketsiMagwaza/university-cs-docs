-- Title: Return an index and its list element
{-
QUESTION
Define atPosition to take a list and an index y, and return (y,element).
Lists are indexed from 0. atPosition [3,5,2,10] 3 returns (3,10).
Display an informative error for negative indices and indices at or beyond
the list length. Give the signature, recursive definition and a dry run.
-}

-- Read the question: Write atPosition :: [Int] -> Int -> (Int, Int).
-- Plan: Validate the index; preserve it in the pair while a helper counts down.
-- Dry run: atPosition [3,5,2,10] 3 = (3,select [5,2,10] 2) = (3,10).
-- Key step: y == length xs is invalid too; duplicate values do not affect lookup.
atPosition :: [Int] -> Int -> (Int, Int)
atPosition xs y
  | y < 0 = error "atPosition: negative index"
  | y >= length xs = error "atPosition: index out of range"
  | otherwise = (y, select xs y)
  where
    select :: [a] -> Int -> a
    select [] _ = error "atPosition: index out of range"
    select (z:_) 0 = z -- Base: requested element reached.
    select (_:zs) n = select zs (n - 1)

main :: IO ()
main = do
  print (atPosition [3,5,2,10] 3)  -- expected: (3,10)
  print (atPosition [7] 0)  -- expected: (0,7)
  print (atPosition [4,4,9] 1)  -- expected: (1,4)
  print (atPosition [0,2] 0)  -- expected: (0,0)
  print (atPosition [8,6,4] 2)  -- expected: (2,4)
