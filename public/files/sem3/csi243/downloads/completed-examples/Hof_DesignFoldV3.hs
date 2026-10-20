-- Title: Design product, length, count and mapping folds
{-
QUESTION
Using foldr only for traversal, write productF :: [Int] -> Int,
lengthF :: [Int] -> Int, countF :: [Int] -> Int and mapF :: [Int] -> [Int].
countF counts elements satisfying (>0); mapF replaces x by x*x.
Also write productTo :: Int -> Int using foldr over 1 through n;
return 1 for n <= 0. Do not use product, length, filter or map. The empty product is 1. (12 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- lengthF :: [Int] -> Int, countF :: [Int] -> Int and mapF :: [Int] -> [Int].
-- productF :: [Int] -> Int
-- lengthF :: [Int] -> Int
-- countF :: [Int] -> Int
-- mapF :: [Int] -> [Int]
-- productTo :: Int -> Int
-- Plan: Choose the empty identity, then replace the recursive tail by acc.
productF :: [Int] -> Int
-- Multiplication has identity 1.
productF = foldr (*) 1

lengthF :: [Int] -> Int
lengthF = foldr (\_ acc -> 1+acc) 0

countF :: [Int] -> Int
countF = foldr (\x acc -> if (>0) x then 1+acc else acc) 0

mapF :: [Int] -> [Int]
mapF = foldr (\x acc -> (x*x):acc) []

-- The empty range has product 1, including when n is negative.
productTo :: Int -> Int
productTo n = foldr (*) 1 [1..n]

main :: IO ()
main = do
  print (productF [], lengthF [], countF [], mapF [])  -- expected: (1,0,0,[])
  print (productF [2], lengthF [2], countF [2], mapF [2])  -- expected: (2,1,1,[4])
  print (productF [1,2,3], lengthF [1,2,3], countF [1,2,3], mapF [1,2,3])  -- expected: (6,3,3,[1,4,9])
  print (productF [0,4], lengthF [0,4], countF [0,4], mapF [0,4])  -- expected: (0,2,1,[0,16])
  print (productF [-2,3], lengthF [-2,3], countF [-2,3], mapF [-2,3])  -- expected: (-6,2,1,[4,9])
  print (productTo (-2))  -- expected: 1
  print (productTo 0)  -- expected: 1
  print (productTo 4)  -- expected: 24
