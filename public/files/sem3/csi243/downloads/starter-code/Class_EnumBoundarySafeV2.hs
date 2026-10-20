-- Title: Guard pred at the lower Ordering endpoint
{-
QUESTION
Write previousValue :: Ordering -> Maybe Ordering. (4 marks)
Use pred only above minBound. Explain why pred LT would fail.
-}

previousValue :: Ordering -> Maybe Ordering
previousValue = undefined -- Your answer here

main :: IO ()
main = do
  print (previousValue (LT))  -- expected: Nothing
  print (previousValue (EQ))  -- expected: Just LT
  print (previousValue (GT))  -- expected: Just EQ
  print (previousValue (minBound))  -- expected: Nothing
  print (previousValue (maxBound))  -- expected: Just EQ
