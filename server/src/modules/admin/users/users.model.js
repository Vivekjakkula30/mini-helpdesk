export const createUser = (id, name, email, role) => {
    return {
        id,
        name,
        email,
        role,
        isDeleted: false
    };
};