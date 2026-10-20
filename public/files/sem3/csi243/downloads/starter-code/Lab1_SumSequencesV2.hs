-- Title: Multiply corresponding sequence terms
{-
QUESTION
Provide a specification, dry run and recursive implementation of
combineSequences :: [Int] -> [Int] -> [Int].
Multiply two sequences term by term.
Stop when either sequence ends; ignore any unmatched suffix.
-}

combineSequences :: [Int] -> [Int] -> [Int]
combineSequences = undefined -- Your answer here

main :: IO ()
main = do
  print (combineSequences [] [])  -- expected: []
  print (combineSequences [3] [5])  -- expected: [15]
  print (combineSequences [4,5,6] [1,2])  -- expected: [4,10]
  print (combineSequences [] [1])  -- expected: []
  print (combineSequences [1,3] [2,0])  -- expected: [2,0]
