-- Title: Form all differences with list Applicative
{-
QUESTION
Write differences :: [Int] -> [Int] -> [Int] using (-) <$> xs <*> ys.
Keep left-input-major order. This is Cartesian application, not zipWith:
each left value combines with every right value.
-}

-- Read the question: Write a definition; differences has input/result type [Int] -> [Int] -> [Int].
-- Plan: Use list application with one branch for each ordered combination.
differences :: [Int] -> [Int] -> [Int]
differences xs ys = (-) <$> xs <*> ys -- Every ordered pair is used.

main :: IO ()
main = do
  print (differences [] [1])  -- expected: []
  print (differences [1] [])  -- expected: []
  print (differences [5] [2])  -- expected: [3]
  print (differences [2,4] [1,3])  -- expected: [1,-1,3,1]
  print (differences [0,-1] [2])  -- expected: [-2,-3]
