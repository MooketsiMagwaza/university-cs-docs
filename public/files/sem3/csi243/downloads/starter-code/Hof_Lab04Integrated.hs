-- Title: Build a selection fold and a three-weight mark function
{-
QUESTION
Write selectF :: (a -> Bool) -> [a] -> [a] using foldr, not filter.
Write process :: [Int] -> [Int] to retain values satisfying (>50)
and replace retained x by x; use selectF and a fold mapping step.
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
  print (process [50])  -- expected: []
  print (process [51])  -- expected: [51]
  print (process [10,60,50,80])  -- expected: [60,80]
  print (process [-1,100])  -- expected: [100]
  print (final3 30 60 90)  -- expected: 70.0
  print (fmark3 [30,0] [60] [90,0])  -- expected: [70.0]
  print (fmark3 [30] [60] [])  -- expected: []
  print (fmark3 [] [60] [90])  -- expected: []
  print (fmark3 [30] [] [90])  -- expected: []
  print (fmark3 [] [] [])  -- expected: []
  print (fmark3 [30] [60,0] [90,0])  -- expected: [70.0]
  print (fmark3 [30,0] [60,0] [90])  -- expected: [70.0]
