-- Title: Model repeated versus shared invariant length work
{-
QUESTION
Write lengthModels :: [Int] -> (Int, Int, Int). Model the expression
[x | x <- xs, length xs > 3] under two explicit evaluation policies:
(1) compute length xs separately for each candidate, with no sharing;
(2) compute it once and reuse it. Return output length, length-cell
visits in model 1, length-cell visits in model 2. Count only visits inside
length; n is finite. The counts are n*n and n. These are source-level
models, not a claim that GHC necessarily recomputes the invariant.
An optimiser or explicit binding may share work.
-}

lengthModels :: [Int] -> (Int, Int, Int)
lengthModels = undefined -- Your answer here

main :: IO ()
main = do
  print (lengthModels [])  -- expected: (0,0,0)
  print (lengthModels [9])  -- expected: (0,1,1)
  print (lengthModels [1,2,3])  -- expected: (0,9,3)
  print (lengthModels [1,2,3,4])  -- expected: (4,16,4)
  print (lengthModels [1,2,3,4,5])  -- expected: (5,25,5)
