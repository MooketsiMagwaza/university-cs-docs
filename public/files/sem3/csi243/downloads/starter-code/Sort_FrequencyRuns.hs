-- Title: Build an ascending integer frequency table
{-
QUESTION
Write frequencies :: [Int] -> [(Int,Int)].
Count every integer, output keys in ascending order, and use group
after sort. Explain why each group passed to head is nonempty.
-}

frequencies :: [Int] -> [(Int,Int)]
frequencies = undefined -- Your answer here

main :: IO ()
main = do
  print (frequencies [])  -- expected: []
  print (frequencies [4])  -- expected: [(4,1)]
  print (frequencies [2,1,2,3,1])  -- expected: [(1,2),(2,2),(3,1)]
  print (frequencies [0,0,0])  -- expected: [(0,3)]
  print (frequencies [-1,2,-1])  -- expected: [(-1,2),(2,1)]
