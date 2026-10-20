-- Title: Count copied cells in append-based reverse
{-
QUESTION
Write reverseCount :: [Int] -> ([Int], Int) using recursive reverse
followed by append of the singleton head. Count one copied list cell
for each non-empty left-argument cell traversed by append; do not count
the singleton itself. C(0)=0; C(n)=C(n-1)+(n-1), so C(n)=n(n-1)/2.
This is quadratic append work, under a fully demanded finite result.
-}

-- Read the question: Write a definition; reverseCount has input/result type [Int] -> ([Int], Int).
-- Plan: Carry a counter for the specified list construction or append traversal.
reverseCount :: [Int] -> ([Int], Int)
reverseCount [] = ([], 0)
reverseCount (x:xs) = (result, c+d)
  where
    (r,c) = reverseCount xs
    (result,d) = appendCount r [x]
    appendCount [] ys = (ys,0)
    appendCount (a:as) ys = (a:rest,k+1)
      where (rest,k) = appendCount as ys

main :: IO ()
main = do
  print (reverseCount [])  -- expected: ([],0)
  print (reverseCount [4])  -- expected: ([4],0)
  print (reverseCount [1,2])  -- expected: ([2,1],1)
  print (reverseCount [1,2,3])  -- expected: ([3,2,1],3)
  print (reverseCount [1,2,3,4])  -- expected: ([4,3,2,1],6)
