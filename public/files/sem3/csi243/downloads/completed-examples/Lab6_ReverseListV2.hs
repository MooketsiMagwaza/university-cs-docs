-- Title: Reverse every inner list without reordering the outer list.
{-
QUESTION
Write reverseRows :: [[a]] -> [[a]]. Reverse each inner list, keeping
the outer list in its original order. The function must work for any
element type and handle empty inner and outer lists.
-}

-- Read the question: Write [[a]] -> [[a]], reversing at the inner level only.
-- Plan: Reverse the first row and recurse over the remaining rows.
reverseRows :: [[a]] -> [[a]]
-- Each inner reversal is independent; outer positions stay fixed.
reverseRows [] = []
reverseRows (xs:xss) = reverse xs : reverseRows xss

main :: IO ()
main = do
  print (reverseRows ([] :: [[Int]]))  -- expected: []
  print (reverseRows ([[]] :: [[Int]]))  -- expected: [[]]
  print (reverseRows ([[1,2],[3],[]] :: [[Int]]))  -- expected: [[2,1],[3],[]]
  print (reverseRows ["ab","xyz"])  -- expected: ["ba","zyx"]
  print (reverseRows [[True,False]])  -- expected: [[False,True]]
