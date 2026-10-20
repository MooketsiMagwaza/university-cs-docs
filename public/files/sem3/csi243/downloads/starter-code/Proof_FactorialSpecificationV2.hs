-- Title: Prove an inclusive range product including reversed bounds
{-
QUESTION
Write rangeProduct :: Integer -> Integer -> Integer with
rangeProduct lo hi = 1 when lo>hi, otherwise
lo * rangeProduct (lo+1) hi. Prove equality to product [lo..hi]
for all Integer bounds, including negative and reversed bounds.
Induct on interval length max 0 (hi-lo+1). State the product identity
used and termination separately. Also write rangeCheck returning the
computed product and whether it equals the specification.
No input bounds are invalid: reversed bounds denote the empty product.
-}

rangeProduct :: Integer -> Integer -> Integer
rangeProduct = undefined -- Your answer here

rangeCheck :: Integer -> Integer -> (Integer, Bool)
rangeCheck = undefined -- Your answer here

main :: IO ()
main = do
  print (rangeCheck 3 1)  -- expected: (1,True)
  print (rangeCheck 0 0)  -- expected: (0,True)
  print (rangeCheck 1 1)  -- expected: (1,True)
  print (rangeCheck 2 4)  -- expected: (24,True)
  print (rangeCheck (-3) (-1))  -- expected: (-6,True)
  print (rangeCheck (-2) 2)  -- expected: (0,True)
