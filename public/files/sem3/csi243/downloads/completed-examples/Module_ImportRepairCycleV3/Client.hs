module Client (process) where

import Shared (Request)
import qualified TransformCore as T

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Client depends on Core and Shared; Core never imports Client.

process :: Request -> Request
process = T.applyRule negate
