-- Title: Produce lowercase consonants from uppercase letters.
{-
QUESTION
Using a comprehension, define lowerConsonants :: String -> String.
Given a string of uppercase letters, keep the consonants and convert
them to lowercase.
Define isVowel :: Char -> Bool and toLowerCase :: Char -> Char as well.
isVowel must recognise vowels in either case.
-}

import Data.Char (toLower)

-- Read the question: Write Char helpers and a String-to-String comprehension.
-- Plan: Select the requested letters and convert their case.
isVowel :: Char -> Bool
-- Membership covers both cases.
isVowel c = c `elem` "aeiouAEIOU"

toLowerCase :: Char -> Char
-- Use the base character conversion.
toLowerCase = toLower

lowerConsonants :: String -> String
-- The predicate retains the requested letters.
lowerConsonants xs = [toLowerCase c | c <- xs, not (isVowel c)]

main :: IO ()
main = do
  print (lowerConsonants "")  -- expected: ""
  print (lowerConsonants "A")  -- expected: ""
  print (lowerConsonants "ABCDE")  -- expected: "bcd"
  print (lowerConsonants "XYZ")  -- expected: "xyz"
  print (lowerConsonants "HELLO")  -- expected: "hll"
