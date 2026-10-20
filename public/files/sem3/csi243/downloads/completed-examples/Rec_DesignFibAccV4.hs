-- Title: Return adjacent Fibonacci values together
{-
QUESTION
Write sequenceAt with the signature below; reject negative indices.
Return (F_n,F_(n+1)), with F_0=0, F_1=1 and F_(n+2)=F_n+F_(n+1).
Use two accumulators and one recursive call per step; do not use lists.
-}

-- Read the question: Write sequenceAt with the stated domain and result type.
-- Plan: Keep adjacent sequence values; decrease the remaining index to zero.
sequenceAt :: Int -> Maybe (Integer,Integer)
-- Base cases stop recursion; each recursive call reduces the stated measure.
sequenceAt n
  | n < 0 = Nothing
  | otherwise = Just (go n 0 1)
  where
    go 0 x y = (x,y)
    go k x y = go (k-1) y (x+1*y)

main :: IO ()
main = do
  print (sequenceAt (-1))  -- expected: Nothing
  print (sequenceAt 0)  -- expected: Just (0,1)
  print (sequenceAt 1)  -- expected: Just (1,1)
  print (sequenceAt 3)  -- expected: Just (2,3)
  print (sequenceAt 7)  -- expected: Just (13,21)
