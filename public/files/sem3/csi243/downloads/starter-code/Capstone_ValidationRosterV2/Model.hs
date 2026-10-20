module Model (Student(..)) where

data Student = Student String [Int] deriving (Eq, Show)
