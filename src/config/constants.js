module.exports = {
    STATES: {
        WORK: {
            PENDING: 'PENDING',
            REJECTED: 'REJECTED',
            AVAILABLE: 'AVAILABLE',
            INAVAILABLE: 'INAVAILABLE',
            IN_PROGRESS: 'IN_PROGRESS',
            COMPLETED: 'COMPLETED',
            CANCELED: 'CANCELED'
        },
        USER: {
            PENDING: 'PENDING',
            REJECTED: 'REJECTED',
            AVAILABLE: 'AVAILABLE',
            INAVAILABLE: 'INAVAILABLE',
            APPLY_EMPLOYEE: 'APPLY_EMPLOYEE'
        },
        PAYMENT: {
            SUCCESS_STRIPE_PAYMENT_INTENT: 'SUCCESS_STRIPE_PAYMENT_INTENT',
            FAILED_STRIPE_PAYMENT_INTENT: 'FAILED_STRIPE_PAYMENT_INTENT',
            SUCCESS_STRIPE_PAYMENT_CONFIRM: 'SUCCESS_STRIPE_PAYMENT_CONFIRM',
            FAILED_STRIPE_PAYMENT_CONFIRM: 'FAILED_STRIPE_PAYMENT_CONFIRM'
        }
    },
    ROLES: {
        EMPLOYEE: 'EMPLOYEE',
        EMPLOYER: 'EMPLOYER'
    },
    ACTIONS: {
        APPLY_WORK: 'APPLY_WORK',
        APPLY_EMPLOYEE: 'APPLY_EMPLOYEE',
        PAYMENT: 'PAYMENT'
    },
    TYPES: {
        NOTIFICATION: {
            EMAIL: 'EMAIL',
            PUSH: 'PUSH'
        }
    },
    APP: {
        VERSION: '1.0',
    }
}