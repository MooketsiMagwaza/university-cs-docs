-- Title: Find the penultimate element without partial functions
{-
QUESTION
Write penultimate. Return Nothing for fewer than two elements,
otherwise return Just the second-last element. Derive the stopping
pattern that avoids demanding a missing element.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

penultimate :: [Integer] -> Maybe Integer
penultimate = undefined -- Your answer here

main :: IO ()
main = do
  print (penultimate [])  -- expected: Nothing
  print (penultimate [1])  -- expected: Nothing
  print (penultimate [1,2])  -- expected: Just 1
  print (penultimate [1,2,3])  -- expected: Just 2
  print (penultimate [4,4,9,8])  -- expected: Just 9
