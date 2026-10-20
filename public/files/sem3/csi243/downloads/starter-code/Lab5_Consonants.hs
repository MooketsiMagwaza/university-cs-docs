-- Title: Produce the uppercase consonants of an alphabet.
{-
QUESTION
Using a comprehension, define upperConsonants :: String -> String.
Given alphabet = ['a'..'z'], produce the uppercase consonants (not
vowels). Also accept any list of lowercase alphabetic letters.
Define isVowel :: Char -> Bool and toUpperCase :: Char -> Char as well.
isVowel must recognise vowels in either case.
-}

isVowel :: Char -> Bool
isVowel = undefined -- Your answer here

toUpperCase :: Char -> Char
toUpperCase = undefined -- Your answer here

upperConsonants :: String -> String
upperConsonants = undefined -- Your answer here

main :: IO ()
main = do
  print (upperConsonants "")  -- expected: ""
  print (upperConsonants "a")  -- expected: ""
  print (upperConsonants "abcde")  -- expected: "BCD"
  print (upperConsonants ['a'..'z'])  -- expected: "BCDFGHJKLMNPQRSTVWXYZ"
  print (upperConsonants "xyz")  -- expected: "XYZ"
