import { motion } from 'framer-motion'

const ScrollRevealItem = ({
    children,
    className,
    delay = 0,
    direction = 'up',
    tag = 'div',
    duration = 0.5
}) => {
    const Component = motion[tag] || motion.div

    const getInitialVariants = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 50 }
            case 'down': return { opacity: 0, y: -50 }
            case 'left': return { opacity: 0, x: 50 } // Slide from Right
            case 'right': return { opacity: 0, x: -50 } // Slide from Left
            case 'zoom': return { opacity: 0, scale: 0.8 }
            default: return { opacity: 0, y: 50 }
        }
    }

    const getTargetVariants = () => {
        switch (direction) {
            case 'zoom': return { opacity: 1, scale: 1 }
            default: return { opacity: 1, x: 0, y: 0 }
        }
    }

    return (
        <Component
            initial={getInitialVariants()}
            whileInView={getTargetVariants()}
            viewport={{ once: true, margin: "-80px" }} // Trigger slightly before element is fully in view
            transition={{
                duration: duration,
                delay: delay * 0.1, // 0.1s multiplier for clearer staggering
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </Component>
    )
}

export default ScrollRevealItem
