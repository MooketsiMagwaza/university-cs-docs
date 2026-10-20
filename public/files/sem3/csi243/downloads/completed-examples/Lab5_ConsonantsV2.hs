-- Title: Produce uppercase vowels from a string.
{-
QUESTION
Using a comprehension, define upperVowels :: String -> String.
Given a string of lowercase letters, keep the vowels and convert them
to uppercase.
Define isVowel :: Char -> Bool and toUpperCase :: Char -> Char as well.
isVowel must recognise vowels in either case.
-}

import Data.Char (toUpper)

-- Read the question: Write Char helpers and a String-to-String comprehension.
-- Plan: Select the requested letters and convert their case.
isVowel :: Char -> Bool
-- Membership covers both cases.
isVowel c = c `elem` "aeiouAEIOU"

toUpperCase :: Char -> Char
-- Use the base character conversion.
toUpperCase = toUpper

upperVowels :: String -> String
-- The predicate retains the requested letters.
upperVowels xs = [toUpperCase c | c <- xs, isVowel c]

main :: IO ()
main = do
  print (upperVowels "")  -- expected: ""
  print (upperVowels "a")  -- expected: "A"
  print (upperVowels "abcde")  -- expected: "AE"
  print (upperVowels "xyz")  -- expected: ""
  print (upperVowels "education")  -- expected: "EUAIO"
