-- Title: Flatten nested lists with recursive append
{-
QUESTION
Write appendR without (++), and flattenR :: [[a]] -> [a]. [6]
Flatten the sublists in order using appendR and recursion, not concat.
-}

appendR :: [a] -> [a] -> [a]
appendR = undefined  -- Your answer here

flattenR :: [[a]] -> [a]
flattenR = undefined  -- Your answer here

main :: IO ()
main = do
  print (flattenR ([] :: [[Int]]))  -- expected: []
  print (flattenR [[],[1],[]])  -- expected: [1]
  print (flattenR [[1,2],[3,4]])  -- expected: [1,2,3,4]
  print (flattenR ["ab","","c"])  -- expected: "abc"
  print (flattenR [[True],[False,True]])  -- expected: [True,False,True]
