-- Title: Read Boolean values with an explicit result context
{-
QUESTION
Write parseValue :: String -> Maybe (Bool) using readMaybe.
Write roundTrip :: Bool -> Bool to check parseValue (show x) == Just x.
Explain how the signatures supply the Read result type. A bare read "0"
without a result context cannot choose a unique Read instance. (6 marks)
Use safe parsing; do not execute read on malformed input.
-}

import Text.Read (readMaybe)

-- Read the question: Write a safe parser from String to Maybe (Bool) and a round-trip test.
-- Plan: Use readMaybe with the result signature providing context; compare the round trip.
parseValue :: String -> Maybe (Bool)
-- readMaybe requires a complete parse, allowing surrounding whitespace.
parseValue = readMaybe

roundTrip :: Bool -> Bool
roundTrip x = parseValue (show x) == Just x

main :: IO ()
main = do
  print (parseValue "True")  -- expected: Just True
  print (parseValue "False")  -- expected: Just False
  print (parseValue "true")  -- expected: Nothing
  print (parseValue "True trailing")  -- expected: Nothing
  print (parseValue "")  -- expected: Nothing
  print (roundTrip (False))  -- expected: True
  print (roundTrip (True))  -- expected: True
