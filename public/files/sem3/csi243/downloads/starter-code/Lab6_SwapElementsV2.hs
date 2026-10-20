-- Title: Rotate three independently typed tuple elements.
{-
QUESTION
Write rotateElements :: (a,b,c) -> (b,c,a). Move the first element
of the triple to the end. Keep the function polymorphic in all three
element types.
-}

rotateElements :: (a, b, c) -> (b, c, a)
rotateElements = undefined -- Your answer here

main :: IO ()
main = do
  print (rotateElements (1 :: Int,2 :: Int,3 :: Int))  -- expected: (2,3,1)
  print (rotateElements (0 :: Int,False,""))  -- expected: (False,"",0)
  print (rotateElements ('x',True,2 :: Int))  -- expected: (True,2,'x')
  print (rotateElements ((),(),()))  -- expected: ((),(),())
  print (rotateElements ("one","two","three"))  -- expected: ("two","three","one")
