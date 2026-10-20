-- Title: Use map to add three
{-
QUESTION
Write transform :: [Integer] -> [Integer] using map to add three. [3]
Use an operator section.
-}

transform :: [Integer] -> [Integer]
transform = undefined  -- Your answer here

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [3]
  print (transform [1,2,3])  -- expected: [4,5,6]
  print (transform [-3,3])  -- expected: [0,6]
  print (transform [7])  -- expected: [10]
