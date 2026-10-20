module Tests (checks) where

import Client (classify, acceptedValue)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = classify (-1) == Nothing && acceptedValue 10 == Just 10
