-- Title: Design product, length, count and mapping folds
{-
QUESTION
Using foldr only for traversal, write productF :: [Int] -> Int,
lengthF :: [Int] -> Int, countF :: [Int] -> Int and mapF :: [Int] -> [Int].
countF counts elements satisfying (\x -> mod x 3 == 0); mapF replaces x by negate x.
Also write productTo :: Int -> Int using foldr over 1 through n;
return 1 for n <= 0. Do not use product, length, filter or map. The empty product is 1. (12 marks)
-}

productF :: [Int] -> Int
productF = undefined -- Your answer here

lengthF :: [Int] -> Int
lengthF = undefined -- Your answer here

countF :: [Int] -> Int
countF = undefined -- Your answer here

mapF :: [Int] -> [Int]
mapF = undefined -- Your answer here

productTo :: Int -> Int
productTo = undefined -- Your answer here

main :: IO ()
main = do
  print (productF [], lengthF [], countF [], mapF [])  -- expected: (1,0,0,[])
  print (productF [2], lengthF [2], countF [2], mapF [2])  -- expected: (2,1,0,[-2])
  print (productF [1,2,3], lengthF [1,2,3], countF [1,2,3], mapF [1,2,3])  -- expected: (6,3,1,[-1,-2,-3])
  print (productF [0,4], lengthF [0,4], countF [0,4], mapF [0,4])  -- expected: (0,2,1,[0,-4])
  print (productF [-2,3], lengthF [-2,3], countF [-2,3], mapF [-2,3])  -- expected: (-6,2,1,[2,-3])
  print (productTo (-2))  -- expected: 1
  print (productTo 0)  -- expected: 1
  print (productTo 4)  -- expected: 24
