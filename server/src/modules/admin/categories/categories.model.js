export const createCategory = (id, name, description) => {
    return{
        id,
        name,
        description,
        isDeleted: false
    };
};
