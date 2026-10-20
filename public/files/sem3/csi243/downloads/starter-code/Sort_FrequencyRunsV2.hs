-- Title: Count words in lexicographic key order
{-
QUESTION
Write frequencies :: [String] -> [(String,Int)].
Count case-sensitive words and output keys in lexicographic order.
Use group after sort, rather than counting only consecutive runs.
-}

frequencies :: [String] -> [(String,Int)]
frequencies = undefined -- Your answer here

main :: IO ()
main = do
  print (frequencies [])  -- expected: []
  print (frequencies [""])  -- expected: [("",1)]
  print (frequencies ["cat","ant","cat"])  -- expected: [("ant",1),("cat",2)]
  print (frequencies ["a","A","a"])  -- expected: [("A",1),("a",2)]
  print (frequencies ["x","y","x","y"])  -- expected: [("x",2),("y",2)]
