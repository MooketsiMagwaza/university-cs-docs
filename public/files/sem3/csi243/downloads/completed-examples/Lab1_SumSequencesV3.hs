-- Title: Take the greater of corresponding sequence terms
{-
QUESTION
Provide a specification, dry run and recursive implementation of
combineSequences :: [Int] -> [Int] -> [Int].
Return the greater value from each corresponding pair of terms.
Stop when either sequence ends; ignore any unmatched suffix.
-}

-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Int]..
-- Read the question: Write combineSequences :: [Int] -> [Int] -> [Int].
-- Plan: Combine the two heads and recurse on both tails; stop at the shorter list.
-- Dry run: combineSequences [4,5,6] [1,2] = 4 : (5 : []) = [4,5].
combineSequences :: [Int] -> [Int] -> [Int]
combineSequences [] _ = [] -- Base: first sequence ended.
combineSequences _ [] = [] -- Base: second sequence ended.
combineSequences (x:xs) (y:ys) = (max x y) : combineSequences xs ys

main :: IO ()
main = do
  print (combineSequences [] [])  -- expected: []
  print (combineSequences [3] [5])  -- expected: [5]
  print (combineSequences [4,5,6] [1,2])  -- expected: [4,5]
  print (combineSequences [] [1])  -- expected: []
  print (combineSequences [1,3] [2,0])  -- expected: [2,3]
