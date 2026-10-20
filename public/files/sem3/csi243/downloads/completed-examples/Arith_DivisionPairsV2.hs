-- Title: Check the quotRem reconstruction identity
{-
QUESTION
Write divisionCheck for Integer inputs a and nonzero b. Use quotRem.
Return (q,r,a == q*b+r), where (q,r) is the division pair.
Include all four sign combinations and a zero dividend.
-}

-- Read the question: Write a function returning an Integer, Integer, Bool triple.
-- Plan: Bind the quotient and remainder once, then reconstruct the dividend.
divisionCheck :: Integer -> Integer -> (Integer, Integer, Bool)
-- Key step: both conventions obey a = q*b+r.
divisionCheck a b = (q,r,a == q*b+r)
  where
    (q,r) = a `quotRem` b

main :: IO ()
main = do
  print (divisionCheck 7 3)  -- expected: (2,1,True)
  print (divisionCheck (-7) 3)  -- expected: (-2,-1,True)
  print (divisionCheck 7 (-3))  -- expected: (-2,1,True)
  print (divisionCheck (-7) (-3))  -- expected: (2,-1,True)
  print (divisionCheck 0 3)  -- expected: (0,0,True)
