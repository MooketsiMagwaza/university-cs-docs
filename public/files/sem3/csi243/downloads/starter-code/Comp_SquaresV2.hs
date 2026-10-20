-- Title: Generate cubes with a comprehension
{-
QUESTION
Write transform :: [Integer] -> [Integer] using a list comprehension. [3]
Return the cubes of the input values, in their original order.
-}

transform :: [Integer] -> [Integer]
transform = undefined  -- Your answer here

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [0]
  print (transform [1,2,3])  -- expected: [1,8,27]
  print (transform [-2,-1,0])  -- expected: [-8,-1,0]
  print (transform [4])  -- expected: [64]
