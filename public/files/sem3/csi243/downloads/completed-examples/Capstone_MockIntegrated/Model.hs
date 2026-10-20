module Model (Loan(..)) where

data Loan = Loan String [Int] deriving (Eq, Show)
