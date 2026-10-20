module Tests (checks) where

import Client (observe)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = observe 0 == (0,[]) && observe 3 == (3,[2,4,6])
