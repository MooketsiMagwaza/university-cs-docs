-- Title: Check a digit contract after safe indexing
{-
QUESTION
Write doubleDigitAt :: [Int] -> Int -> Either String Int.
Safely select the zero-based element; invalid indices give Left "index".
Then accept a selected value only in 0..9 and return twice it; otherwise
give Left "digit". A valid index does not guarantee a valid digit, so
the second precondition must be checked separately. Index equal to
length is invalid. The total wrapper accepts finite lists and all Int
indices. On valid descent the remaining list length strictly decreases.
-}

doubleDigitAt :: [Int] -> Int -> Either String Int
doubleDigitAt = undefined -- Your answer here

main :: IO ()
main = do
  print (doubleDigitAt [] 0)  -- expected: Left "index"
  print (doubleDigitAt [0] 0)  -- expected: Right 0
  print (doubleDigitAt [9] 0)  -- expected: Right 18
  print (doubleDigitAt [10] 0)  -- expected: Left "digit"
  print (doubleDigitAt [2] 1)  -- expected: Left "index"
  print (doubleDigitAt [2] (-1))  -- expected: Left "index"
