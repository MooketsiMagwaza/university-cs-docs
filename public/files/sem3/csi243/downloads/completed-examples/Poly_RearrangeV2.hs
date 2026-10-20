-- Title: Duplicate a value polymorphically
{-
QUESTION
Write duplicate :: a -> (a,a) without class constraints. [3]
Both components of the result must contain the supplied value.
-}

-- Read the question: Write duplicate :: a -> (a,a).
-- Plan: Reuse the same argument in both tuple positions.
duplicate :: a -> (a,a)
duplicate x = (x,x)  -- No equality, arithmetic or display is needed.

main :: IO ()
main = do
  print (duplicate (0 :: Int))  -- expected: (0,0)
  print (duplicate True)  -- expected: (True,True)
  print (duplicate 'a')  -- expected: ('a','a')
  print (duplicate "")  -- expected: ("","")
  print (duplicate ([] :: [Int]))  -- expected: ([],[])
