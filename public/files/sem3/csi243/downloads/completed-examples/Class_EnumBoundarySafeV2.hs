-- Title: Guard pred at the lower Ordering endpoint
{-
QUESTION
Write previousValue :: Ordering -> Maybe Ordering. (4 marks)
Use pred only above minBound. Explain why pred LT would fail.
-}

-- Read the question: Write an enumeration-method function with an explicit boundary policy.
-- Plan: Check finite endpoints before applying a partial method.
previousValue :: Ordering -> Maybe Ordering
-- The boundary policy is part of the function contract.
previousValue x
  | x == minBound = Nothing
  | otherwise = Just (pred x)

main :: IO ()
main = do
  print (previousValue (LT))  -- expected: Nothing
  print (previousValue (EQ))  -- expected: Just LT
  print (previousValue (GT))  -- expected: Just EQ
  print (previousValue (minBound))  -- expected: Nothing
  print (previousValue (maxBound))  -- expected: Just EQ
