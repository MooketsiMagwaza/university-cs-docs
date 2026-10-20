-- Title: Classify leap years and ordinary centuries
{-
QUESTION
Write yearKind :: Integer -> String using guards for positive years. [5]
Return "Leap" for Gregorian leap years, "Century" for non-leap multiples
of 100, and "Common" otherwise.
-}

yearKind :: Integer -> String
yearKind = undefined  -- Your answer here

main :: IO ()
main = do
  print (yearKind 1)  -- expected: "Common"
  print (yearKind 1900)  -- expected: "Century"
  print (yearKind 2000)  -- expected: "Leap"
  print (yearKind 2024)  -- expected: "Leap"
  print (yearKind 2023)  -- expected: "Common"
