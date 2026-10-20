module TransformCore (applyRule) where

import Shared (Request)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Pass behaviour as a function argument; no parameterised module syntax is needed.

applyRule :: (Int -> Int) -> Request -> Request
applyRule rule xs = map rule xs
