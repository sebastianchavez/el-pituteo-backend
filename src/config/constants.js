module.exports = {
    STATES: {
        WORK: {
            PENDING: 'PENDING',
            REJECTED: 'REJECTED',
            AVAILABLE: 'AVAILABLE',
            IN_PROGRESS: 'IN_PROGRESS',
            COMPLETED: 'COMPLETED',
            CANCELED: 'CANCELED'
        },
        USER: {
            PENDING: 'PENDING',
            REJECTED: 'REJECTED',
            AVAILABLE: 'AVAILABLE',
            APPLY_EMPLOYEE: 'APPLY_EMPLOYEE'
        },
        PAYMENT: {
            SUCCESS_PAYMENT_INTENT: 'SUCCESS_PAYMENT_INTENT',
            FAILED_PAYMENT_INTENT: 'FAILED_PAYMENT_INTENT',
            SUCCESS_PAYMENT_CONFIRM: 'SUCCESS_PAYMENT_CONFIRM',
            FAILED_PAYMENT_CONFIRM: 'FAILED_PAYMENT_CONFIRM'
        }
    },
    ROLES: {
        EMPLOYEE: 'EMPLOYEE',
        EMPLOYER: 'EMPLOYER'
    },
    ACTIONS: {
        APPLY_WORK: 'APPLY_WORK',
        APPLY_EMPLOYEE: 'APPLY_EMPLOYEE'
    }
}