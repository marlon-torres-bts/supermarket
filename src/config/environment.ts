export function getEnvVar(
    name: string,
    defaultValue?: string
): string | undefined {
    const val = process.env[name]

    if (val) {
        return val
    } else {
        console.warn(
            `Env Variable not set: "${name}" - defaulting to "${defaultValue}"`
        )
        return defaultValue
    }
}
