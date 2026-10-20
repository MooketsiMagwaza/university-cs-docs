-- Title: Add a finite geometric series recursively
{-
QUESTION
Write geometric :: Integer -> Integer -> Integer recursively. [5]
geometric b n sums the first n terms 1,b,b^2,...; n >= 0.
Use geometric b 0 = 0 and do not use (^).
-}

-- Read the question: Write geometric :: Integer -> Integer -> Integer.
-- Plan: Factor b out of every term except the initial 1.
geometric :: Integer -> Integer -> Integer
geometric _ 0 = 0  -- No terms.
geometric b n = 1 + b * geometric b (n - 1)

main :: IO ()
main = do
  print (geometric 2 0)  -- expected: 0
  print (geometric 2 1)  -- expected: 1
  print (geometric 2 4)  -- expected: 15
  print (geometric 3 3)  -- expected: 13
  print (geometric (-1) 4)  -- expected: 0
