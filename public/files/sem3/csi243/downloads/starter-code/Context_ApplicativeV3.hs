-- Title: Compare fmap in list, Maybe and Either contexts
{-
QUESTION
Write contexts :: Int -> ([Int], Maybe Int, Either String Int).
Use fmap to square the input in [n,n+1], Just n and Right n.
Also write failures :: Bool -> (Maybe Int, Either String Int):
map (+1) over Nothing and Left "bad" when True, otherwise over Just 0
and Right 0. Show that fmap changes values, not the context's shape.
-}

contexts :: Int -> ([Int], Maybe Int, Either String Int)
contexts = undefined -- Your answer here

failures :: Bool -> (Maybe Int, Either String Int)
failures = undefined -- Your answer here

main :: IO ()
main = do
  print (contexts 0)  -- expected: ([0,1],Just 0,Right 0)
  print (contexts 1)  -- expected: ([1,4],Just 1,Right 1)
  print (contexts (-2))  -- expected: ([4,1],Just 4,Right 4)
  print (failures True)  -- expected: (Nothing,Left "bad")
  print (failures False)  -- expected: (Just 1,Right 1)
