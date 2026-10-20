-- Title: Use filter to retain marks at least 50
{-
QUESTION
Write select :: [Integer] -> [Integer] using filter. [3]
Keep marks at least 50 in input order.
-}

-- Read the question: Write select :: [Integer] -> [Integer].
-- Plan: Supply the predicate to filter.
select :: [Integer] -> [Integer]
select = filter (>=50)  -- Test every input element.

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [49])  -- expected: []
  print (select [50])  -- expected: [50]
  print (select [49,50,80])  -- expected: [50,80]
  print (select [100,0,70])  -- expected: [100,70]
