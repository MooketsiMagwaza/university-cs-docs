-- Title: Check both De Morgan translations on Boolean lists
{-
QUESTION
Write deMorgan :: [Bool] -> (Bool, Bool, Bool, Bool). Return, in order:
not (and xs), any not xs, not (or xs), all not xs.
The first two results must agree, as must the final two.
For [] use and []=True and or []=False: vacuous truth matters.
Postcondition: first==second and third==fourth.
The domain is all finite Boolean lists, including empty and singleton.
-}

-- Read the question: Write a definition; deMorgan has input/result type [Bool] -> (Bool, Bool, Bool, Bool).
-- Plan: Translate each logical connective literally, including empty-domain identities.
deMorgan :: [Bool] -> (Bool, Bool, Bool, Bool)
deMorgan xs = (not (and xs), any not xs, not (or xs), all not xs)

main :: IO ()
main = do
  print (deMorgan [])  -- expected: (False,False,True,True)
  print (deMorgan [True])  -- expected: (False,False,False,False)
  print (deMorgan [False])  -- expected: (True,True,True,True)
  print (deMorgan [True,False])  -- expected: (True,True,False,False)
  print (deMorgan [True,True])  -- expected: (False,False,False,False)
