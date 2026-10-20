-- Title: Read integer lists and reject malformed list syntax
{-
QUESTION
Write parseValue :: String -> Maybe ([Int]) using readMaybe.
Write roundTrip :: [Int] -> Bool to check parseValue (show x) == Just x.
Explain how the signatures supply the Read result type. A bare read "0"
without a result context cannot choose a unique Read instance. (6 marks)
Use safe parsing; do not execute read on malformed input.
-}

import Text.Read (readMaybe)

-- Read the question: Write a safe parser from String to Maybe ([Int]) and a round-trip test.
-- Plan: Use readMaybe with the result signature providing context; compare the round trip.
parseValue :: String -> Maybe ([Int])
-- readMaybe requires a complete parse, allowing surrounding whitespace.
parseValue = readMaybe

roundTrip :: [Int] -> Bool
roundTrip x = parseValue (show x) == Just x

main :: IO ()
main = do
  print (parseValue "[]")  -- expected: Just []
  print (parseValue "[1,2]")  -- expected: Just [1,2]
  print (parseValue "[3]")  -- expected: Just [3]
  print (parseValue "[1,]")  -- expected: Nothing
  print (parseValue "[True]")  -- expected: Nothing
  print (roundTrip ([]))  -- expected: True
  print (roundTrip ([1,2]))  -- expected: True
