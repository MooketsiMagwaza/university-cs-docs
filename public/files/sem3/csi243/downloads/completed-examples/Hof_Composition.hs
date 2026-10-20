-- Title: Compose filtering and summation
{-
QUESTION
Write total :: [Integer] -> Integer without naming its list argument. [4]
Use (.) to compose sum with filter even.
-}

-- Read the question: Write total :: [Integer] -> Integer.
-- Plan: Read the composition from right to left.
total :: [Integer] -> Integer
total = sum . filter even  -- Filter first, sum second.

main :: IO ()
main = do
  print (total [])  -- expected: 0
  print (total [1])  -- expected: 0
  print (total [2])  -- expected: 2
  print (total [1,2,3,4])  -- expected: 6
  print (total [-2,0,6])  -- expected: 4
