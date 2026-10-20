-- Title: Use filter to retain multiples of three
{-
QUESTION
Write select :: [Integer] -> [Integer] using filter. [3]
Keep multiples of three in input order.
-}

-- Read the question: Write select :: [Integer] -> [Integer].
-- Plan: Supply the predicate to filter.
select :: [Integer] -> [Integer]
select = filter (\x -> mod x 3 == 0)  -- Test every input element.

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [1])  -- expected: []
  print (select [0])  -- expected: [0]
  print (select [1,3,6,8])  -- expected: [3,6]
  print (select [-3,2,9])  -- expected: [-3,9]
