-- Title: Join lists of integers with a list separator
{-
QUESTION
Write joinRows :: [Int] -> [[Int]] -> [Int] using intercalate.
The separator is itself a list; preserve empty rows and repeated values.
-}

joinRows :: [Int] -> [[Int]] -> [Int]
joinRows = undefined -- Your answer here

main :: IO ()
main = do
  print (joinRows [0] [])  -- expected: []
  print (joinRows [0] [[1]])  -- expected: [1]
  print (joinRows [0] [[1,2],[3]])  -- expected: [1,2,0,3]
  print (joinRows [9,9] [[],[2],[]])  -- expected: [9,9,2,9,9]
  print (joinRows [] [[1],[2]])  -- expected: [1,2]
