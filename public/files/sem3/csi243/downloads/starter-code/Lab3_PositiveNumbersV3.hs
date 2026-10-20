-- Title: Select all integers divisible by three recursively
{-
QUESTION
Write multiplesOfThree :: [Int] -> [Int] recursively.
Return all integers divisible by 3, including zero and negative multiples.
Keep the original order and duplicates; empty input returns [].
-}

multiplesOfThree :: [Int] -> [Int]
multiplesOfThree = undefined -- Your answer here

main :: IO ()
main = do
  print (multiplesOfThree [-3,5,0,6])  -- expected: [-3,0,6]
  print (multiplesOfThree [])  -- expected: []
  print (multiplesOfThree [0])  -- expected: [0]
  print (multiplesOfThree [5])  -- expected: []
  print (multiplesOfThree [3,3,4])  -- expected: [3,3]
