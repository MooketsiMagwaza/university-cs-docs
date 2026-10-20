-- Title: Find generic bounds and check the min and max laws
{-
QUESTION
Write boundChecks :: Ord a => a -> a -> (a,a,Bool).
Return min x y, max x y, and whether both bounds contain both inputs:
lo <= x && lo <= y && x <= hi && y <= hi. (5 marks)
Assume total, lawfully ordered values. Do not claim these checks prove a law
for every possible instance or for floating NaN.
-}

boundChecks :: Ord a => a -> a -> (a,a,Bool)
boundChecks = undefined -- Your answer here

main :: IO ()
main = do
  print (boundChecks (4 :: Int) 2)  -- expected: (2,4,True)
  print (boundChecks (0 :: Int) 0)  -- expected: (0,0,True)
  print (boundChecks (-3 :: Int) 1)  -- expected: (-3,1,True)
  print (boundChecks "" "ant")  -- expected: ("","ant",True)
  print (boundChecks 'z' 'a')  -- expected: ('a','z',True)
