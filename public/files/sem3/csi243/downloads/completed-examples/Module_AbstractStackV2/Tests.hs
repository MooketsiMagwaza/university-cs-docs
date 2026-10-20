module Tests (checks) where

import Client (inspect, afterPop)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.

checks :: Bool
checks = inspect [] == (Nothing,0) && afterPop ["red","blue"] == Just 1
