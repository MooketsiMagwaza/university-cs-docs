-- Title: Validate a Boolean enumeration index before toEnum
{-
QUESTION
Write boolAt :: Int -> Maybe Bool. (4 marks)
Use fromEnum for both limits and toEnum only inside them. Explain why
toEnum 2 :: Bool would fail; the invalid call must stay commented.
-}

boolAt :: Int -> Maybe Bool
boolAt = undefined -- Your answer here

main :: IO ()
main = do
  print (boolAt (-1))  -- expected: Nothing
  print (boolAt (0))  -- expected: Just False
  print (boolAt (1))  -- expected: Just True
  print (boolAt (2))  -- expected: Nothing
  print (boolAt (99))  -- expected: Nothing
