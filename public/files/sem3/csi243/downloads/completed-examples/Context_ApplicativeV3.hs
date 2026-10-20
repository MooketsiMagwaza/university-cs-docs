-- Title: Compare fmap in list, Maybe and Either contexts
{-
QUESTION
Write contexts :: Int -> ([Int], Maybe Int, Either String Int).
Use fmap to square the input in [n,n+1], Just n and Right n.
Also write failures :: Bool -> (Maybe Int, Either String Int):
map (+1) over Nothing and Left "bad" when True, otherwise over Just 0
and Right 0. Show that fmap changes values, not the context's shape.
-}

-- Read the question: Write a definition; contexts has input/result type Int -> ([Int], Maybe Int, Either String Int).
-- Plan: Lift the stated function and apply its independent wrapped arguments in order.
contexts :: Int -> ([Int], Maybe Int, Either String Int)
contexts n = (fmap square [n,n+1], fmap square (Just n), fmap square (Right n))
  where square x = x * x

failures :: Bool -> (Maybe Int, Either String Int)
failures True = (fmap (+ 1) Nothing, fmap (+ 1) (Left "bad"))
failures False = (fmap (+ 1) (Just 0), fmap (+ 1) (Right 0))

main :: IO ()
main = do
  print (contexts 0)  -- expected: ([0,1],Just 0,Right 0)
  print (contexts 1)  -- expected: ([1,4],Just 1,Right 1)
  print (contexts (-2))  -- expected: ([4,1],Just 4,Right 4)
  print (failures True)  -- expected: (Nothing,Left "bad")
  print (failures False)  -- expected: (Just 1,Right 1)
