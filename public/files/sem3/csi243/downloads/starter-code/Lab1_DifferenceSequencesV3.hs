-- Title: Test equality of corresponding sequence terms
{-
QUESTION
Provide a specification, dry run and recursive implementation of
combineSequences :: [Int] -> [Int] -> [Bool].
Return whether corresponding terms are equal.
Stop when either sequence ends; ignore any unmatched suffix.
-}

combineSequences :: [Int] -> [Int] -> [Bool]
combineSequences = undefined -- Your answer here

main :: IO ()
main = do
  print (combineSequences [] [])  -- expected: []
  print (combineSequences [3] [5])  -- expected: [False]
  print (combineSequences [4,5,6] [1,2])  -- expected: [False,False]
  print (combineSequences [] [1])  -- expected: []
  print (combineSequences [1,3] [2,0])  -- expected: [False,False]
