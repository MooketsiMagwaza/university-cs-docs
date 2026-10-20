-- Title: Compose filtering and summation
{-
QUESTION
Write total :: [Integer] -> Integer without naming its list argument. [4]
Use (.) to compose sum with filter even.
-}

total :: [Integer] -> Integer
total = undefined  -- Your answer here

main :: IO ()
main = do
  print (total [])  -- expected: 0
  print (total [1])  -- expected: 0
  print (total [2])  -- expected: 2
  print (total [1,2,3,4])  -- expected: 6
  print (total [-2,0,6])  -- expected: 4
