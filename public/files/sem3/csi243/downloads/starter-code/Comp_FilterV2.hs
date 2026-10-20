-- Title: Select multiples of three with a comprehension
{-
QUESTION
Write select :: [Integer] -> [Integer] using a comprehension. [4]
Keep only multiples of three, preserving order and duplicates.
-}

select :: [Integer] -> [Integer]
select = undefined  -- Your answer here

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [1])  -- expected: []
  print (select [0,1,2,3,4])  -- expected: [0,3]
  print (select [-3,-2,-1])  -- expected: [-3]
  print (select [6,6,7])  -- expected: [6,6]
