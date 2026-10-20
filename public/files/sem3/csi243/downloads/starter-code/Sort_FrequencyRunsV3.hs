-- Title: Count consecutive runs without reordering integers
{-
QUESTION
Write frequencies :: [Int] -> [(Int,Int)].
Count consecutive runs only, preserving their order. Do not sort.
The same value may appear in multiple result pairs if its runs are
separated. Contrast this result with a frequency table after sorting.
-}

frequencies :: [Int] -> [(Int,Int)]
frequencies = undefined -- Your answer here

main :: IO ()
main = do
  print (frequencies [])  -- expected: []
  print (frequencies [4])  -- expected: [(4,1)]
  print (frequencies [2,2,1,2])  -- expected: [(2,2),(1,1),(2,1)]
  print (frequencies [0,0,0])  -- expected: [(0,3)]
  print (frequencies [1,2,1,2])  -- expected: [(1,1),(2,1),(1,1),(2,1)]
