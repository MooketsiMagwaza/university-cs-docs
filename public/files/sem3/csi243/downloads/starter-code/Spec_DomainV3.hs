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

grade :: Int -> Maybe String
grade = undefined -- Your answer here

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
