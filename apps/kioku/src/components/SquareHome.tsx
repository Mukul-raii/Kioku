"use client"
import {Squares} from './ui/squares-background'


export const SquareHome = () => {
  return (
    <div className="fixed inset-0 w-full h-full">
        <Squares
          direction="down"
          speed={0.5}
          squareSize={90}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
  )
}
