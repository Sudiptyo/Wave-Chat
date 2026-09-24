import type { ComponentType, CSSProperties } from "react"

interface AuthSection {

    registration: {

        heading: {
            icon?: ComponentType<{
                className?: string
                style?: CSSProperties
            }>

            heading: string
            description: string

        },

        formData: {

            image: {
                label: string
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
            }

            fullName: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },

            userName: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },

            mobile: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },

            password: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },
        }

        createButton: {
            text: string
            icon?: ComponentType<{
                className?: string
                style?: CSSProperties
            }>
        }

        divider: {
            text: string
        }

        googleLogin: {

            text: string
            icon: ComponentType<{
                className?: string
                style?: CSSProperties
            }>

        }

        description: {
            text: string,
            termsOfService: {
                text: string,
                link: string
            },
            privacyPolicy: {
                text: string,
                link: string
            },
        }

    },

    login: {

        heading: {
            icon?: ComponentType<{
                className?: string
                style?: CSSProperties
            }>

            heading: string
            description: string

        },

        formData: {

            mobileOrEmail: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },

            password: {
                label: string,
                icon?: ComponentType<{
                    className?: string
                    style?: CSSProperties
                }>
                placeholder: string
            },
        }

        loginButton: {
            text: string
            icon?: ComponentType<{
                className?: string
                style?: CSSProperties
            }>
        }

        divider: {
            text: string
        }

        googleLogin: {

            text: string
            icon: ComponentType<{
                className?: string
                style?: CSSProperties
            }>

        },

        description: {
            text: string,
            termsOfService: {
                text: string,
                link: string
            },
            privacyPolicy: {
                text: string,
                link: string
            },
        }
    }
}

const AuthSectionDAta: AuthSection = {
    registration: {
        heading: {
            heading: "Create Your WaveChat account",
            description: "Set up your chat identity in a few simple steps"
        },
        formData: {
            image: {
                label: "Add Photo"
            },
            fullName: {
                label: "Full Name",
                placeholder: "Enter your full name"
            },
            userName: {
                label: "Username",
                placeholder: "Enter your username"
            },
            mobile: {
                label: "Mobile Number",
                placeholder: "Enter your mobile number"
            },
            password: {
                label: "Password",
                placeholder: "Create a password"
            },
        },
        createButton: {
            text: "Create Account",
        },
        

    }
}