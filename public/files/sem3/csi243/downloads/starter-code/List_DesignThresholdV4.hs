-- Title: Test recursive membership with short-circuiting
{-
QUESTION
Write has target xs. Return True if target occurs and False otherwise.
Stop at the first match; the empty list contains no value.
Use explicit recursion and pattern matching; do not use list library
functions, comprehensions, indexing (!!), head, tail, last or init.
-}

has :: Integer -> [Integer] -> Bool
has = undefined -- Your answer here

main :: IO ()
main = do
  print (has 2 [])  -- expected: False
  print (has 2 [2])  -- expected: True
  print (has 2 [1,3])  -- expected: False
  print (has 2 [1,2,2])  -- expected: True
  print (has (-1) [0,-1,2])  -- expected: True
