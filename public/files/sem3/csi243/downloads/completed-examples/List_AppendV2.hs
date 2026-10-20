-- Title: Flatten nested lists with recursive append
{-
QUESTION
Write appendR without (++), and flattenR :: [[a]] -> [a]. [6]
Flatten the sublists in order using appendR and recursion, not concat.
-}

-- Read the question: Write appendR :: [a] -> [a] -> [a]; flattenR :: [[a]] -> [a].
-- Plan: Append each sublist to the flattened remaining sublists.
appendR :: [a] -> [a] -> [a]
appendR [] ys = ys
appendR (x:xs) ys = x : appendR xs ys

flattenR :: [[a]] -> [a]
flattenR [] = []  -- No sublists.
flattenR (xs:xss) = appendR xs (flattenR xss)

main :: IO ()
main = do
  print (flattenR ([] :: [[Int]]))  -- expected: []
  print (flattenR [[],[1],[]])  -- expected: [1]
  print (flattenR [[1,2],[3,4]])  -- expected: [1,2,3,4]
  print (flattenR ["ab","","c"])  -- expected: "abc"
  print (flattenR [[True],[False,True]])  -- expected: [True,False,True]
