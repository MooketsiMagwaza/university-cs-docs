module Tests (checks) where

import Client (report)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = report 0 == (20,19) && report 20 == (0,-1)
