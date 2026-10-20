-- Title: Check when splitting and joining preserves exact text
{-
QUESTION
Write lineRoundTrip :: String -> Bool. Test whether unlines (lines s)
is exactly s. Empty text is preserved; nonempty unterminated text is not.
The tests distinguish normalisation from a lossless transformation.
-}

-- Read the question: Write lineRoundTrip :: String -> Bool; use the stated input and result types.
-- Plan: Apply the named library operation; retain its documented order and empty case.
lineRoundTrip :: String -> Bool
-- Key step: the library operation also handles empty input.
lineRoundTrip s = unlines (lines s) == s

main :: IO ()
main = do
  print (lineRoundTrip "")  -- expected: True
  print (lineRoundTrip "a")  -- expected: False
  print (lineRoundTrip "a\n")  -- expected: True
  print (lineRoundTrip "\n")  -- expected: True
  print (lineRoundTrip "a\n\nb")  -- expected: False
