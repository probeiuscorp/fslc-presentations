module Split (split) where

-- | Unfortunately not part of the Haskell prelude!
-- which is insane given how big the prelude is...
-- taken from https://gist.github.com/kevinadi/ee3d4a1866c0938e3da7
split :: Char -> String -> [String]
split ch s =  case dropWhile (== ch) s of
  "" -> []
  s' -> w : split ch s''
    where (w, s'') = break (== ch) s'

mapAdjacent :: (a -> a -> b) -> [a] -> [b]
mapAdjacent f (x1:xs@(x2:_)) = f x1 x2 : mapAdjacent f xs
mapAdjacent _ _ = []
