-- Title: Check when splitting and joining preserves exact text
{-
QUESTION
Write lineRoundTrip :: String -> Bool. Test whether unlines (lines s)
is exactly s. Empty text is preserved; nonempty unterminated text is not.
The tests distinguish normalisation from a lossless transformation.
-}

lineRoundTrip :: String -> Bool
lineRoundTrip = undefined -- Your answer here

main :: IO ()
main = do
  print (lineRoundTrip "")  -- expected: True
  print (lineRoundTrip "a")  -- expected: False
  print (lineRoundTrip "a\n")  -- expected: True
  print (lineRoundTrip "\n")  -- expected: True
  print (lineRoundTrip "a\n\nb")  -- expected: False
