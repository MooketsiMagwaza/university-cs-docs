module Client (measure) where

import Geometry (diagonalSquared)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- An ordinary import allows both qualified and unqualified uses of the imported function.

measure :: Int -> Int -> Int
measure w h = Geometry.diagonalSquared w h
