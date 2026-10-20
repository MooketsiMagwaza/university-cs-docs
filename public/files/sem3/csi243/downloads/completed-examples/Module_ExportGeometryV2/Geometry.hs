module Geometry (perimeter) where

type Length = Int

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Length is hidden by the export list; its Int representation is still known internally.

perimeter :: Length -> Length -> Int
perimeter w h = 2 * (w + h)
