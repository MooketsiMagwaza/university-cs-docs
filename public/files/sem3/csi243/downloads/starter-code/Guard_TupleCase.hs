-- Title: Classify a pair of Boolean flags with case
{-
QUESTION
Write status :: (Bool,Bool) -> String using case on the tuple. [4]
Map (True,True) to "Both", (True,False) to "Left",
(False,True) to "Right", and (False,False) to "Neither".
-}

status :: (Bool,Bool) -> String
status = undefined  -- Your answer here

main :: IO ()
main = do
  print (status (False,False))  -- expected: "Neither"
  print (status (True,False))  -- expected: "Left"
  print (status (False,True))  -- expected: "Right"
  print (status (True,True))  -- expected: "Both"
  print (status (0 < 1,2 < 1))  -- expected: "Left"
