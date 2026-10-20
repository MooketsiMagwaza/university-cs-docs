-- Title: Validate a Boolean enumeration index before toEnum
{-
QUESTION
Write boolAt :: Int -> Maybe Bool. (4 marks)
Use fromEnum for both limits and toEnum only inside them. Explain why
toEnum 2 :: Bool would fail; the invalid call must stay commented.
-}

-- Read the question: Write an enumeration-method function with an explicit boundary policy.
-- Plan: Check finite endpoints before applying a partial method.
boolAt :: Int -> Maybe Bool
-- The boundary policy is part of the function contract.
boolAt n
  | n < fromEnum (minBound :: Bool) = Nothing
  | n > fromEnum (maxBound :: Bool) = Nothing
  | otherwise = Just (toEnum n)

main :: IO ()
main = do
  print (boolAt (-1))  -- expected: Nothing
  print (boolAt (0))  -- expected: Just False
  print (boolAt (1))  -- expected: Just True
  print (boolAt (2))  -- expected: Nothing
  print (boolAt (99))  -- expected: Nothing
