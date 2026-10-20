-- Title: Compose word lengths and a sum
{-
QUESTION
Write total :: [String] -> Int without naming its list argument. [4]
Use (.) to compose sum with map length; count all characters.
-}

-- Read the question: Write total :: [String] -> Int.
-- Plan: Map each String to its length, then add those lengths.
total :: [String] -> Int
total = sum . map length  -- Change element type before summing.

main :: IO ()
main = do
  print (total [])  -- expected: 0
  print (total [""])  -- expected: 0
  print (total ["a"])  -- expected: 1
  print (total ["cat","dog"])  -- expected: 6
  print (total ["a","","bird"])  -- expected: 5
