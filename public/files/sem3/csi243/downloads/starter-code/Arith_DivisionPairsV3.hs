-- Title: Check the divMod reconstruction identity
{-
QUESTION
Write divisionCheck for Integer inputs a and nonzero b. Use divMod.
Return whether a == q*b+r and abs r < abs b.
Include all four sign combinations and a zero dividend.
-}

divisionCheck :: Integer -> Integer -> Bool
divisionCheck = undefined -- Your answer here

main :: IO ()
main = do
  print (divisionCheck 7 3)  -- expected: True
  print (divisionCheck (-7) 3)  -- expected: True
  print (divisionCheck 7 (-3))  -- expected: True
  print (divisionCheck (-7) (-3))  -- expected: True
  print (divisionCheck 0 3)  -- expected: True
