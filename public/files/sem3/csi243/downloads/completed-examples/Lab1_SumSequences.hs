-- Title: Add corresponding sequence terms
{-
QUESTION
Provide a specification, dry run and recursive implementation of
combineSequences :: [Int] -> [Int] -> [Int].
Sum two sequences term by term.
Stop when either sequence ends; ignore any unmatched suffix.
-}

-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Int]..
-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Int].
-- Plan: Combine the two heads and recurse on both tails; stop at the shorter list.
-- Dry run: combineSequences [4,5,6] [1,2] = 5 : (7 : []) = [5,7].
combineSequences :: [Int] -> [Int] -> [Int]
combineSequences [] _ = [] -- Base: first sequence ended.
combineSequences _ [] = [] -- Base: second sequence ended.
combineSequences (x:xs) (y:ys) = (x + y) : combineSequences xs ys

main :: IO ()
main = do
  print (combineSequences [] [])  -- expected: []
  print (combineSequences [3] [5])  -- expected: [8]
  print (combineSequences [4,5,6] [1,2])  -- expected: [5,7]
  print (combineSequences [] [1])  -- expected: []
  print (combineSequences [1,3] [2,0])  -- expected: [3,3]
