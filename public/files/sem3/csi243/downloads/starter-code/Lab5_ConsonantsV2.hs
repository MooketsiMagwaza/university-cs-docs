-- Title: Produce uppercase vowels from a string.
{-
QUESTION
Using a comprehension, define upperVowels :: String -> String.
Given a string of lowercase letters, keep the vowels and convert them
to uppercase.
Define isVowel :: Char -> Bool and toUpperCase :: Char -> Char as well.
isVowel must recognise vowels in either case.
-}

isVowel :: Char -> Bool
isVowel = undefined -- Your answer here

toUpperCase :: Char -> Char
toUpperCase = undefined -- Your answer here

upperVowels :: String -> String
upperVowels = undefined -- Your answer here

main :: IO ()
main = do
  print (upperVowels "")  -- expected: ""
  print (upperVowels "a")  -- expected: "A"
  print (upperVowels "abcde")  -- expected: "AE"
  print (upperVowels "xyz")  -- expected: ""
  print (upperVowels "education")  -- expected: "EUAIO"
