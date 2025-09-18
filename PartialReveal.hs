#!/usr/bin/env cabal
{- cabal:
  build-depends: base, optparse-applicative
-}

{-# LANGUAGE LambdaCase #-}

import Options.Applicative
import Control.Monad (join)

type Options = (String, String)
parseOptions :: Parser Options
parseOptions = (,)
  <$> argument str mempty
  <*> argument str mempty
opts :: ParserInfo Options
opts = info (parseOptions <**> helper) $ mconcat
  [ fullDesc
  , progDesc "Insert partial reveals to markdown slides"
  ]

main = do
  (inPath, outPath) <- execParser opts
  content <- readFile inPath
  writeFile outPath $ insertPartialReveals $ lines content

insertPartialReveals :: [String] -> String
insertPartialReveals = unlines . reverse . join . go [] []
  where
    go :: [[String]] -> [String] -> [String] -> [[String]]
    go emittedSlides slide = let
      x = undefined
      in \case
        (line:xs) | line == "---" -> go (slide : emittedSlides) [line] xs
        ("<!-- pause -->":xs) -> go (slide : emittedSlides) slide xs
        (line:xs) -> go emittedSlides (line:slide) xs
        [] -> slide : emittedSlides
