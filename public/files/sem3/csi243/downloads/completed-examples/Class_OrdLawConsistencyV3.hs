-- Title: Find generic bounds and check the min and max laws
{-
QUESTION
Write boundChecks :: Ord a => a -> a -> (a,a,Bool).
Return min x y, max x y, and whether both bounds contain both inputs:
lo <= x && lo <= y && x <= hi && y <= hi. (5 marks)
Assume total, lawfully ordered values. Do not claim these checks prove a law
for every possible instance or for floating NaN.
-}

-- Read the question: Write a generic two-input bounds function returning a triple.
-- Plan: Name min and max once, then check all four inequalities.
boundChecks :: Ord a => a -> a -> (a,a,Bool)
-- Equal inputs give the same lower and upper bound.
boundChecks x y = (lo, hi, lo <= x && lo <= y && x <= hi && y <= hi)
  where
    lo = min x y
    hi = max x y

main :: IO ()
main = do
  print (boundChecks (4 :: Int) 2)  -- expected: (2,4,True)
  print (boundChecks (0 :: Int) 0)  -- expected: (0,0,True)
  print (boundChecks (-3 :: Int) 1)  -- expected: (-3,1,True)
  print (boundChecks "" "ant")  -- expected: ("","ant",True)
  print (boundChecks 'z' 'a')  -- expected: ('a','z',True)
