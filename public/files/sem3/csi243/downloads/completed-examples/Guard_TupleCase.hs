-- Title: Classify a pair of Boolean flags with case
{-
QUESTION
Write status :: (Bool,Bool) -> String using case on the tuple. [4]
Map (True,True) to "Both", (True,False) to "Left",
(False,True) to "Right", and (False,False) to "Neither".
-}

-- Read the question: Write status :: (Bool,Bool) -> String.
-- Plan: Use one alternative for each pair of flags.
status :: (Bool,Bool) -> String
status flags = case flags of
  (True,True) -> "Both"
  (True,False) -> "Left"
  (False,True) -> "Right"
  (False,False) -> "Neither"  -- All four patterns covered.

main :: IO ()
main = do
  print (status (False,False))  -- expected: "Neither"
  print (status (True,False))  -- expected: "Left"
  print (status (False,True))  -- expected: "Right"
  print (status (True,True))  -- expected: "Both"
  print (status (0 < 1,2 < 1))  -- expected: "Left"
