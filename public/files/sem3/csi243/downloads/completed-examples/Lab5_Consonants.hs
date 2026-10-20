-- Title: Produce the uppercase consonants of an alphabet.
{-
QUESTION
Using a comprehension, define upperConsonants :: String -> String.
Given alphabet = ['a'..'z'], produce the uppercase consonants (not
vowels). Also accept any list of lowercase alphabetic letters.
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

upperConsonants :: String -> String
-- The predicate retains the requested letters.
upperConsonants xs = [toUpperCase c | c <- xs, not (isVowel c)]

main :: IO ()
main = do
  print (upperConsonants "")  -- expected: ""
  print (upperConsonants "a")  -- expected: ""
  print (upperConsonants "abcde")  -- expected: "BCD"
  print (upperConsonants ['a'..'z'])  -- expected: "BCDFGHJKLMNPQRSTVWXYZ"
  print (upperConsonants "xyz")  -- expected: "XYZ"
