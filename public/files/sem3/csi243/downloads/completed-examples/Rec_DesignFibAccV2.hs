-- Title: Change the accumulator seeds to Lucas numbers
{-
QUESTION
Write sequenceAt with the signature below; reject negative indices.
Use S_0=2, S_1=1 and S_(n+2)=S_n+1*S_(n+1).
Return S_n.
Use two accumulators and one recursive call per step; do not use lists.
-}

-- Read the question: Write sequenceAt with the stated domain and result type.
-- Plan: Keep adjacent sequence values; decrease the remaining index to zero.
sequenceAt :: Int -> Maybe Integer
-- Base cases stop recursion; each recursive call reduces the stated measure.
sequenceAt n
  | n < 0 = Nothing
  | otherwise = Just (go n 2 1)
  where
    go 0 x y = x
    go k x y = go (k-1) y (x+1*y)

main :: IO ()
main = do
  print (sequenceAt (-1))  -- expected: Nothing
  print (sequenceAt 0)  -- expected: Just 2
  print (sequenceAt 1)  -- expected: Just 1
  print (sequenceAt 3)  -- expected: Just 4
  print (sequenceAt 7)  -- expected: Just 29
