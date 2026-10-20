-- Title: Use map to square each value
{-
QUESTION
Write transform :: [Integer] -> [Integer] using map to square each value. [3]
Use a lambda.
-}

transform :: [Integer] -> [Integer]
transform = undefined  -- Your answer here

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [0]
  print (transform [1,2,3])  -- expected: [1,4,9]
  print (transform [-3,3])  -- expected: [9,9]
  print (transform [7])  -- expected: [49]
