-- Title: Lift addition over two independent Maybe values
{-
QUESTION
Write combine :: Maybe Int -> Maybe Int -> Maybe Int using pure and
<*> to add independent inputs. Return Nothing if either is Nothing.
pure (+) has type Maybe (Int -> Int -> Int). Missing Just wrappers
would be a type error. Applicative has Functor as a superclass.
-}

combine :: Maybe Int -> Maybe Int -> Maybe Int
combine = undefined -- Your answer here

main :: IO ()
main = do
  print (combine (Just 0) (Just 0))  -- expected: Just 0
  print (combine (Just 3) (Just 4))  -- expected: Just 7
  print (combine Nothing (Just 4))  -- expected: Nothing
  print (combine (Just 3) Nothing)  -- expected: Nothing
  print (combine Nothing Nothing)  -- expected: Nothing
  print (combine (Just (-2)) (Just 5))  -- expected: Just 3
