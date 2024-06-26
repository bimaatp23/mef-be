export interface Person {
    id: number
    code: string
    name: string
}

export interface DetailPerson extends Person {
    dob: string
    dod: string | null
    gender: 'Male' | 'Female'
    address: string
    phone: string | null
    status: 'Biological' | 'Married-in'
}