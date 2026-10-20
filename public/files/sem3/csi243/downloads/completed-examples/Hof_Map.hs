-- Title: Use map to add three
{-
QUESTION
Write transform :: [Integer] -> [Integer] using map to add three. [3]
Use an operator section.
-}

-- Read the question: Write transform :: [Integer] -> [Integer].
-- Plan: Partially apply map to the requested transformation.
transform :: [Integer] -> [Integer]
transform = map (+3)  -- Apply the same function to every element.

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [3]
  print (transform [1,2,3])  -- expected: [4,5,6]
  print (transform [-3,3])  -- expected: [0,6]
  print (transform [7])  -- expected: [10]
