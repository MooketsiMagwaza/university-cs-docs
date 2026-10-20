module Tests (checks) where

import Client (process)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = process [] == [] && process [1,2] == [2,3]
