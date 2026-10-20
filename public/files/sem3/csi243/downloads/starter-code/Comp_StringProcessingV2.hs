-- Title: Extract lowercase vowels with a comprehension
{-
QUESTION
Write vowels :: String -> String using a comprehension. [3]
Keep only characters in "aeiou"; uppercase vowels are excluded.
-}

vowels :: String -> String
vowels = undefined  -- Your answer here

main :: IO ()
main = do
  print (vowels "")  -- expected: ""
  print (vowels "b")  -- expected: ""
  print (vowels "education")  -- expected: "euaio"
  print (vowels "AEIOU")  -- expected: ""
  print (vowels "banana")  -- expected: "aaa"
