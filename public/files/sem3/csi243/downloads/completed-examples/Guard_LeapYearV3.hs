-- Title: Classify leap years and ordinary centuries
{-
QUESTION
Write yearKind :: Integer -> String using guards for positive years. [5]
Return "Leap" for Gregorian leap years, "Century" for non-leap multiples
of 100, and "Common" otherwise.
-}

-- Read the question: Write yearKind :: Integer -> String.
-- Plan: Distinguish the century case before testing divisibility by four.
yearKind :: Integer -> String
yearKind y
  | mod y 400 == 0 = "Leap"
  | mod y 100 == 0 = "Century"
  | mod y 4 == 0 = "Leap"
  | otherwise = "Common"  -- All remaining years.

main :: IO ()
main = do
  print (yearKind 1)  -- expected: "Common"
  print (yearKind 1900)  -- expected: "Century"
  print (yearKind 2000)  -- expected: "Leap"
  print (yearKind 2024)  -- expected: "Leap"
  print (yearKind 2023)  -- expected: "Common"
