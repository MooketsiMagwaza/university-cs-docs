-- Title: Produce lowercase consonants from uppercase letters.
{-
QUESTION
Using a comprehension, define lowerConsonants :: String -> String.
Given a string of uppercase letters, keep the consonants and convert
them to lowercase.
Define isVowel :: Char -> Bool and toLowerCase :: Char -> Char as well.
isVowel must recognise vowels in either case.
-}

isVowel :: Char -> Bool
isVowel = undefined -- Your answer here

toLowerCase :: Char -> Char
toLowerCase = undefined -- Your answer here

lowerConsonants :: String -> String
lowerConsonants = undefined -- Your answer here

main :: IO ()
main = do
  print (lowerConsonants "")  -- expected: ""
  print (lowerConsonants "A")  -- expected: ""
  print (lowerConsonants "ABCDE")  -- expected: "bcd"
  print (lowerConsonants "XYZ")  -- expected: "xyz"
  print (lowerConsonants "HELLO")  -- expected: "hll"
