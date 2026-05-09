import { Text as RNText } from 'react-native';
import { tv } from 'tailwind-variants';

const textStyles = tv({
    base: 'text-white',
    variants: {
        size: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-xl font-semibold',
            xl: 'text-3xl font-bold',
        },
    },
    defaultVariants: {
        size: 'md',
    },
});

export function Text({
    children,
    size,
}: React.PropsWithChildren<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>) {
    return <RNText className={textStyles({ size })}>{children}</RNText>;
}
