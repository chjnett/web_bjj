import { useRef, useEffect, useState } from 'react'
import { motion, useTransform, useSpring } from 'framer-motion'

// Helper Component for Scroll-based Typing
const ScrollDrivenText = ({ text, progress, range, htmlTag = "span", className = "" }) => {
    const [displayText, setDisplayText] = useState("")
    // Map global progress to local progress [0, 1] within the specific range
    const localProgress = useTransform(progress, range, [0, 1], { clamp: true })

    useEffect(() => {
        const unsub = localProgress.on("change", (latest) => {
            const charCount = Math.floor(latest * text.length)
            setDisplayText(text.slice(0, charCount))
        })
        return () => unsub()
    }, [localProgress, text])

    const Component = motion[htmlTag]

    return (
        <Component className={className}>
            {displayText}
            {/* Optional Cursor Effect if typing is active but not finished */}
            {/* {displayText.length < text.length && displayText.length > 0 && (
          <span className="inline-block w-[2px] h-[1em] bg-red-600 ml-1 animate-pulse" />
      )} */}
        </Component>
    )
}

export default ScrollDrivenText
