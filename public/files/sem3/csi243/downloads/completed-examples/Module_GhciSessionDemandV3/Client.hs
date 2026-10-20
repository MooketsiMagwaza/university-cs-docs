module Client (observe) where

import qualified StreamCore as S

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Only the finite prefix is counted; sharing keeps both fields attached to the same prefix.

observe :: Int -> (Int, [Bool])
observe n = (length xs, xs)
  where xs = S.prefix n
