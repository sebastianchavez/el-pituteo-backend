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