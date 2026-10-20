module Tests (checks) where

import Client (measure)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = measure 0 0 == 0 && measure 2 3 == 10
