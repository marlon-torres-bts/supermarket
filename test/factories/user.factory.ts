import chance from 'chance'

interface PartialUser {
    firstName?: string
    lastName?: string
    email?: string
}

export interface FilledUser {
    firstName: string
    lastName: string
    email: string
}

export interface UserDB {
    id: string
    first_name: string
    last_name: string
    email: string
    status: string
    created_at: string
    updated_at: string | null
    deleted_at: string | null
}

export function createUser({
    firstName,
    lastName,
    email,
}: PartialUser = {}): FilledUser {
    const user: FilledUser = {
        firstName: firstName || chance().first(),
        lastName: lastName || chance().last(),
        email: email || chance().email(),
    }

    return user
}

export function createUsers(length: number) {
    return Array.from(new Array(length), () => createUser())
}
