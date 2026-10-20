-- Title: Select all integers divisible by three recursively
{-
QUESTION
Write multiplesOfThree :: [Int] -> [Int] recursively.
Return all integers divisible by 3, including zero and negative multiples.
Keep the original order and duplicates; empty input returns [].
-}

-- Read the question: Write multiplesOfThree :: [Int] -> [Int].
-- Plan: Test each head against the condition and recursively select from the tail.
-- Dry run: multiplesOfThree [-3,5,0,6] = -3 : (0 : (6 : [])) = [-3,0,6].
multiplesOfThree :: [Int] -> [Int]
multiplesOfThree [] = [] -- Base: empty selection.
multiplesOfThree (x:xs)
  | x `mod` 3 == 0 = x : multiplesOfThree xs
  | otherwise = multiplesOfThree xs

main :: IO ()
main = do
  print (multiplesOfThree [-3,5,0,6])  -- expected: [-3,0,6]
  print (multiplesOfThree [])  -- expected: []
  print (multiplesOfThree [0])  -- expected: [0]
  print (multiplesOfThree [5])  -- expected: []
  print (multiplesOfThree [3,3,4])  -- expected: [3,3]
