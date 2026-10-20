-- Title: Compose word lengths and a sum
{-
QUESTION
Write total :: [String] -> Int without naming its list argument. [4]
Use (.) to compose sum with map length; count all characters.
-}

total :: [String] -> Int
total = undefined  -- Your answer here

main :: IO ()
main = do
  print (total [])  -- expected: 0
  print (total [""])  -- expected: 0
  print (total ["a"])  -- expected: 1
  print (total ["cat","dog"])  -- expected: 6
  print (total ["a","","bird"])  -- expected: 5
