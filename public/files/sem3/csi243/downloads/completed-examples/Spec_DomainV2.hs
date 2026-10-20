-- Title: Recognise ASCII digits with an explicit invalid subset
{-
QUESTION
Write digitValue :: Char -> Maybe Int. Purpose: convert an ASCII
decimal digit to its numeric value. Domain: all Char values; codomain:
Maybe Int. Valid subset: '0' through '9'. Return Just d with 0<=d<=9
and the corresponding decimal value for valid input, Nothing otherwise.
This is total on Char. A character outside ASCII '0'..'9' is invalid
for this contract even if a broader Unicode predicate calls it numeric.
Check the adjacent boundary characters '/' and ':'.
-}

-- Read the question: Write a definition; digitValue has input/result type Char -> Maybe Int.
-- Plan: Identify the valid subset, check its boundaries, then implement its postcondition.
digitValue :: Char -> Maybe Int
digitValue c
  | c >= '0' && c <= '9' = Just (fromEnum c - fromEnum '0')
  | otherwise = Nothing -- Invalid input is represented in the codomain.

main :: IO ()
main = do
  print (digitValue '0')  -- expected: Just 0
  print (digitValue '9')  -- expected: Just 9
  print (digitValue '5')  -- expected: Just 5
  print (digitValue '/')  -- expected: Nothing
  print (digitValue ':')  -- expected: Nothing
  print (digitValue 'a')  -- expected: Nothing
