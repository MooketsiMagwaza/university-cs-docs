module Tests (checks) where

import Client (answer)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = answer 0 == 0 && answer 3 == 6
