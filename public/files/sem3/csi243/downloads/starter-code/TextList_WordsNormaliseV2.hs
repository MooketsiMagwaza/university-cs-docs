-- Title: Split text into words and report their lengths
{-
QUESTION
Write wordLengths :: String -> [Int]. Use words followed by map length.
Tabs and newlines separate words just as spaces do; punctuation stays in a word.
-}

wordLengths :: String -> [Int]
wordLengths = undefined -- Your answer here

main :: IO ()
main = do
  print (wordLengths "")  -- expected: []
  print (wordLengths "x")  -- expected: [1]
  print (wordLengths "  red blue ")  -- expected: [3,4]
  print (wordLengths "a\tbb\nccc")  -- expected: [1,2,3]
  print (wordLengths "hi, all!")  -- expected: [3,4]
