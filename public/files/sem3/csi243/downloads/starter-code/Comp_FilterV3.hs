-- Title: Select valid passing marks with a comprehension
{-
QUESTION
Write select :: [Integer] -> [Integer] using a comprehension. [4]
Keep only valid passing marks, preserving order and duplicates.
-}

select :: [Integer] -> [Integer]
select = undefined  -- Your answer here

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [50])  -- expected: [50]
  print (select [49,50,100,101])  -- expected: [50,100]
  print (select [-1,0,99])  -- expected: [99]
  print (select [60,60,40])  -- expected: [60,60]
