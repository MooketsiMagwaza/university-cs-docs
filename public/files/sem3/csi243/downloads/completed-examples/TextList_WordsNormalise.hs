-- Title: Normalise arbitrary whitespace between words
{-
QUESTION
Write normaliseWords :: String -> String using words and unwords.
Replace each run of whitespace between words with one space and remove
leading and trailing whitespace. Explain why this is not a lossless round trip.
-}

-- Read the question: Write normaliseWords :: String -> String; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
normaliseWords :: String -> String
-- Key step: the library operation also handles empty input.
normaliseWords = unwords . words

main :: IO ()
main = do
  print (normaliseWords "")  -- expected: ""
  print (normaliseWords "   ")  -- expected: ""
  print (normaliseWords "cat")  -- expected: "cat"
  print (normaliseWords "  red\tblue\n green  ")  -- expected: "red blue green"
  print (normaliseWords "a  b")  -- expected: "a b"
