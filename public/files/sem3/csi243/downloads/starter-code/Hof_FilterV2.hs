-- Title: Use filter to retain multiples of three
{-
QUESTION
Write select :: [Integer] -> [Integer] using filter. [3]
Keep multiples of three in input order.
-}

select :: [Integer] -> [Integer]
select = undefined  -- Your answer here

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [1])  -- expected: []
  print (select [0])  -- expected: [0]
  print (select [1,3,6,8])  -- expected: [3,6]
  print (select [-3,2,9])  -- expected: [-3,9]
