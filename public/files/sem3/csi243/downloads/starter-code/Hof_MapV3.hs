-- Title: Use map to subtract each value from ten
{-
QUESTION
Write transform :: [Integer] -> [Integer] using map to subtract each value from ten. [3]
Use an operator section.
-}

transform :: [Integer] -> [Integer]
transform = undefined  -- Your answer here

main :: IO ()
main = do
  print (transform [])  -- expected: []
  print (transform [0])  -- expected: [10]
  print (transform [1,2,3])  -- expected: [9,8,7]
  print (transform [-3,3])  -- expected: [13,7]
  print (transform [7])  -- expected: [3]
