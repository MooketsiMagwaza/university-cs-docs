-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Row a = [a] and Grid a = [Row a], fully expand Grid Char.
Write rowSizes :: Grid a -> [Int] to count the elements in each row.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

type Row a = [a]
type Grid a = [Row a]

rowSizes :: Grid a -> [Int]
rowSizes = undefined -- Your answer here

main :: IO ()
main = do
  print (rowSizes ([] :: Grid Char))  -- expected: []
  print (rowSizes [""])  -- expected: [0]
  print (rowSizes ["ab","c"])  -- expected: [2,1]
  print (rowSizes ["","abc","d"])  -- expected: [0,3,1]
  print (rowSizes ["x"])  -- expected: [1]
