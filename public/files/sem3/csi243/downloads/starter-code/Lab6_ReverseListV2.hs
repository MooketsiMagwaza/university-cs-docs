-- Title: Reverse every inner list without reordering the outer list.
{-
QUESTION
Write reverseRows :: [[a]] -> [[a]]. Reverse each inner list, keeping
the outer list in its original order. The function must work for any
element type and handle empty inner and outer lists.
-}

reverseRows :: [[a]] -> [[a]]
reverseRows = undefined -- Your answer here

main :: IO ()
main = do
  print (reverseRows ([] :: [[Int]]))  -- expected: []
  print (reverseRows ([[]] :: [[Int]]))  -- expected: [[]]
  print (reverseRows ([[1,2],[3],[]] :: [[Int]]))  -- expected: [[2,1],[3],[]]
  print (reverseRows ["ab","xyz"])  -- expected: ["ba","zyx"]
  print (reverseRows [[True,False]])  -- expected: [[False,True]]
