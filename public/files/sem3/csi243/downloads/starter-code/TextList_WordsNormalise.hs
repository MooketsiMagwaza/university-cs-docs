-- Title: Normalise arbitrary whitespace between words
{-
QUESTION
Write normaliseWords :: String -> String using words and unwords.
Replace each run of whitespace between words with one space and remove
leading and trailing whitespace. Explain why this is not a lossless round trip.
-}

normaliseWords :: String -> String
normaliseWords = undefined -- Your answer here

main :: IO ()
main = do
  print (normaliseWords "")  -- expected: ""
  print (normaliseWords "   ")  -- expected: ""
  print (normaliseWords "cat")  -- expected: "cat"
  print (normaliseWords "  red\tblue\n green  ")  -- expected: "red blue green"
  print (normaliseWords "a  b")  -- expected: "a b"
