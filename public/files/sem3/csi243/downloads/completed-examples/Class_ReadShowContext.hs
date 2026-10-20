-- Title: Read integers safely and check a Show round trip
{-
QUESTION
Write parseValue :: String -> Maybe (Integer) using readMaybe.
Write roundTrip :: Integer -> Bool to check parseValue (show x) == Just x.
Explain how the signatures supply the Read result type. A bare read "0"
without a result context cannot choose a unique Read instance. (6 marks)
Use safe parsing; do not execute read on malformed input.
-}

import Text.Read (readMaybe)

-- Read the question: Write a safe parser from String to Maybe (Integer) and a round-trip test.
-- Plan: Use readMaybe with the result signature providing context; compare the round trip.
parseValue :: String -> Maybe (Integer)
-- readMaybe requires a complete parse, allowing surrounding whitespace.
parseValue = readMaybe

roundTrip :: Integer -> Bool
roundTrip x = parseValue (show x) == Just x

main :: IO ()
main = do
  print (parseValue "0")  -- expected: Just 0
  print (parseValue "-12")  -- expected: Just (-12)
  print (parseValue " 7 ")  -- expected: Just 7
  print (parseValue "7x")  -- expected: Nothing
  print (parseValue "")  -- expected: Nothing
  print (roundTrip (0))  -- expected: True
  print (roundTrip (12))  -- expected: True
