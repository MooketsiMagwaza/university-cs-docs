-- Title: Specify valid marks and disjoint grade boundaries
{-
QUESTION
Write grade :: Int -> Maybe String. The input domain is Int, but
valid marks are 0..100 inclusive. Return Nothing outside that subset.
For valid marks return Just "fail" below 50, Just "pass" from 50 to 74,
and Just "distinction" from 75 to 100. The postcondition includes both
the valid grade partition and the invalid-input result.
Test both sides of each cut-off; 50 and 75 belong to the higher band.
-}

-- Read the question: Write a definition; grade has input/result type Int -> Maybe String.
-- Plan: Identify the valid subset, check its boundaries, then implement its postcondition.
grade :: Int -> Maybe String
grade mark
  | mark < 0 || mark > 100 = Nothing
  | mark < 50 = Just "fail"
  | mark < 75 = Just "pass"
  | otherwise = Just "distinction" -- All valid marks fall in one band.

main :: IO ()
main = do
  print (grade (-1))  -- expected: Nothing
  print (grade 0)  -- expected: Just "fail"
  print (grade 49)  -- expected: Just "fail"
  print (grade 50)  -- expected: Just "pass"
  print (grade 74)  -- expected: Just "pass"
  print (grade 75)  -- expected: Just "distinction"
  print (grade 100)  -- expected: Just "distinction"
  print (grade 101)  -- expected: Nothing
