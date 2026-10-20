-- Title: Check the divMod reconstruction identity
{-
QUESTION
Write divisionCheck for Integer inputs a and nonzero b. Use divMod.
Return whether a == q*b+r and abs r < abs b.
Include all four sign combinations and a zero dividend.
-}

-- Read the question: Write a function returning Bool.
-- Plan: Bind the quotient and remainder once, then reconstruct the dividend.
divisionCheck :: Integer -> Integer -> Bool
-- Key step: both conventions obey a = q*b+r.
divisionCheck a b = a == q*b+r && abs r < abs b
  where
    (q,r) = a `divMod` b

main :: IO ()
main = do
  print (divisionCheck 7 3)  -- expected: True
  print (divisionCheck (-7) 3)  -- expected: True
  print (divisionCheck 7 (-3))  -- expected: True
  print (divisionCheck (-7) (-3))  -- expected: True
  print (divisionCheck 0 3)  -- expected: True
