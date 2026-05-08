import { Pressable, Text } from 'react-native'
import { tv } from 'tailwind-variants'

const buttonStyles = tv({
    base: 'rounded-xl px-4 py-3 items-center justify-center',
    variants: {
        variant: {
            primary: 'bg-primary',
            secondary: 'bg-slate-700',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
})

export function Button({
                           title,
                           onPress,
                           variant,
                       }: {
    title: string
    onPress?: () => void
    variant?: 'primary' | 'secondary'
}) {
    return (
        <Pressable
            className={buttonStyles({ variant })}
            onPress={onPress}
        >
            <Text className="text-white font-semibold">{title}</Text>
        </Pressable>
    )
}
