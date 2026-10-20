-- Title: Duplicate a value polymorphically
{-
QUESTION
Write duplicate :: a -> (a,a) without class constraints. [3]
Both components of the result must contain the supplied value.
-}

duplicate :: a -> (a,a)
duplicate = undefined  -- Your answer here

main :: IO ()
main = do
  print (duplicate (0 :: Int))  -- expected: (0,0)
  print (duplicate True)  -- expected: (True,True)
  print (duplicate 'a')  -- expected: ('a','a')
  print (duplicate "")  -- expected: ("","")
  print (duplicate ([] :: [Int]))  -- expected: ([],[])
