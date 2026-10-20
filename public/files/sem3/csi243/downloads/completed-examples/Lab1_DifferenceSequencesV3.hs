-- Title: Test equality of corresponding sequence terms
{-
QUESTION
Provide a specification, dry run and recursive implementation of
combineSequences :: [Int] -> [Int] -> [Bool].
Return whether corresponding terms are equal.
Stop when either sequence ends; ignore any unmatched suffix.
-}

-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Bool]..
-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Bool].
-- Plan: Combine the two heads and recurse on both tails; stop at the shorter list.
-- Dry run: combineSequences [4,5,6] [1,2] = False : (False : []) = [False,False].
combineSequences :: [Int] -> [Int] -> [Bool]
combineSequences [] _ = [] -- Base: first sequence ended.
combineSequences _ [] = [] -- Base: second sequence ended.
combineSequences (x:xs) (y:ys) = (x == y) : combineSequences xs ys

main :: IO ()
main = do
  print (combineSequences [] [])  -- expected: []
  print (combineSequences [3] [5])  -- expected: [False]
  print (combineSequences [4,5,6] [1,2])  -- expected: [False,False]
  print (combineSequences [] [1])  -- expected: []
  print (combineSequences [1,3] [2,0])  -- expected: [False,False]
