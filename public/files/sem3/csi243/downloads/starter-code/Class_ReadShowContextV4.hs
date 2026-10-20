-- Title: Read tuples using their field types as context
{-
QUESTION
Write parseValue :: String -> Maybe ((Int,Char)) using readMaybe.
Write roundTrip :: (Int,Char) -> Bool to check parseValue (show x) == Just x.
Explain how the signatures supply the Read result type. A bare read "0"
without a result context cannot choose a unique Read instance. (6 marks)
Use safe parsing; do not execute read on malformed input.
-}

parseValue :: String -> Maybe ((Int,Char))
parseValue = undefined -- Your answer here

roundTrip :: (Int,Char) -> Bool
roundTrip = undefined -- Your answer here

main :: IO ()
main = do
  print (parseValue "(0,'a')")  -- expected: Just (0,'a')
  print (parseValue "(2,'z')")  -- expected: Just (2,'z')
  print (parseValue "(1,True)")  -- expected: Nothing
  print (parseValue "(1,'ab')")  -- expected: Nothing
  print (parseValue "")  -- expected: Nothing
  print (roundTrip ((0,'a')))  -- expected: True
  print (roundTrip ((2,'z')))  -- expected: True
