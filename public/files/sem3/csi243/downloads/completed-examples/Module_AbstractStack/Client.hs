module Client (inspect, afterPop) where

import StackCore (Stack, empty, push, pop, peek, size)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- foldr pushes the first input last, so it becomes the top. pop handles the empty case.

inspect :: [Int] -> (Maybe Int, Int)
inspect xs = (peek stack, size stack)
  where stack = foldr push empty xs

afterPop :: [Int] -> Maybe Int
afterPop xs = case pop (foldr push empty xs) of
  Nothing -> Nothing
  Just (_, rest) -> Just (size rest)
