-- Title: Find the penultimate element without partial functions
{-
QUESTION
Write penultimate. Return Nothing for fewer than two elements,
otherwise return Just the second-last element. Derive the stopping
pattern that avoids demanding a missing element.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

-- Read the question: Write penultimate with the stated list and result types.
-- Plan: Match the empty list before taking a component; consume one cell per step.
penultimate :: [Integer] -> Maybe Integer
-- Base cases handle missing data; the recursive case consumes list structure.
penultimate [] = Nothing
penultimate [_] = Nothing
penultimate [x,_] = Just x
penultimate (_:xs) = penultimate xs

main :: IO ()
main = do
  print (penultimate [])  -- expected: Nothing
  print (penultimate [1])  -- expected: Nothing
  print (penultimate [1,2])  -- expected: Just 1
  print (penultimate [1,2,3])  -- expected: Just 2
  print (penultimate [4,4,9,8])  -- expected: Just 9
