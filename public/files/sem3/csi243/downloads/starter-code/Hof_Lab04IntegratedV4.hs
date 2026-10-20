-- Title: Build a selection fold and a three-weight mark function
{-
QUESTION
Write selectF :: (a -> Bool) -> [a] -> [a] using foldr, not filter.
Write process :: [Int] -> [Int] to retain values satisfying (>=0)
and replace retained x by x+10; use selectF and a fold mapping step.
Write final3 :: Int -> Int -> Int -> Double for weights 1:2:3, converting
before division. Write fmark3 :: [Int] -> [Int] -> [Int] -> [Double]
using zipWith3 final3 and the shortest-list policy. (12 marks)
-}

selectF :: (a -> Bool) -> [a] -> [a]
selectF = undefined -- Your answer here

process :: [Int] -> [Int]
process = undefined -- Your answer here

final3 :: Int -> Int -> Int -> Double
final3 = undefined -- Your answer here

fmark3 :: [Int] -> [Int] -> [Int] -> [Double]
fmark3 = undefined -- Your answer here

main :: IO ()
main = do
  print (process [])  -- expected: []
  print (process [-1])  -- expected: []
  print (process [0])  -- expected: [10]
  print (process [-1,0,2])  -- expected: [10,12]
  print (process [-3,5])  -- expected: [15]
  print (final3 30 60 90)  -- expected: 70.0
  print (fmark3 [30,0] [60] [90,0])  -- expected: [70.0]
  print (fmark3 [30] [60] [])  -- expected: []
  print (fmark3 [] [60] [90])  -- expected: []
  print (fmark3 [30] [] [90])  -- expected: []
  print (fmark3 [] [] [])  -- expected: []
  print (fmark3 [30] [60,0] [90,0])  -- expected: [70.0]
  print (fmark3 [30,0] [60,0] [90])  -- expected: [70.0]
