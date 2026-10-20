-- Title: Obtain endpoints without requiring enumeration
{-
QUESTION
Write endpoints :: Bounded a => a -> (a,a). The argument only fixes
the result type; return minBound and maxBound without requiring Enum.
Demonstrate Bool, Ordering and pairs of these bounded types. (4 marks)
The pair type is Bounded but has no standard Enum instance: the endpoint
operation still works. An ignored argument need not be inspected.
-}

-- Read the question: Write a Bounded-only endpoint function from a type witness to a pair.
-- Plan: Ignore the witness and use the two Bounded methods.
endpoints :: Bounded a => a -> (a,a)
-- No enumeration method is used, so no Enum constraint belongs here.
endpoints _ = (minBound, maxBound)

main :: IO ()
main = do
  print (endpoints False)  -- expected: (False,True)
  print (endpoints LT)  -- expected: (LT,GT)
  print (endpoints (False,LT))  -- expected: ((False,LT),(True,GT))
  print (endpoints (True,False))  -- expected: ((False,False),(True,True))
  print (endpoints (EQ,GT))  -- expected: ((LT,LT),(GT,GT))
