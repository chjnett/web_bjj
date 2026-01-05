import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const TypewriterText = ({
    text,
    startDelay = 0,
    speed = 40,
    className = '',
    htmlTag = 'span',
    onComplete
}) => {
    const [displayedText, setDisplayedText] = useState('')
    const [started, setStarted] = useState(false)
    const [complete, setComplete] = useState(false)
    const ref = useRef(null)

    // margin: 200px -> start typing when card is well into view?
    // User wants "Card appears first, THEN text".
    // Card scroll animation logic is Scrubbing.
    // Actually, let's trigger when the element is IN VIEW.
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    useEffect(() => {
        if (isInView && !started) {
            const timeout = setTimeout(() => {
                setStarted(true)
            }, startDelay)
            return () => clearTimeout(timeout)
        }
    }, [isInView, startDelay, started])

    useEffect(() => {
        if (started && !complete) {
            if (displayedText.length < text.length) {
                const timeout = setTimeout(() => {
                    setDisplayedText(text.slice(0, displayedText.length + 1))
                }, speed)
                return () => clearTimeout(timeout)
            } else {
                setComplete(true)
                if (onComplete) onComplete()
            }
        }
    }, [started, complete, displayedText, text, speed, onComplete])

    const Component = htmlTag

    return (
        <Component ref={ref} className={className}>
            {displayedText}
            {started && !complete && <span className="animate-pulse inline-block w-[2px] h-[1em] bg-current align-middle ml-1"></span>}
        </Component>
    )
}

export default TypewriterText
