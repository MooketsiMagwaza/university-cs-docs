-- Title: Use map to square each value
{-
QUESTION
Write transform :: [Integer] -> [Integer] using map to square each value. [3]
Use a lambda.
-}

-- Read the question: Write transform :: [Integer] -> [Integer].
-- Plan: Partially apply map to the requested transformation.
transform :: [Integer] -> [Integer]
transform = map (\x -> x*x)  -- Apply the same function to every element.

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [0]
  print (transform [1,2,3])  -- expected: [1,4,9]
  print (transform [-3,3])  -- expected: [9,9]
  print (transform [7])  -- expected: [49]
